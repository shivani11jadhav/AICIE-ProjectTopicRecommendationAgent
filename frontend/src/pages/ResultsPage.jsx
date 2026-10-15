import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import { refineProject } from "../services/api.js";
import ScoreBar from "../components/ui/ScoreBar.jsx";
import TagList from "../components/ui/TagList.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import { difficultyColor, scoreColor } from "../utils/helpers.js";

function ProjectCard({ project, preferences, onSave, isSaved, onSelectForDetail, onSelectForChat, rank }) {
  const [showScore, setShowScore] = useState(false);
  const [refining, setRefining] = useState(false);
  const [refineError, setRefineError] = useState("");
  const { setRecommendations, recommendations } = useAppContext();

  async function handleRefine() {
    setRefining(true);
    setRefineError("");
    try {
      const result = await refineProject(
        project.id,
        project,
        preferences,
        "Generate 3 alternative versions or similar topics"
      );
      // Append alternatives to recommendations list
      setRecommendations((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = result.alternatives.filter((a) => !existingIds.has(a.id));
        return [...prev, ...newOnes];
      });
    } catch (err) {
      setRefineError(err.message);
    } finally {
      setRefining(false);
    }
  }

  return (
    <article className="card hover:shadow-md transition-shadow flex flex-col">
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center shrink-0">
            #{rank}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 leading-snug">{project.title}</h3>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <span className={`badge ${difficultyColor(project.difficulty)}`}>
                {project.difficulty}
              </span>
              <span className="badge bg-slate-100 text-slate-600">⏱ {project.estimatedDuration}</span>
            </div>
          </div>
          {/* Suitability score circle */}
          <div className="shrink-0 text-center">
            <div className={`text-xl font-bold ${scoreColor(project.suitabilityScore)}`}>
              {project.suitabilityScore}
            </div>
            <div className="text-xs text-slate-400">/ 100</div>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{project.shortDescription}</p>

        {/* Problem statement */}
        {project.problemStatement && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <p className="text-xs font-medium text-amber-800 mb-0.5">Problem it solves</p>
            <p className="text-xs text-amber-700">{project.problemStatement}</p>
          </div>
        )}

        {/* Why suitable */}
        {project.whySuitable && (
          <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg">
            <p className="text-xs font-medium text-green-800 mb-0.5">Why this fits you</p>
            <p className="text-xs text-green-700">{project.whySuitable}</p>
          </div>
        )}
      </div>

      {/* Features & tech */}
      <div className="px-5 py-4 flex-1">
        {project.mainFeatures?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Key Features</p>
            <ul className="space-y-0.5">
              {project.mainFeatures.slice(0, 4).map((f, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-primary-400 mt-0.5">•</span>{f}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Tech Stack</p>
          <TagList tags={project.recommendedTechStack || []} max={6} />
        </div>

        {/* Feasibility */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Feasibility</span>
            <span className={`text-xs font-semibold ${scoreColor(project.feasibilityScore)}`}>
              {project.feasibilityScore}/100
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${project.feasibilityScore >= 70 ? "bg-green-500" : project.feasibilityScore >= 40 ? "bg-yellow-500" : "bg-red-400"}`}
              style={{ width: `${project.feasibilityScore}%` }}
            />
          </div>
          {project.feasibilityExplanation && (
            <p className="text-xs text-slate-400 mt-1 italic">{project.feasibilityExplanation}</p>
          )}
        </div>

        {/* Score breakdown toggle */}
        {project.scoreBreakdown && (
          <div>
            <button
              onClick={() => setShowScore((s) => !s)}
              className="text-xs text-primary-600 hover:underline"
            >
              {showScore ? "Hide" : "Show"} score breakdown ↕
            </button>
            {showScore && (
              <div className="mt-2 space-y-1.5 p-3 bg-slate-50 rounded-lg">
                <ScoreBar label="Skill Match" score={project.scoreBreakdown.skillMatch} />
                <ScoreBar label="Interest Match" score={project.scoreBreakdown.interestMatch} />
                <ScoreBar label="Feasibility" score={project.scoreBreakdown.feasibility} />
                <ScoreBar label="Difficulty Fit" score={project.scoreBreakdown.difficultyFit} />
                <ScoreBar label="Tech Compatibility" score={project.scoreBreakdown.techCompatibility} />
                <p className="text-xs text-slate-400 italic mt-1">{project.scoreBreakdown.note}</p>
              </div>
            )}
          </div>
        )}

        {/* Learning outcomes */}
        {project.learningOutcomes?.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Learning Outcomes</p>
            <div className="flex flex-wrap gap-1">
              {project.learningOutcomes.slice(0, 4).map((o, i) => (
                <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{o}</span>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {project.suggestedImprovements?.length > 0 && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-600 mb-1">💡 Suggested Improvements</p>
            <ul className="space-y-0.5">
              {project.suggestedImprovements.slice(0, 3).map((imp, i) => (
                <li key={i} className="text-xs text-slate-500">→ {imp}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Refine error */}
      {refineError && (
        <div className="px-5">
          <ErrorMessage message={refineError} onRetry={() => setRefineError("")} />
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap gap-2">
        <button
          onClick={() => onSelectForDetail(project)}
          className="btn-primary text-xs py-1.5 px-3"
        >
          📋 Full Details
        </button>
        <button
          onClick={() => onSelectForChat(project)}
          className="btn-secondary text-xs py-1.5 px-3"
        >
          💬 Ask AI
        </button>
        <button
          onClick={() => onSave(project)}
          className={`btn-ghost text-xs py-1.5 px-3 ${isSaved ? "text-yellow-600" : ""}`}
        >
          {isSaved ? "★ Saved" : "☆ Save"}
        </button>
        <button
          onClick={handleRefine}
          disabled={refining}
          className="btn-ghost text-xs py-1.5 px-3"
        >
          {refining ? <><Spinner size="sm" /> Generating…</> : "🔄 Alternatives"}
        </button>
      </div>
    </article>
  );
}

// ── Filter/Sort toolbar ───────────────────────────────────────────────────────
function Toolbar({ search, setSearch, difficulty, setDifficulty, sortBy, setSortBy }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="search"
        className="input max-w-xs text-sm"
        placeholder="Search topics…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="input max-w-[160px] text-sm"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="">All Difficulties</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
      <select
        className="input max-w-[180px] text-sm"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="suitability">Sort: Suitability</option>
        <option value="feasibility">Sort: Feasibility</option>
        <option value="title">Sort: A → Z</option>
      </select>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const navigate = useNavigate();
  const {
    recommendations,
    preferences,
    meta,
    setSelectedProject,
    toggleFavorite,
    isFavorite,
  } = useAppContext();

  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [sortBy, setSortBy] = useState("suitability");
  const [comparing, setComparing] = useState([]);

  function handleSelectDetail(project) {
    setSelectedProject(project);
    navigate(`/project/${project.id}`);
  }

  function handleSelectChat(project) {
    setSelectedProject(project);
    navigate(`/chat/${project.id}`);
  }

  function toggleCompare(project) {
    setComparing((prev) => {
      const exists = prev.find((p) => p.id === project.id);
      if (exists) return prev.filter((p) => p.id !== project.id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, project];
    });
  }

  if (!recommendations.length) {
    return (
      <div className="py-20 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h2 className="section-title mb-3">No recommendations yet</h2>
        <p className="text-slate-500 mb-6">Fill in your preferences to get personalised project topic suggestions.</p>
        <Link to="/form" className="btn-primary">
          🚀 Get Recommendations
        </Link>
      </div>
    );
  }

  // Filter + sort
  let filtered = recommendations.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(search.toLowerCase());
    const matchDiff = !diffFilter || p.difficulty === diffFilter;
    return matchSearch && matchDiff;
  });

  if (sortBy === "feasibility") filtered = [...filtered].sort((a, b) => b.feasibilityScore - a.feasibilityScore);
  if (sortBy === "title") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  // suitability is already default order

  return (
    <div className="py-8">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              Your Recommendations
            </h1>
            <p className="text-slate-500 text-sm">
              {recommendations.length} project topics ranked for {preferences?.branch} · {preferences?.academicYear}
              {meta?.generatedAt && (
                <span className="ml-2 text-slate-400">
                  Generated {new Date(meta.generatedAt).toLocaleTimeString()}
                </span>
              )}
            </p>
            {meta?.disclaimer && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-3 py-1.5 mt-2 max-w-lg">
                ⚠️ {meta.disclaimer}
              </p>
            )}
          </div>
          <Link to="/form" className="btn-secondary text-sm">
            ← Edit Preferences
          </Link>
        </div>

        <Toolbar
          search={search} setSearch={setSearch}
          difficulty={diffFilter} setDifficulty={setDiffFilter}
          sortBy={sortBy} setSortBy={setSortBy}
        />

        {/* Comparison bar */}
        {comparing.length > 0 && (
          <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-primary-800">
              Comparing {comparing.length} project{comparing.length > 1 ? "s" : ""}:
            </span>
            {comparing.map((p) => (
              <span key={p.id} className="badge bg-primary-100 text-primary-700 gap-1">
                {p.title}
                <button onClick={() => toggleCompare(p)} className="ml-1 hover:text-primary-900">×</button>
              </span>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500">No projects match your filters.</p>
            <button onClick={() => { setSearch(""); setDiffFilter(""); }} className="btn-ghost mt-3 text-sm">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                preferences={preferences}
                rank={i + 1}
                onSave={toggleFavorite}
                isSaved={isFavorite(project.id)}
                onSelectForDetail={handleSelectDetail}
                onSelectForChat={handleSelectChat}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
