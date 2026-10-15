import React from "react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3"
    >
      <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-800">Something went wrong</p>
        <p className="text-sm text-red-700 mt-0.5">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-2 text-sm text-red-700 underline hover:no-underline">
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
