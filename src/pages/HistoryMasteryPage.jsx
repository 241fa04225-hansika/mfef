
import React, { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  Brain,
  ShieldCheck,
  Clock,
  RefreshCw,
  History,
  Sparkles,
  Trash2,
} from "lucide-react";

function getHistoryKey() {
  try {
    const user = JSON.parse(
      localStorage.getItem("understandx_current_user") || "null"
    );

    if (!user) return null;

    const userId =
      user._id || user.id || user.email || user.username;

    if (!userId) return null;

    return `understandx_learning_history_${String(userId).toLowerCase()}`;
  } catch {
    return null;
  }
}

function readHistory() {
  try {
    const key = getHistoryKey();
    if (!key) return [];

    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function HistoryMasteryPage() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const loadHistory = () => setHistory(readHistory());

    loadHistory();

    window.addEventListener("storage", loadHistory);
    window.addEventListener("focus", loadHistory);
    window.addEventListener("understandx-history-updated", loadHistory);

    return () => {
      window.removeEventListener("storage", loadHistory);
      window.removeEventListener("focus", loadHistory);
      window.removeEventListener("understandx-history-updated", loadHistory);
    };
  }, []);

  const filteredHistory =
    filter === "All"
      ? history
      : history.filter(
          (item) => (item.type || "Learning") === filter
        );

  const counts = {
    Learning: history.filter(
      (item) => (item.type || "Learning") === "Learning"
    ).length,
    Flashcards: history.filter(
      (item) => item.type === "Flashcards"
    ).length,
    Verification: history.filter(
      (item) => item.type === "Verification"
    ).length,
  };

  function clearHistory() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your saved learning history for this account?"
    );

    if (!confirmed) return;

    const key = getHistoryKey();

    if (key) {
      localStorage.removeItem(key);
    }

    setHistory([]);
    window.dispatchEvent(new Event("understandx-history-updated"));
  }

  function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-12 py-10 space-y-8">
      <header className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 bg-[#18B8AD]/10 text-[#168E87] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
          <Sparkles size={14} />
          Your Learning Journey
        </span>

        <h1 className="text-3xl md:text-4xl font-black text-[#1E1B2E]">
          My Progress
        </h1>

        <p className="text-gray-600 text-sm leading-6">
          Track your actual learning activities, flashcard sessions,
          and document verification history in UNDERSTANDX.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <SummaryCard
          icon={<BookOpen size={22} />}
          title="Learning Activities"
          value={counts.Learning}
          color="from-[#5636D9] to-[#8170F5]"
        />

        <SummaryCard
          icon={<Brain size={22} />}
          title="Flashcard Sessions"
          value={counts.Flashcards}
          color="from-[#18B8AD] to-[#79CDB5]"
        />

        <SummaryCard
          icon={<ShieldCheck size={22} />}
          title="Verifications"
          value={counts.Verification}
          color="from-[#D9A441] to-[#E5C158]"
        />
      </section>

      <section className="bg-white p-5 md:p-7 rounded-3xl border border-[#5636D9]/15 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-xl text-[#1E1B2E] flex items-center gap-2">
              <History size={21} className="text-[#5636D9]" />
              Recent Activity
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Activities saved by your account on this browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setHistory(readHistory())}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold hover:bg-gray-50"
            >
              <RefreshCw size={15} />
              Refresh
            </button>

            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50"
              >
                <Trash2 size={15} />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Learning", "Flashcards", "Verification"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  filter === item
                    ? "bg-[#5636D9] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-14 px-4 rounded-2xl border border-dashed border-gray-200 bg-[#FFFCF6]">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#5636D9]/10 text-[#5636D9] flex items-center justify-center mb-4">
              <BookOpen size={29} />
            </div>

            <h3 className="font-bold text-lg text-[#1E1B2E]">
              Your learning story starts here!
            </h3>

            <p className="text-sm text-gray-500 max-w-md mx-auto mt-2 leading-6">
              No saved activity yet. Generate flashcards, complete a
              learning activity, or verify a document. Once those pages
              save an activity, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item, index) => (
              <HistoryRow
                key={item.id || `${item.date}-${index}`}
                item={item}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400">
          This page only displays activities that have actually been
          saved. It does not create sample certificates, badges, or
          learning records.
        </p>
      </section>
    </main>
  );
}

function SummaryCard({ icon, title, value, color }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-5 border border-[#5636D9]/10 shadow-md">
      <div
        className={`absolute -right-7 -top-7 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-10 blur-xl`}
      />

      <div className="relative flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-md`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-black text-[#1E1B2E]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function HistoryRow({ item, formatDate }) {
  const type = item.type || "Learning";

  const icon =
    type === "Flashcards" ? (
      <Brain size={19} />
    ) : type === "Verification" ? (
      <ShieldCheck size={19} />
    ) : (
      <BookOpen size={19} />
    );

  return (
    <article className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#5636D9]/25 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-white border border-gray-100 text-[#5636D9] flex items-center justify-center">
          {icon}
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#5636D9]/10 text-[#5636D9] uppercase">
              {type}
            </span>

            <span className="text-xs text-gray-400 inline-flex items-center gap-1">
              <Clock size={12} />
              {formatDate(item.date)}
            </span>
          </div>

          <h3 className="font-bold text-sm text-[#1E1B2E] break-words">
            {item.title || "Learning activity"}
          </h3>

          {item.subject && (
            <p className="text-xs text-gray-500">
              Subject: {item.subject}
            </p>
          )}

          {item.details && (
            <p className="text-xs text-gray-500">
              {item.details}
            </p>
          )}
        </div>
      </div>

      <span className="self-start sm:self-center shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-[#18B8AD]/10 text-[#168E87]">
        {item.status || "Completed"}
      </span>
    </article>
  );
}

export default HistoryMasteryPage;
