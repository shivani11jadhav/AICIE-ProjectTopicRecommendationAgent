import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import { fetchProjectDetail } from "../services/api.js";
import Spinner from "../components/ui/Spinner.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import TagList from "../components/ui/TagList.jsx";
import { difficultyColor, scoreColor } from "../utils/helpers.js";

function Section({ title, children, icon }) {
  return (
    <section className="card p-6">
      <h2 className="font-semibold text-slate-900 text-lg mb-4 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

function RoadmapPhase({ phase }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">
        {phase.phase}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h4 className="font-medium text-slate-900 text-sm">{phase.title}</h4>
          {phase.duration && (
            <span className="badge bg-slate-100 text-slate-500">⏱ {phase.duration}</span>
          )}
        </div>
        <ul className="space-y-0.5">
          {(phase.tasks || []).map((t, i) => (
            <li key={i} className="text-sm text-slate-600 flex items-start gap-1.5">
              <span className="text-primary-400 mt-0.5">•</span>{t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProject, preferences, setSelectedProject, recommendations } = useAppContext();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Recover project from recommendations list if context was lost (e.g. page refresh)
  const project =
    selectedProject?.id === id
      ? selectedProject
      : recommendations.find((r) => r.id === id);

  useEffect(() => {
    if (!project || !preferences) return;
    setSelectedProject(project);
    loadDetail();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadDetail() {
    setLoading(true);
    setError("");
    try {
      const result = await fetchProjectDetail(id, project, preferences);
      setDetail(result.detail);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 mb-4">Project not found. Please go back to results.</p>
        <Link to="/results" className="btn-primary">← Back to Results</Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="page-container max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/results" className="hover:text-primary-600">Results</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate">{project.title}</span>
        </nav>

        {/* Project header */}
        <div className="card p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{project.title}</h1>
              <p className="text-slate-600">{project.shortDescription}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`badge ${difficultyColor(project.difficulty)}`}>{project.difficulty}</span>
                <span className="badge bg-slate-100 text-slate-600">⏱ {project.estimatedDuration}</span>
                <span className="badge bg-blue-50 text-blue-700">📁 {project.domain}</span>
              </div>
            </div>
            <div className="text-center shrink-0">
              <div className={`text-3xl font-extrabold ${scoreColor(project.suitabilityScore)}`}>
                {project.suitabilityScore}
              </div>
              <div className="text-xs text-slate-400">Suitability / 100</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            <TagList tags={project.recommendedTechStack || []} />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => navigate(`/chat/${id}`)} className="btn-primary text-sm">
              💬 Ask AI About This Project
            </button>
            <Link to="/results" className="btn-secondary text-sm">
              ← Back to Results
            </Link>
          </div>
        </div>

        {/* AI-generated detail section */}
        {loading && (
          <div className="card p-10 text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="font-medium text-slate-700">Generating detailed project blueprint…</p>
            <p className="text-sm text-slate-400 mt-1">This may take 15–30 seconds.</p>
          </div>
        )}

        {error && (
          <ErrorMessage message={error} onRetry={loadDetail} />
        )}

        {detail && (
          <div className="space-y-5">
            {/* Overview */}
            <Section title="Project Overview" icon="📖">
              <p className="text-slate-600 leading-relaxed">{detail.projectOverview}</p>
              {detail.objectives?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-slate-800 mb-2 text-sm">Objectives</h3>
                  <ul className="space-y-1">
                    {detail.objectives.map((o, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-primary-500 font-bold mt-0.5">{i + 1}.</span>{o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>

            {/* Architecture */}
            {detail.proposedArchitecture && (
              <Section title="Proposed Architecture" icon="🏗️">
                <p className="text-slate-600 leading-relaxed">{detail.proposedArchitecture}</p>
              </Section>
            )}

            {/* Modules */}
            {detail.modules?.length > 0 && (
              <Section title="Modules & Responsibilities" icon="🧩">
                <div className="space-y-3">
                  {detail.modules.map((mod, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-900 text-sm">{mod.name}</h4>
                        {mod.technologies?.map((t) => (
                          <span key={t} className="badge bg-primary-50 text-primary-700">{t}</span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-600">{mod.responsibility}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Database */}
            {detail.databaseSchema?.tables?.length > 0 && (
              <Section title="Recommended Database Schema" icon="🗄️">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-3 py-2 font-medium text-slate-700">Table</th>
                        <th className="text-left px-3 py-2 font-medium text-slate-700">Purpose</th>
                        <th className="text-left px-3 py-2 font-medium text-slate-700">Key Fields</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.databaseSchema.tables.map((t, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono text-xs text-primary-700 font-medium">{t.name}</td>
                          <td className="px-3 py-2 text-slate-600">{t.description}</td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-1">
                              {(t.keyFields || []).map((f) => (
                                <span key={f} className="badge bg-slate-100 text-slate-600 font-mono text-xs">{f}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-400 italic mt-2">
                  Schema is a proposed starting point — adapt to your actual requirements.
                </p>
              </Section>
            )}

            {/* Roadmap */}
            {detail.implementationRoadmap?.length > 0 && (
              <Section title="Implementation Roadmap" icon="🗺️">
                <div className="space-y-4">
                  {detail.implementationRoadmap.map((phase, i) => (
                    <RoadmapPhase key={i} phase={phase} />
                  ))}
                </div>
              </Section>
            )}

            {/* Testing */}
            {detail.testingApproach && (
              <Section title="Testing Approach" icon="🧪">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Unit Testing", value: detail.testingApproach.unitTesting },
                    { label: "Integration Testing", value: detail.testingApproach.integrationTesting },
                    { label: "User Testing", value: detail.testingApproach.userTesting },
                  ].filter((s) => s.value).map((s) => (
                    <div key={s.label} className="p-3 bg-slate-50 rounded-lg">
                      <h4 className="text-xs font-semibold text-slate-700 mb-1">{s.label}</h4>
                      <p className="text-xs text-slate-600">{s.value}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Future enhancements */}
            {detail.futureEnhancements?.length > 0 && (
              <Section title="Future Enhancements" icon="🚀">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detail.futureEnhancements.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-accent-500 mt-0.5">✦</span>{f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-400 italic mt-3">
                  These are proposed future enhancements, not currently implemented features.
                </p>
              </Section>
            )}

            {/* CTA */}
            <div className="card p-6 bg-primary-50 border-primary-100 text-center">
              <h3 className="font-semibold text-primary-900 mb-2">Have questions about this project?</h3>
              <p className="text-sm text-primary-700 mb-4">
                Ask the AI mentor anything — tech stack choices, implementation steps, simplifications, and more.
              </p>
              <button
                onClick={() => navigate(`/chat/${id}`)}
                className="btn-primary"
              >
                💬 Open AI Mentor Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
