// frontend/src/components/InsightsPanel.jsx
import React, { useState } from "react";
import axios from "axios";

export default function InsightsPanel({ transcript = [] }) {
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingQA, setLoadingQA] = useState(false);
  const [error, setError] = useState("");

  // ✅ Summarize the transcript
  const handleSummarize = async () => {
    if (!transcript || transcript.length === 0) {
      setError("⚠️ No transcript available to summarize.");
      return;
    }

    const text = transcript.map((seg) => seg.text).join(" ");
    try {
      setLoading(true);
      setError("");
      setSummary("");

      const res = await axios.post("http://127.0.0.1:8000/api/ai/summary", { text });
      setSummary(res.data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Ask question to AI
  const handleAsk = async () => {
    if (!transcript || transcript.length === 0) {
      setError("⚠️ No transcript available to analyze.");
      return;
    }
    if (!question.trim()) {
      setError("⚠️ Please type a question first.");
      return;
    }

    const text = transcript.map((seg) => seg.text).join(" ");
    try {
      setLoadingQA(true);
      setError("");
      setAnswer("");

      const res = await axios.post("http://127.0.0.1:8000/api/ai/ask", {
        text,
        question,
      });

      setAnswer(res.data.answer);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch AI answer. Try again.");
    } finally {
      setLoadingQA(false);
    }
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-5 mt-6 shadow-lg border border-neutral-800">
      <h2 className="text-xl font-semibold mb-4 text-white">🎯 AI Insights</h2>

      {/* --- Summary Section --- */}
      <div className="mb-6">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition font-medium"
        >
          {loading ? "Summarizing..." : "Summarize Video"}
        </button>

        {summary && (
          <div className="mt-4 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
            <h3 className="text-lg font-medium text-gray-100 mb-2">🧾 Summary</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {summary}
            </p>
          </div>
        )}
      </div>

      {/* --- Ask AI Section --- */}
      <div className="border-t border-neutral-800 pt-5">
        <h3 className="text-lg font-medium text-gray-100 mb-2">💬 Ask AI about the video</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask something about this video..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 px-3 py-2 bg-neutral-800 text-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAsk}
            disabled={loadingQA}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            {loadingQA ? "Thinking..." : "Ask"}
          </button>
        </div>

        {answer && (
          <div className="mt-4 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
            <h3 className="text-md font-medium text-gray-100 mb-2">🤖 AI Answer</h3>
            <p className="text-gray-300 leading-relaxed">{answer}</p>
          </div>
        )}
      </div>

      {/* --- Error Section --- */}
      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
    </div>
  );
}