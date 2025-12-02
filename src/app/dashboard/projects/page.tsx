"use client";

import { ProjectsPanel } from "@/components/ProjectsPanel";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0f0f14] to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-white/70">
            Create, view, and manage your projects and processing status.
          </p>
        </div>
        <ProjectsPanel />
      </div>
    </div>
  );
}
