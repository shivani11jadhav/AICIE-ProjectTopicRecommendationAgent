import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import { fetchRecommendations } from "../services/api.js";
import Spinner from "../components/ui/Spinner.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";

const DOMAINS = [
  "AI/ML","Web Development","Healthcare","Education",
  "Cybersecurity","Sustainability","Mobile Development",
  "IoT","Data Science","Other",
];
const DIFFICULTIES = ["Beginner","Intermediate","Advanced"];
const YEARS = [
  "1st Year","2nd Year","3rd Year","4th Year",
  "Semester 1","Semester 2","Semester 3","Semester 4",
  "Semester 5","Semester 6","Semester 7","Semester 8","Postgraduate",
];
const DURATIONS = [
  "1–2 weeks","2–4 weeks","1–2 months","2–3 months","3–6 months","6+ months",
];

const SKILL_SUGGESTIONS = [
  "Python","JavaScript","Java","C++","C#","React","Node.js","Angular","Vue.js",
  "Django","Flask","Spring Boot","SQL","MongoDB","PostgreSQL","TensorFlow",
  "PyTorch","Machine Learning","Deep Learning","Data Analysis","R","PHP","Swift",
  "Kotlin","Flutter","Docker","AWS","Git",
];

const INTEREST_SUGGESTIONS = [
  "Web Development","Mobile Apps","AI/ML","Data Science","Cybersecurity",
  "Healthcare Tech","EdTech","FinTech","Game Development","IoT",
  "Cloud Computing","DevOps","Blockchain","AR/VR","Accessibility","Open Source",
];

const TECH_SUGGESTIONS = [
  "React","Vue.js","Angular","Node.js","Django","Flask","Spring Boot",
  "MongoDB","PostgreSQL","MySQL","Firebase","AWS","Google Cloud","Docker",
  "TensorFlow","PyTorch","FastAPI","GraphQL","REST API","Tailwind CSS","Bootstrap",
];

function ChipInput({ label, id, placeholder, suggestions, value, onChange, error }) {
  const [input, setInput] = useState("");

  function add(item) {
    const trimmed = item.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  }

  function remove(item) {
    onChange(value.filter((v) => v !== item));
  }

  function handleKey(e) {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      if (input.trim()) add(input);
    }
    if (e.key === "Backspace" && !input && value.length) {
      remove(value[value.length - 1]);
    }
  }

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  ).slice(0, 6);

  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div
        className={`min-h-[44px] border rounded-lg px-3 py-2 flex flex-wrap gap-1.5 cursor-text focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent ${
          error ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
        }`}
        onClick={() => document.getElementById(id)?.focus()}
      >
        {value.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full"
          >
            {chip}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(chip); }}
              aria-label={`Remove ${chip}`}
              className="hover:text-primary-900"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => { if (input.trim()) add(input); }}
          placeholder={value.length ? "" : placeholder}
          className="outline-none text-sm flex-1 min-w-[120px] bg-transparent"
        />
      </div>
      {input && filtered.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-xs px-2 py-0.5 bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-600 rounded-full transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <p className="text-xs text-slate-400 mt-1">Type and press Enter, comma, or Tab to add.</p>
    </div>
  );
}

const INITIAL = {
  branch: "",
  academicYear: "",
  skills: [],
  interests: [],
  domain: "",
  techStack: [],
  difficulty: "",
  duration: "",
  teamType: "Individual",
  teamSize: 1,
  count: 5,
};

export default function FormPage() {
  const navigate = useNavigate();
  const { saveRecommendations } = useAppContext();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.branch.trim()) e.branch = "Academic branch is required.";
    if (!form.academicYear) e.academicYear = "Academic year is required.";
    if (!form.skills.length) e.skills = "Add at least one skill.";
    if (!form.interests.length) e.interests = "Add at least one interest.";
    if (!form.domain) e.domain = "Select a project domain.";
    if (!form.techStack.length) e.techStack = "Add at least one preferred technology.";
    if (!form.difficulty) e.difficulty = "Select a difficulty level.";
    if (!form.duration) e.duration = "Select a project duration.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = document.querySelector('[data-error="true"]');
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const payload = {
        ...form,
        teamSize: form.teamType === "Team" ? form.teamSize : undefined,
      };
      const result = await fetchRecommendations(payload);
      saveRecommendations(result.recommendations, result.meta, form);
      navigate("/results");
    } catch (err) {
      setApiError(err.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-10">
      <div className="page-container max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tell Us About Yourself</h1>
          <p className="text-slate-500">
            Fill in your preferences and we'll generate personalised project topic recommendations.
          </p>
        </div>

        {apiError && (
          <div className="mb-6">
            <ErrorMessage message={apiError} onRetry={() => setApiError("")} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* ── Academic Info ── */}
          <section className="card p-6">
            <h2 className="font-semibold text-slate-900 text-lg mb-5 pb-2 border-b border-slate-100">
              Academic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div data-error={!!errors.branch}>
                <label htmlFor="branch" className="label">Academic Branch / Course *</label>
                <input
                  id="branch"
                  type="text"
                  className={`input ${errors.branch ? "border-red-400" : ""}`}
                  placeholder="e.g. Computer Science, ECE, BCA"
                  value={form.branch}
                  onChange={(e) => set("branch", e.target.value)}
                />
                {errors.branch && <p className="text-xs text-red-600 mt-1">{errors.branch}</p>}
              </div>
              <div data-error={!!errors.academicYear}>
                <label htmlFor="academicYear" className="label">Academic Year / Semester *</label>
                <select
                  id="academicYear"
                  className={`input ${errors.academicYear ? "border-red-400" : ""}`}
                  value={form.academicYear}
                  onChange={(e) => set("academicYear", e.target.value)}
                >
                  <option value="">Select year / semester</option>
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
                {errors.academicYear && <p className="text-xs text-red-600 mt-1">{errors.academicYear}</p>}
              </div>
            </div>
          </section>

          {/* ── Skills & Interests ── */}
          <section className="card p-6">
            <h2 className="font-semibold text-slate-900 text-lg mb-5 pb-2 border-b border-slate-100">
              Skills & Interests
            </h2>
            <div className="space-y-5">
              <div data-error={!!errors.skills}>
                <ChipInput
                  label="Technical Skills *"
                  id="skills"
                  placeholder="e.g. Python, React, SQL…"
                  suggestions={SKILL_SUGGESTIONS}
                  value={form.skills}
                  onChange={(v) => set("skills", v)}
                  error={errors.skills}
                />
              </div>
              <div data-error={!!errors.interests}>
                <ChipInput
                  label="Areas of Interest *"
                  id="interests"
                  placeholder="e.g. Machine Learning, Web Dev…"
                  suggestions={INTEREST_SUGGESTIONS}
                  value={form.interests}
                  onChange={(v) => set("interests", v)}
                  error={errors.interests}
                />
              </div>
            </div>
          </section>

          {/* ── Project Preferences ── */}
          <section className="card p-6">
            <h2 className="font-semibold text-slate-900 text-lg mb-5 pb-2 border-b border-slate-100">
              Project Preferences
            </h2>
            <div className="space-y-5">
              <div data-error={!!errors.domain}>
                <label htmlFor="domain" className="label">Preferred Domain *</label>
                <select
                  id="domain"
                  className={`input ${errors.domain ? "border-red-400" : ""}`}
                  value={form.domain}
                  onChange={(e) => set("domain", e.target.value)}
                >
                  <option value="">Select a domain</option>
                  {DOMAINS.map((d) => <option key={d}>{d}</option>)}
                </select>
                {errors.domain && <p className="text-xs text-red-600 mt-1">{errors.domain}</p>}
              </div>

              <div data-error={!!errors.techStack}>
                <ChipInput
                  label="Preferred Technology Stack *"
                  id="techStack"
                  placeholder="e.g. React, Node.js, MongoDB…"
                  suggestions={TECH_SUGGESTIONS}
                  value={form.techStack}
                  onChange={(v) => set("techStack", v)}
                  error={errors.techStack}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div data-error={!!errors.difficulty}>
                  <label className="label">Difficulty Level *</label>
                  <div className="flex gap-3">
                    {DIFFICULTIES.map((d) => (
                      <label key={d} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="difficulty"
                          value={d}
                          checked={form.difficulty === d}
                          onChange={() => set("difficulty", d)}
                          className="text-primary-600"
                        />
                        <span className="text-sm text-slate-700">{d}</span>
                      </label>
                    ))}
                  </div>
                  {errors.difficulty && <p className="text-xs text-red-600 mt-1">{errors.difficulty}</p>}
                </div>

                <div data-error={!!errors.duration}>
                  <label htmlFor="duration" className="label">Available Duration *</label>
                  <select
                    id="duration"
                    className={`input ${errors.duration ? "border-red-400" : ""}`}
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                  >
                    <option value="">Select duration</option>
                    {DURATIONS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                  {errors.duration && <p className="text-xs text-red-600 mt-1">{errors.duration}</p>}
                </div>
              </div>
            </div>
          </section>

          {/* ── Team & Count ── */}
          <section className="card p-6">
            <h2 className="font-semibold text-slate-900 text-lg mb-5 pb-2 border-b border-slate-100">
              Team & Recommendations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="label">Project Type</label>
                <div className="flex gap-4">
                  {["Individual","Team"].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="teamType"
                        value={t}
                        checked={form.teamType === t}
                        onChange={() => set("teamType", t)}
                        className="text-primary-600"
                      />
                      <span className="text-sm text-slate-700">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {form.teamType === "Team" && (
                <div>
                  <label htmlFor="teamSize" className="label">Team Size</label>
                  <input
                    id="teamSize"
                    type="number"
                    min="2"
                    max="20"
                    className="input"
                    value={form.teamSize}
                    onChange={(e) => set("teamSize", Number(e.target.value))}
                  />
                </div>
              )}

              <div>
                <label htmlFor="count" className="label">
                  Number of Recommendations
                  <span className="text-slate-400 font-normal ml-1">(1–10)</span>
                </label>
                <input
                  id="count"
                  type="number"
                  min="1"
                  max="10"
                  className="input"
                  value={form.count}
                  onChange={(e) => set("count", Math.min(10, Math.max(1, Number(e.target.value))))}
                />
              </div>
            </div>
          </section>

          {/* ── Submit ── */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setForm(INITIAL)}
              className="btn-secondary"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Generating… (may take ~30s)
                </>
              ) : (
                <>🚀 Generate Recommendations</>
              )}
            </button>
          </div>

          {loading && (
            <div className="card p-6 text-center bg-primary-50 border-primary-100">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="font-medium text-primary-800">AI is working on your recommendations…</p>
              <p className="text-sm text-primary-600 mt-1">
                Generating, scoring, and ranking personalised project topics. This usually takes 15–30 seconds.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
