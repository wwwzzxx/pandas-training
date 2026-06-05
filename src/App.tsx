import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/pages/HomePage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { LearnPage } from "@/pages/LearnPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/learn/:id/:step?" element={<LearnPage />} />
          <Route path="*" element={<><Header /><main className="flex-1"><Routes><Route path="/" element={<HomePage />} /><Route path="/project/:id" element={<ProjectDetailPage />} /></Routes></main><Footer /></>} />
        </Routes>
      </div>
    </Router>
  );
}
