// frontend/src/components/Transcript.jsx
import React from "react";

function toSeconds(line) {
  if (typeof line.start === "number") return line.start;
  const parts = String(line.time || "")
    .split(":")
    .map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

export default function Transcript({ transcript = [], onTimestampClick = () => {} }) {
  return (
    <div className="bg-neutral-900 rounded-lg p-4 mt-6">
      <h2 className="text-lg font-semibold mb-3">Transcript</h2>

      {transcript.length === 0 ? (
        <p className="text-gray-400 text-sm">No transcript available.</p>
      ) : (
        <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {transcript.map((line, i) => (
            <li
              key={i}
              onClick={() => onTimestampClick(toSeconds(line))}
              className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-neutral-800/60 transition"
            >
              <span className="text-indigo-400 font-mono w-16 shrink-0">
                {line.time || "--:--"}
              </span>
              <span className="text-sm leading-snug text-gray-200">
                {line.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}