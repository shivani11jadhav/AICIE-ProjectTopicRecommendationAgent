import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.jsx";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { favorites } = useAppContext();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-primary-600"
        : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">P</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">
              Project<span className="text-primary-600">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/form" className={navLinkClass}>
              Find Topics
            </NavLink>
            <NavLink to="/results" className={navLinkClass}>
              Results
            </NavLink>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {favorites.length > 0 && (
              <span className="text-xs bg-primary-100 text-primary-700 font-medium px-2.5 py-1 rounded-full">
                ★ {favorites.length} saved
              </span>
            )}
            <button
              onClick={() => navigate("/form")}
              className="btn-primary text-sm py-2 px-4"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {[
              { to: "/", label: "Home" },
              { to: "/form", label: "Find Topics" },
              { to: "/results", label: "Results" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
