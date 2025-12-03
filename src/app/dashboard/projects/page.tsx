"use client";

import { ProjectsPanel } from "@/components/ProjectsPanel";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1f1f1f] to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-4xl font-bold text-white">Projects</h1>
          <p className="text-lg text-white/75">
            Create, view, and manage your projects and processing status.
          </p>
        </div>
        <ProjectsPanel />
      </div>
    </div>
  );
}
