import React from "react";
import { Link } from "react-router-dom";
import { difficultyColor } from "../utils/helpers.js";

const EXAMPLE_PROJECTS = [
  {
    title: "AI-Powered Expense Tracker",
    description: "Track personal expenses with smart categorization and spending insights.",
    domain: "Web Development",
    difficulty: "Intermediate",
    duration: "4–6 weeks",
    tags: ["React", "Node.js", "AI/ML"],
  },
  {
    title: "Smart Healthcare Triage Bot",
    description: "Chatbot that helps patients describe symptoms and suggests next steps.",
    domain: "Healthcare",
    difficulty: "Advanced",
    duration: "8–10 weeks",
    tags: ["Python", "NLP", "Flask"],
  },
  {
    title: "Peer Study Group Matcher",
    description: "Platform to match students for study sessions based on courses and availability.",
    domain: "Education",
    difficulty: "Beginner",
    duration: "3–4 weeks",
    tags: ["React", "Firebase", "Node.js"],
  },
];

const FEATURES = [
  {
    icon: "🎯",
    title: "Personalised Recommendations",
    description:
      "Enter your skills, interests, and constraints. The AI picks projects that genuinely fit your profile — not generic lists.",
  },
  {
    icon: "📊",
    title: "Transparent Scoring",
    description:
      "Every recommendation comes with a suitability score broken down by skill match, feasibility, difficulty fit, and tech compatibility.",
  },
  {
    icon: "🏗️",
    title: "Full Project Blueprint",
    description:
      "Go from idea to architecture. Get modules, roadmap, database schema, and testing strategy in one click.",
  },
  {
    icon: "💬",
    title: "AI Project Mentor",
    description:
      "Ask anything about your selected project. The AI keeps your full context and gives targeted, actionable answers.",
  },
  {
    icon: "🔄",
    title: "Refine & Explore",
    description:
      "Not happy with a suggestion? Request simpler versions, alternative stacks, or entirely new directions.",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    description:
      "Fully responsive layout — works on phones, tablets, and desktops.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="page-container py-20 md:py-28 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
            AI-Powered for College Students
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Find Your Perfect <br className="hidden sm:block" />
            <span className="text-yellow-300">Project Topic</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing what to build. Tell us your skills, interests, and available time — our
            AI recommends tailored project topics with full blueprints and a personal mentor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/form"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-base shadow-lg"
            >
              🚀 Find My Project Topic
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-base"
            >
              Learn How It Works
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 text-center">
            {[
              { label: "AI-Ranked Suggestions", value: "Up to 10" },
              { label: "Project Domains", value: "10+" },
              { label: "Blueprint Sections", value: "8" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold text-yellow-300">{value}</div>
                <div className="text-sm text-white/70 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">Everything You Need to Get Started</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From personalised recommendations to detailed architecture plans — all powered by AI.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", icon: "📝", title: "Fill the Form", desc: "Enter your skills, interests, preferred domain, difficulty, and available time." },
              { step: "2", icon: "🤖", title: "AI Generates Ideas", desc: "The AI creates distinct project candidates tailored to your profile." },
              { step: "3", icon: "📈", title: "Ranked Results", desc: "Projects are scored and ranked by skill match, feasibility, and tech fit." },
              { step: "4", icon: "🏗️", title: "Get Full Blueprint", desc: "Pick a project and get architecture, roadmap, modules, and a live AI mentor." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {step}
                </div>
                <div className="text-2xl mb-2">{icon}</div>
                <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Example cards ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">Example Project Topics</h2>
            <p className="text-slate-500">The kind of recommendations you can expect</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXAMPLE_PROJECTS.map((p) => (
              <div key={p.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-slate-900 leading-snug">{p.title}</h3>
                  <span className={`badge shrink-0 ${difficultyColor(p.difficulty)}`}>
                    {p.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.map((t) => (
                    <span key={t} className="badge bg-primary-50 text-primary-700">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>📁 {p.domain}</span>
                  <span>⏱ {p.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary-700 text-white text-center">
        <div className="page-container max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to find your ideal project?
          </h2>
          <p className="text-white/80 mb-8">
            Takes less than 3 minutes. No account required.
          </p>
          <Link
            to="/form"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-base shadow-xl"
          >
            🎯 Get My Recommendations
          </Link>
        </div>
      </section>
    </div>
  );
}
