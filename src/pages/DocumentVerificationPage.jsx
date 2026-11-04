
import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  ShieldCheck,
  Type,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function DocumentVerificationPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function processFile(file) {
    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PNG, JPG, or PDF file.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("The file must be smaller than 25MB.");
      return;
    }

    setSelectedFile(file);
    setError("");
    setResult(null);
  }

  function handleFileChange(event) {
    processFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    processFile(event.dataTransfer.files?.[0]);
  }

  async function handleTextVerification() {
    if (!textContent.trim()) {
      setError("Please type or paste some text first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/verify-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textContent.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Text analysis failed.");
      }

      setResult({
        filename: "Typed text",
        report: data.report,
      });
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the AI backend. Make sure it is running."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFileVerification() {
    if (!selectedFile) {
      setError("Please select a document first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("document", selectedFile);

      const response = await fetch(
        `${API_URL}/verify-document`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Document analysis failed."
        );
      }

      setResult({
        filename: data.filename || selectedFile.name,
        report: data.report,
      });
    } catch (err) {
      setError(
        err.message ||
          "Could not analyze the document. Check that your backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function clearFile() {
    setSelectedFile(null);
    setError("");
    setResult(null);
  }

  function resetPage() {
    setSelectedFile(null);
    setTextContent("");
    setError("");
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-4 py-10 text-[#1E1B2E] sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#18B8AD]/10 px-4 py-2 text-xs font-bold tracking-widest text-[#129A91]">
            <ShieldCheck size={16} />
            AI DOCUMENT REVIEW
          </span>

          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Image &amp; PDF Verification
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Upload homework, lab reports, or exam answers.
            AI will review the readable content and report
            possible mistakes, missing information, and suggestions.
          </p>
        </div>

        {/* Upload section */}
        <section className="rounded-[28px] border border-violet-200 bg-white p-5 shadow-xl shadow-violet-100/50 sm:p-10">
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed px-5 py-10 text-center transition ${
              isDragging
                ? "border-violet-600 bg-violet-50"
                : "border-violet-300 bg-[#FFFEFC]"
            }`}
          >
            <div className="mb-5 rounded-2xl bg-violet-100 p-5 text-violet-600">
              <UploadCloud size={38} />
            </div>

            <h2 className="text-xl font-bold">
              Drag &amp; Drop your document here
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Supports PNG, JPG, and PDF files up to 25MB
            </p>

            <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-violet-600 px-7 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-violet-700">
              <UploadCloud size={18} />
              Browse Files

              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {selectedFile && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <div className="flex min-w-0 items-center gap-3">
                {selectedFile.type === "application/pdf" ? (
                  <FileText
                    className="shrink-0 text-violet-600"
                    size={26}
                  />
                ) : (
                  <ImageIcon
                    className="shrink-0 text-violet-600"
                    size={26}
                  />
                )}

                <div className="min-w-0">
                  <p className="break-all font-semibold">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFile}
                className="rounded-lg p-2 text-gray-500 hover:bg-white hover:text-red-600"
                aria-label="Remove selected file"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {selectedFile && (
            <button
              type="button"
              onClick={handleFileVerification}
              disabled={isLoading}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 font-bold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <RefreshCw size={19} className="animate-spin" />
              ) : (
                <ShieldCheck size={19} />
              )}

              {isLoading ? "Analyzing document..." : "Analyze Document"}
            </button>
          )}
        </section>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-violet-200" />
          <span className="text-sm font-bold tracking-widest text-gray-500">
            OR TYPE YOUR TEXT
          </span>
          <div className="h-px flex-1 bg-violet-200" />
        </div>

        {/* Text section */}
        <section className="rounded-[28px] border border-violet-200 bg-white p-5 shadow-xl shadow-violet-100/50 sm:p-8">
          <div className="mb-5 flex items-start gap-4">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
              <Type size={25} />
            </div>

            <div>
              <h2 className="text-xl font-extrabold">
                Enter Your Text
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Paste your answer, homework, or lab report for AI review.
              </p>
            </div>
          </div>

          <textarea
            value={textContent}
            onChange={(event) => {
              setTextContent(event.target.value);
              setError("");
            }}
            placeholder={"Paste your answer here...\n\nExample: IPv4 uses 32-bit addresses, while IPv6 uses 128-bit addresses."}
            rows={8}
            className="w-full resize-y rounded-2xl border border-violet-200 bg-[#FFFCF7] p-5 leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-gray-500">
              {textContent.length} characters
            </span>

            <button
              type="button"
              onClick={handleTextVerification}
              disabled={!textContent.trim() || isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw size={19} className="animate-spin" />
              ) : (
                <ShieldCheck size={19} />
              )}

              {isLoading ? "Analyzing..." : "Verify Text"}
            </button>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={22} />
            <p className="leading-6">{error}</p>
          </div>
        )}

        {/* AI report */}
        {result && (
          <section
            aria-live="polite"
            className="mt-8 overflow-hidden rounded-[28px] border border-teal-200 bg-white shadow-xl"
          >
            <div className="flex items-start gap-3 bg-teal-50 p-5 sm:p-7">
              <div className="rounded-xl bg-white p-3 text-teal-600 shadow-sm">
                <Sparkles size={25} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-extrabold">
                  AI Analysis Report
                </h2>
                <p className="mt-1 break-all text-sm text-gray-600">
                  {result.filename}
                </p>
              </div>

              <CheckCircle
                className="shrink-0 text-teal-600"
                size={25}
              />
            </div>

            <div className="p-5 sm:p-8">
              <h3 className="mb-4 font-bold text-[#5636D9]">
                Review Findings
              </h3>

              <div className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
                {result.report}
              </div>

              <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                Important: This is an AI-generated review, not a guarantee
                of correctness. Check important answers against trusted
                course materials. Unreadable content may be missed.
              </p>

              <button
                type="button"
                onClick={resetPage}
                className="mt-5 rounded-xl bg-violet-600 px-6 py-3 font-bold text-white transition hover:bg-violet-700"
              >
                Analyze Another Document
              </button>
            </div>
          </section>
        )}

        <p className="mt-6 text-center text-sm leading-6 text-gray-500">
          UNDERSTANDX helps students review answers and identify possible
          mistakes with AI assistance.
        </p>
      </div>
    </div>
  );
}
