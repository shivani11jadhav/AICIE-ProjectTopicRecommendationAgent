import React from "react";

const COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
];

export default function TagList({ tags = [], max }) {
  const visible = max ? tags.slice(0, max) : tags;
  const hidden = max ? tags.length - max : 0;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className={`badge ${COLORS[i % COLORS.length]}`}
        >
          {tag}
        </span>
      ))}
      {hidden > 0 && (
        <span className="badge bg-slate-100 text-slate-500">+{hidden} more</span>
      )}
    </div>
  );
}
