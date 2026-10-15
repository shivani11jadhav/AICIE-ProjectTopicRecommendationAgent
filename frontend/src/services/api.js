import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 120_000, // AI calls can take a while
  headers: { "Content-Type": "application/json" },
});

// Normalise errors for consistent handling in components
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.errors?.[0]?.msg ||
      err.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

// ── API methods ───────────────────────────────────────────────────────────────

export async function fetchRecommendations(preferences) {
  const { data } = await api.post("/recommendations", preferences);
  return data; // { recommendations, meta }
}

export async function fetchProjectDetail(projectId, project, preferences) {
  const { data } = await api.post(`/recommendations/${projectId}/detail`, {
    project,
    preferences,
  });
  return data;
}

export async function refineProject(projectId, project, preferences, refinementRequest) {
  const { data } = await api.post(`/recommendations/${projectId}/refine`, {
    project,
    preferences,
    refinementRequest,
  });
  return data; // { alternatives }
}

export async function sendChatMessage(message, project, preferences, history) {
  const { data } = await api.post("/chat", {
    message,
    project,
    preferences,
    history,
  });
  return data; // { reply, timestamp }
}

export async function checkHealth() {
  const { data } = await api.get("/health");
  return data;
}
