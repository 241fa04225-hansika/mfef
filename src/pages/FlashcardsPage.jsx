
import React, { useState } from "react";
import { saveLearningActivity } from "../utils/learningHistory";
import {
  Sparkles,
  Brain,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  LoaderCircle,
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/flashcards`;
const STORAGE_KEY = "understandx_learning_history";

export default function FlashcardsPage() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Computer Networks");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [count, setCount] = useState(5);

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateFlashcards() {
    if (!topic.trim()) {
      setError("Please enter a topic first.");
      return;
    }

    setLoading(true);
    setError("");
    setCards([]);
    setCurrentIndex(0);
    setShowAnswer(false);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          topic: topic.trim(),
          difficulty,
          count,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to generate flashcards."
        );
      }

      if (!Array.isArray(data.cards) || data.cards.length !== count) {
        throw new Error(
          `You requested ${count} cards, but the server returned ${
            data.cards?.length || 0
          }. Please try again.`
        );
      }

      setCards(data.cards);
saveLearningActivity({
  type: "Flashcards",
  title: `Flashcards: ${topic.trim()}`,
  subject,
  details: `${data.cards.length} flashcards generated · Difficulty: ${difficulty}`,
  status: "Completed",
});    } catch (err) {
      console.error("Flashcard generation error:", err);
      setError(
        err.message ||
          "Could not connect to the backend. Check that your server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function goToNext() {
    if (!cards.length) return;
    setCurrentIndex((index) => (index + 1) % cards.length);
    setShowAnswer(false);
  }

  function goToPrevious() {
    if (!cards.length) return;
    setCurrentIndex(
      (index) => (index - 1 + cards.length) % cards.length
    );
    setShowAnswer(false);
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#18B8AD]/10 px-4 py-2 font-bold text-[#148D86]">
            <Sparkles size={16} />
            AI FLASHCARD GENERATOR
          </div>

          <h1 className="mt-4 text-3xl font-black text-[#392B35] md:text-4xl">
            Turn Any Topic Into Flashcards
          </h1>

          <p className="mt-3 text-gray-600">
            Generate AI-powered flashcards for your revision.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E9DFFF] bg-white p-6 shadow-xl md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold text-[#392B35]">
                Subject
              </label>
              
<select
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
  className="w-full rounded-xl border p-3"
>
  <optgroup label="Computer Science">
    <option>Computer Networks (CN)</option>
    <option>Operating Systems</option>
    <option>Database Management Systems (DBMS)</option>
    <option>Cybersecurity</option>
    <option>Data Structures and Algorithms</option>
  </optgroup>

  <optgroup label="Programming">
    <option>Python Programming</option>
    <option>Java Programming</option>
  </optgroup>

  <optgroup label="Web Development">
    <option>API &amp; Web Development</option>
    <option>Modern Front-End Frameworks (MFEF)</option>
    <option>React.js</option>
    <option>Angular</option>
    <option>Vue.js</option>
    <option>Next.js</option>
    <option>Tailwind CSS</option>
  </optgroup>

  <optgroup label="AI & Machine Learning">
    <option>Artificial Intelligence</option>
    <option>Machine Learning (ML)</option>
  </optgroup>

  <optgroup label="Mathematics & Science">
    <option>Calculus</option>
    <option>Linear Algebra</option>
    <option>Quantum Physics</option>
    <option>Organic Chemistry</option>
  </optgroup>

  <optgroup label="Other">
    <option>General / Other</option>
  </optgroup>
</select>

            </div>

            <div>
              <label className="mb-2 block font-semibold text-[#392B35]">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-xl border p-3"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block font-semibold text-[#392B35]">
              Topic
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Example: Process Scheduling, Memory Management, IPv4"
              className="w-full rounded-xl border p-3 outline-none focus:border-[#18B8AD]"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block font-semibold text-[#392B35]">
              Number of Cards
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-xl border p-3 md:w-40"
            >
              <option value={5}>5 cards</option>
              <option value={10}>10 cards</option>
              <option value={15}>15 cards</option>
            </select>
          </div>

          <button
            onClick={generateFlashcards}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5636D9] to-[#18B8AD] py-4 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" size={20} />
                Generating your flashcards...
              </>
            ) : (
              <>
                <Brain size={20} />
                Generate Flashcards
              </>
            )}
          </button>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        {currentCard && (
          <div className="mt-10">
            <div className="mx-auto max-w-xl rounded-[32px] border border-[#E9DFFF] bg-white p-7 shadow-2xl transition duration-300 hover:-translate-y-1 md:p-10">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold tracking-widest text-[#148D86]">
                  CARD {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(cards.length).padStart(2, "0")}
                </span>

                <span className="rounded-full bg-[#FFF9F0] px-3 py-1 text-xs font-semibold text-[#5636D9]">
                  {subject}
                </span>
              </div>

              <h2 className="text-2xl font-black text-[#392B35]">
                {currentCard.question}
              </h2>

              {showAnswer ? (
                <div className="mt-6 rounded-2xl bg-[#18B8AD]/10 p-5 text-[#392B35]">
                  <p className="mb-2 font-bold text-[#148D86]">
                    Answer
                  </p>
                  <p className="leading-7">{currentCard.answer}</p>

                  {currentCard.takeaway && (
                    <div className="mt-4 flex items-start gap-2 border-t border-[#18B8AD]/20 pt-4">
                      <Lightbulb
                        size={20}
                        className="shrink-0 text-[#148D86]"
                      />
                      <p className="text-sm">
                        <strong>Remember:</strong>{" "}
                        {currentCard.takeaway}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-8 text-center text-sm text-gray-500">
                  Think of your answer, then click Show Answer.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={goToPrevious}
                aria-label="Previous flashcard"
                className="rounded-xl bg-gray-200 p-3 transition hover:bg-gray-300"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={() => setShowAnswer((previous) => !previous)}
                className="flex items-center gap-2 rounded-xl bg-[#18B8AD] px-6 py-3 font-bold text-white transition hover:bg-[#149C93]"
              >
                <RotateCcw size={18} />
                {showAnswer ? "Hide Answer" : "Show Answer"}
              </button>

              <button
                onClick={goToNext}
                aria-label="Next flashcard"
                className="rounded-xl bg-gray-200 p-3 transition hover:bg-gray-300"
              >
                <ChevronRight />
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-500">
              {cards.length} flashcards generated. Use the arrows to revise.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
