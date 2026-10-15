import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="py-32 text-center">
      <div className="text-7xl font-extrabold text-primary-200 mb-4">404</div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Page not found</h1>
      <p className="text-slate-500 mb-6">This page doesn't exist or was moved.</p>
      <Link to="/" className="btn-primary">← Back to Home</Link>
    </div>
  );
}
