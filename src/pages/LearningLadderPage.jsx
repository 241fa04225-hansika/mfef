
import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
  CheckCircle2,
  Lightbulb,
  BookOpen,
} from "lucide-react";

import { saveLearningActivity } from "../utils/learningHistory";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const subjectGroups = {
  "Computer Science": [
    "Computer Networks (CN)",
    "Operating Systems",
    "Database Management Systems (DBMS)",
    "Cybersecurity",
    "Data Structures and Algorithms",
  ],
  Programming: ["Python Programming", "Java Programming"],
  "Web Development": [
    "API & Web Development",
    "Modern Front-End Frameworks (MFEF)",
    "React.js",
    "Angular",
    "Vue.js",
    "Next.js",
    "Tailwind CSS",
  ],
  "AI & Machine Learning": [
    "Artificial Intelligence",
    "Machine Learning (ML)",
  ],
  "Mathematics & Science": [
    "Calculus",
    "Linear Algebra",
    "Quantum Physics",
    "Organic Chemistry",
  ],
  Other: ["General / Other"],
};

function getCategoryForSubject(subject) {
  return (
    Object.keys(subjectGroups).find((category) =>
      subjectGroups[category].includes(subject)
    ) || "Computer Science"
  );
}

export default function LearningLadderPage() {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("Machine Learning (ML)");
  const [activeTier, setActiveTier] = useState(1);

  const [hint, setHint] = useState("");
  const [answer, setAnswer] = useState("");

  const [loadingHint, setLoadingHint] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [error, setError] = useState("");

  const isBusy = loadingHint || loadingAnswer;
  const category = getCategoryForSubject(subject);

  function changeCategory(event) {
    const nextCategory = event.target.value;
    setSubject(subjectGroups[nextCategory][0]);
    setError("");
  }

  async function requestAI(endpoint) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: `Subject: ${subject}\nQuestion: ${question.trim()}`,
      }),
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to get a response from AI."
      );
    }

    return data;
  }

  async function handleGenerate(event) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Please enter your question first.");
      return;
    }

    setLoadingHint(true);
    setError("");
    setHint("");
    setAnswer("");
    setActiveTier(1);

    try {
      const data = await requestAI("hint");

      if (!data.hint) {
        throw new Error(
          "The AI did not return a hint. Please try again."
        );
      }

      setHint(data.hint);
    } catch (err) {
      setError(
        err.message || "Could not generate a hint. Please try again."
      );
    } finally {
      setLoadingHint(false);
    }
  }

  async function handleStepByStep() {
    if (!hint) {
      setError("Generate your hint first.");
      setActiveTier(1);
      return;
    }

    setError("");

    if (answer) {
      setActiveTier(2);
      return;
    }

    setLoadingAnswer(true);

    try {
      const data = await requestAI("answer");

      if (!data.answer) {
        throw new Error(
          "The AI did not return an explanation. Please try again."
        );
      }

      setAnswer(data.answer);
      setActiveTier(2);
    } catch (err) {
      setError(
        err.message ||
          "Could not generate the explanation. Please try again."
      );
    } finally {
      setLoadingAnswer(false);
    }
  }

  function handleFullAnswer() {
    if (!answer) {
      setError(
        "Please generate the step-by-step explanation first."
      );
      return;
    }

    setError("");
    setActiveTier(3);
  }

  // Save completed learning activity using the shared history helper.
  function handleReview() {
    setError("");

    if (hint && answer && question.trim()) {
      saveLearningActivity({
        type: "Learning",
        title: question.trim(),
        subject,
        details: "Completed the AI Learning Ladder review.",
        status: "Completed",
      });
    }

    setActiveTier(4);
  }

  function resetLadder() {
    setHint("");
    setAnswer("");
    setError("");
    setQuestion("");
    setActiveTier(1);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 lg:px-12">
      {/* Page heading */}
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#5636D9]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5636D9]">
          <Sparkles size={14} />
          AI-powered learning
        </span>

        <h1 className="text-3xl font-black text-[#1E1B2E] sm:text-4xl">
          AI Learning Ladder
        </h1>

        <p className="text-sm leading-6 text-gray-600">
          Learn at your own pace. Start with a helpful AI hint,
          understand the steps, and reveal the complete answer
          when you are ready.
        </p>
      </div>

      {/* Question form */}
      <div className="mx-auto max-w-4xl rounded-3xl border border-[#5636D9]/20 bg-white p-6 shadow-lg">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="subject-category"
                className="mb-2 block font-bold text-[#1E1B2E]"
              >
                Subject Category
              </label>

              <select
                id="subject-category"
                value={category}
                disabled={isBusy}
                onChange={changeCategory}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-[#5636D9]"
              >
                {Object.keys(subjectGroups).map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="learning-subject"
                className="mb-2 block font-bold text-[#1E1B2E]"
              >
                Select Subject
              </label>

              <select
                id="learning-subject"
                value={subject}
                disabled={isBusy}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setError("");
                }}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-[#5636D9]"
              >
                {subjectGroups[category].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label
            htmlFor="learning-question"
            className="block font-bold text-[#1E1B2E]"
          >
            Enter your question
          </label>

          <textarea
            id="learning-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={4}
            required
            placeholder="Type your question here..."
            className="w-full rounded-2xl border border-gray-200 bg-[#FFF9F0]/50 p-4 text-sm text-[#1E1B2E] outline-none transition focus:border-[#5636D9] focus:ring-4 focus:ring-violet-100"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-gray-500">
              Subject:{" "}
              <strong className="text-[#5636D9]">{subject}</strong>
            </span>

            <button
              type="submit"
              disabled={isBusy}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5636D9] to-[#18B8AD] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingHint ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                <Sparkles size={16} />
              )}
              {loadingHint ? "Getting AI hint..." : "Get AI Hint"}
            </button>
          </div>
        </form>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}
      </div>

      {/* Learning ladder */}
      <div className="mx-auto max-w-4xl space-y-6 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <h2 className="text-lg font-bold text-[#1E1B2E]">
            Your Learning Journey
          </h2>

          <button
            type="button"
            onClick={resetLadder}
            disabled={isBusy}
            className="flex items-center gap-2 text-sm font-semibold text-[#5636D9] hover:underline disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Reset
          </button>
        </div>

        {/* Four learning stages */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <TierTab
            number={1}
            title="Hint"
            desc="Get a useful clue"
            active={activeTier === 1}
            completed={Boolean(hint)}
            onClick={() => {
              setError("");
              setActiveTier(1);
            }}
          />

          <TierTab
            number={2}
            title="Step-by-Step"
            desc="Understand the steps"
            active={activeTier === 2}
            completed={Boolean(answer)}
            onClick={handleStepByStep}
          />

          <TierTab
            number={3}
            title="Full Answer"
            desc="Reveal the solution"
            active={activeTier === 3}
            completed={false}
            onClick={handleFullAnswer}
          />

          <TierTab
            number={4}
            title="Review"
            desc="Review your learning"
            active={activeTier === 4}
            completed={false}
            onClick={handleReview}
          />
        </div>

        {/* Stage content */}
        <div className="relative space-y-6 overflow-hidden rounded-3xl border border-[#5636D9]/20 bg-white p-6 shadow-xl sm:p-8">
          {/* Stage 1 */}
          {activeTier === 1 && (
            <div className="space-y-5">
              <TierHeading
                number="1"
                title="Your AI Hint"
                subtitle="Think about the idea before viewing the full solution."
              />

              {!hint && !loadingHint && (
                <InfoPanel>
                  Enter your question above and click Get AI Hint.
                  The AI will give you a clue without intentionally
                  revealing the complete answer.
                </InfoPanel>
              )}

              {loadingHint && (
                <LoadingPanel text="AI is thinking of a helpful hint..." />
              )}

              {hint && (
                <>
                  <div className="rounded-2xl border border-[#E5C158]/40 bg-[#FFF9F0] p-5 text-sm leading-7 text-gray-700">
                    <p className="mb-2 flex items-center gap-2 font-bold text-[#1E1B2E]">
                      <Lightbulb size={19} />
                      Conceptual Hint
                    </p>
                    <p className="whitespace-pre-wrap">{hint}</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleStepByStep}
                      disabled={isBusy}
                      className="flex items-center gap-2 rounded-xl bg-[#5636D9] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                      {loadingAnswer ? (
                        <RefreshCw className="animate-spin" size={16} />
                      ) : (
                        <ArrowRight size={16} />
                      )}
                      {loadingAnswer
                        ? "Generating explanation..."
                        : "Explain Step by Step"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Stage 2 */}
          {activeTier === 2 && (
            <div className="space-y-5">
              <TierHeading
                number="2"
                title="Step-by-Step Explanation"
                subtitle="Understand the reasoning in simple language."
              />

              {!answer && !loadingAnswer && (
                <InfoPanel>
                  Generate a hint first, then request the step-by-step
                  explanation.
                </InfoPanel>
              )}

              {loadingAnswer && (
                <LoadingPanel text="AI is preparing your explanation..." />
              )}

              {answer && (
                <>
                  <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5 text-sm leading-7 text-gray-700">
                    <p className="mb-3 flex items-center gap-2 font-bold text-[#5636D9]">
                      <BookOpen size={18} />
                      AI Explanation
                    </p>
                    <div className="whitespace-pre-wrap">{answer}</div>
                  </div>

                  <div className="flex justify-between gap-3">
                    <BackButton onClick={() => setActiveTier(1)} />

                    <button
                      type="button"
                      onClick={handleFullAnswer}
                      className="flex items-center gap-2 rounded-xl bg-[#5636D9] px-5 py-3 text-sm font-bold text-white"
                    >
                      Reveal Full Answer
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Stage 3 */}
          {activeTier === 3 && (
            <div className="space-y-5">
              <TierHeading
                number="3"
                title="Full Answer"
                subtitle="Review the complete AI-generated response."
              />

              {answer ? (
                <>
                  <div className="overflow-x-auto rounded-2xl bg-[#1E1B2E] p-5 text-sm leading-7 text-white shadow-inner">
                    <p className="mb-3 font-bold text-[#18B8AD]">
                      AI Answer
                    </p>
                    <div className="whitespace-pre-wrap">{answer}</div>
                  </div>

                  <p className="rounded-xl bg-violet-50 p-4 text-sm leading-6 text-violet-900">
                    Tip: Read the explanation carefully and check
                    important facts or calculations against your
                    course material.
                  </p>

                  <div className="flex justify-between gap-3">
                    <BackButton onClick={() => setActiveTier(2)} />

                    <button
                      type="button"
                      onClick={handleReview}
                      className="flex items-center gap-2 rounded-xl bg-[#18B8AD] px-5 py-3 text-sm font-bold text-white"
                    >
                      Review Learning
                      <ShieldCheck size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <InfoPanel>
                  Request the step-by-step explanation first to reveal
                  the full answer.
                </InfoPanel>
              )}
            </div>
          )}

          {/* Stage 4 */}
          {activeTier === 4 && (
            <div className="space-y-5">
              <TierHeading
                number="4"
                title="Review Your Learning"
                subtitle="Reflect on the answer before moving on."
              />

              <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 size={22} />
                  <span>Learning review</span>
                </div>

                <p className="text-sm leading-7 text-gray-700">
                  Before marking this topic as mastered, ask yourself:
                </p>

                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
                  <li>Do I understand the hint?</li>
                  <li>
                    Can I explain the solution steps in my own words?
                  </li>
                  <li>
                    Have I checked the answer using a reliable method?
                  </li>
                </ul>

                <p className="text-xs leading-5 text-gray-600">
                  This is a self-review, not an automatic correctness
                  verification. The AI answer has not been independently
                  checked by this page.
                </p>

                {hint && answer && (
                  <p className="rounded-xl bg-white p-3 text-sm font-semibold text-emerald-800">
                    Your learning activity has been saved to history.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-between gap-3">
                <BackButton
                  onClick={() => setActiveTier(answer ? 3 : 1)}
                />

                <button
                  type="button"
                  onClick={resetLadder}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5636D9] to-[#18B8AD] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                >
                  <Award size={17} />
                  Start Again
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs leading-5 text-gray-500">
          UNDERSTANDX Learning Ladder · Powered by your connected AI
          backend. AI responses may contain mistakes.
        </p>
      </div>
    </div>
  );
}

function TierHeading({ number, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 text-[#5636D9]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5636D9]/10 font-bold">
        {number}
      </div>

      <div>
        <h3 className="text-lg font-black text-[#1E1B2E]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function TierTab({
  number,
  title,
  desc,
  active,
  completed,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-28 flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
        active
          ? "scale-[1.02] border-[#5636D9] bg-[#5636D9] text-white shadow-lg"
          : completed
          ? "border-[#18B8AD]/40 bg-white text-[#1E1B2E]"
          : "border-gray-200 bg-white text-gray-500 hover:border-violet-300"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            active
              ? "bg-white text-[#5636D9]"
              : completed
              ? "bg-[#18B8AD] text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {number}
        </span>

        {completed && (
          <CheckCircle2 size={15} className="text-[#18B8AD]" />
        )}
      </div>

      <div>
        <h4 className="text-sm font-bold">{title}</h4>
        <p
          className={`mt-1 text-[10px] leading-4 ${
            active ? "text-white/80" : "text-gray-400"
          }`}
        >
          {desc}
        </p>
      </div>
    </button>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
    >
      Back
    </button>
  );
}

function InfoPanel({ children }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm leading-6 text-violet-800">
      {children}
    </div>
  );
}

function LoadingPanel({ text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-5 text-sm text-violet-800">
      <RefreshCw className="animate-spin" size={20} />
      {text}
    </div>
  );
}
