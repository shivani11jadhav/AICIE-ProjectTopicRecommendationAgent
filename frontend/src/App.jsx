import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/Navbar.jsx";
import Footer from "./components/ui/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import FormPage from "./pages/FormPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/project/:id" element={<DetailsPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
