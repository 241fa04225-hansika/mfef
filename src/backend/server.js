
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
  })
);

app.use(express.json({ limit: "2mb" }));

// Check required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing from .env");
  process.exit(1);
}

// Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const MODEL_NAME = "gemini-3.5-flash-lite";
async function generateAIResponse(prompt) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
  });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error(
        `Gemini attempt ${attempt} failed:`,
        error.message
      );

      const temporaryError =
        /503|429|500|overload|temporarily unavailable/i.test(
          error.message || ""
        );

      // Do not retry errors that are not temporary.
      if (!temporaryError || attempt === 2) {
        throw error;
      }

      // Wait briefly before one retry.
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    }
  }

  throw new Error("AI is temporarily unavailable.");
}


// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error("Only PNG, JPG, and PDF files are supported.")
      );
    }
  },
});

// Home route
app.get("/", (req, res) => {
  res.send("UNDERSTANDX backend is running!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    server: "connected",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// Generate a learning hint
app.post("/api/hint", async (req, res) => {
  try {
    const { question } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    const prompt = `
You are UNDERSTANDX, a friendly learning assistant.

Student's question:
${question.trim()}

Give one useful, short hint.
Help the student think independently.
Do not reveal the complete answer in the hint.
Use simple student-friendly language.
`;

    const hint = await generateAIResponse(prompt);
    res.json({ hint });
  } catch (error) {
    console.error("Hint error:", error.message);
    res.status(503).json({
      error: "AI hint is temporarily unavailable. Please try again.",
    });
  }
});

// Generate a full answer
app.post("/api/answer", async (req, res) => {
  try {
    const { question } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    const prompt = `
You are UNDERSTANDX, a friendly learning assistant.

Answer this question:
${question.trim()}

Explain the answer step by step in simple language.
Use headings and examples when useful.
Point out uncertainty instead of inventing facts.
`;

    const answer = await generateAIResponse(prompt);
    res.json({ answer });
  } catch (error) {
    console.error("Answer error:", error.message);
    res.status(503).json({
      error: "AI answer is temporarily unavailable. Please try again.",
    });
  }
});

// Analyze typed text

app.post("/api/flashcards", async (req, res) => {
  try {
    const { subject, topic, difficulty, count } = req.body;

    // Validate the input
    if (
      typeof subject !== "string" ||
      typeof topic !== "string" ||
      typeof difficulty !== "string" ||
      !subject.trim() ||
      !topic.trim()
    ) {
      return res.status(400).json({
        error: "Please provide a subject and topic.",
      });
    }

    const numberOfCards = Number(count);

    if (![5, 10, 15].includes(numberOfCards)) {
      return res.status(400).json({
        error: "Number of cards must be 5, 10, or 15.",
      });
    }

    const prompt = `
You are an expert college tutor creating educational flashcards.

Generate exactly ${numberOfCards} flashcards.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Rules:
1. Every question must belong specifically to the selected subject and topic.
2. Do not include questions from unrelated subjects.
3. Use clear, accurate, student-friendly language.
4. Match the requested difficulty.
5. Make each question different.
6. Answers should be concise but useful for revision.
7. Include one short takeaway for each card.

Return ONLY a valid JSON array. Do not include Markdown
or code fences. Follow this exact structure:

[
  {
    "question": "A clear question",
    "answer": "A correct answer",
    "takeaway": "One key point to remember"
  }
]
`;

    // Uses the existing Gemini helper in server.js
    let raw = await generateAIResponse(prompt);

    // Remove Markdown code fences if Gemini adds them
    raw = raw
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "");

    // Extract the JSON array
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");

    if (start === -1 || end === -1 || end < start) {
      throw new Error("AI did not return a valid flashcard array.");
    }

    const parsed = JSON.parse(raw.slice(start, end + 1));

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("No flashcards were generated.");
    }

    const cards = parsed
      .slice(0, numberOfCards)
      .map((card) => ({
        question: String(card.question || "").trim(),
        answer: String(card.answer || "").trim(),
        takeaway: String(card.takeaway || "").trim(),
      }))
      .filter((card) => card.question && card.answer);

    if (cards.length !== numberOfCards) {
      throw new Error("AI returned incomplete flashcards. Please try again.");
    }

    return res.json({ cards });
  } catch (error) {
    console.error("Flashcard generation error:", error.message);

    return res.status(500).json({
      error: "Unable to generate flashcards. Please try again.",
    });
  }
});

app.post("/api/verify-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        error: "Please enter text to analyze.",
      });
    }

    const prompt = `
You are UNDERSTANDX, an educational answer-review assistant.

Review the following student submission:
"""
${text.trim()}
"""

Create a clear report with these sections:

1. Overall assessment
2. Correct points
3. Possible mistakes or inaccuracies
4. Missing information
5. Suggested corrections
6. Improved answer, if appropriate

If the submission is only a question, explain that a student's
answer is needed to assess correctness.

If it is an essay or lab report, assess clarity, completeness,
and factual consistency where possible.

Do not invent facts. Identify uncertain points.
Do not claim independent verification unless a real check was done.
Use simple language.
`;

    const report = await generateAIResponse(prompt);
    res.json({ report });
  } catch (error) {
    console.error("Text verification error:", error.message);
    res.status(503).json({
      error: "Text analysis is temporarily unavailable. Please try again.",
    });
  }
});

// Analyze an uploaded PDF, PNG, or JPG file
app.post("/api/verify-document", (req, res) => {
  upload.single("document")(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({
        error: uploadError.message || "File upload failed.",
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Please select a document.",
        });
      }

      const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
      });

      const prompt = `
You are UNDERSTANDX, an educational document-review assistant.

Analyze the attached document. Read its visible or extractable content.

Prepare a report with these sections:

1. Document topic and content identified
2. Main points detected
3. Correct points, where assessable
4. Possible mistakes or inaccuracies
5. Missing information
6. Suggested corrections
7. Overall assessment

For documents containing questions but no answers, do not mark the
questions wrong. Explain that answers are needed for correctness review.

For unreadable handwriting, blurry images, or unclear pages,
say what could not be read. Do not guess missing content.

Do not claim that every statement has been independently verified.
Use simple, student-friendly language.
`;

      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: req.file.buffer.toString("base64"),
          },
        },
      ]);

      const report = result.response.text();

      res.json({
        filename: req.file.originalname,
        report,
      });
    } catch (error) {
      console.error(
        "Document verification error:",
        error.message
      );

      res.status(503).json({
        error:
          "AI could not analyze this file. Check the file and try again.",
      });
    }
  });
});

// Start server after MongoDB connects
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `UNDERSTANDX server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();
