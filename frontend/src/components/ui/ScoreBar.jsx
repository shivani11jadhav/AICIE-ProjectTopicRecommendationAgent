import React from "react";
import { scoreBarColor, scoreColor } from "../../utils/helpers.js";

export default function ScoreBar({ label, score, max = 100 }) {
  const pct = Math.min(100, Math.round((score / max) * 100));
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-500">{label}</span>
        <span className={`text-xs font-semibold ${scoreColor(pct)}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${scoreBarColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
