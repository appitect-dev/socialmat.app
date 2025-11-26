"use client";

import { ProjectsPanel } from "@/components/ProjectsPanel";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">
            Create, view, and manage your projects and processing status.
          </p>
        </div>
        <ProjectsPanel />
      </div>
    </div>
  );
}
