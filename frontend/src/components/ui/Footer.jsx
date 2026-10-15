import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="page-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-white text-base">
                Project<span className="text-primary-400">AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered project topic recommendations for college students.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-medium text-sm mb-3">Navigate</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/form" className="hover:text-white transition-colors">Find Topics</Link></li>
              <li><Link to="/results" className="hover:text-white transition-colors">My Results</Link></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-white font-medium text-sm mb-3">Disclaimer</h3>
            <p className="text-xs leading-relaxed">
              Recommendations are AI-generated estimates based on your stated preferences.
              Feasibility and suitability scores are not verified facts.
              Always review suggestions critically.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs">
          © {new Date().getFullYear()} ProjectAI — Built for college students
        </div>
      </div>
    </footer>
  );
}
