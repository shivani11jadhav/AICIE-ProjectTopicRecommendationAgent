import React, { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [preferences, setPreferences] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [meta, setMeta] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const saveRecommendations = useCallback((recs, metaData, prefs) => {
    setRecommendations(recs);
    setMeta(metaData);
    setPreferences(prefs);
  }, []);

  const toggleFavorite = useCallback((project) => {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === project.id);
      const next = exists
        ? prev.filter((p) => p.id !== project.id)
        : [...prev, project];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((p) => p.id === id),
    [favorites]
  );

  return (
    <AppContext.Provider
      value={{
        preferences,
        setPreferences,
        recommendations,
        setRecommendations,
        meta,
        selectedProject,
        setSelectedProject,
        favorites,
        saveRecommendations,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
