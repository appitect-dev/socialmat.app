"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getAllProjects,
  createProject,
  deleteProject,
  type ProjectResponseDTO,
} from "@/lib/api";

type StatusVariant = "UPLOADING" | "PROCESSING" | "COMPLETED" | "ERROR" | "UNKNOWN";

const statusLabel = (status?: string): { label: string; tone: string } => {
  switch (status) {
    case "UPLOADING":
      return { label: "Uploading", tone: "text-amber-700 bg-amber-100 border-amber-200" };
    case "PROCESSING":
      return { label: "Processing", tone: "text-sky-700 bg-sky-100 border-sky-200" };
    case "COMPLETED":
      return { label: "Completed", tone: "text-emerald-700 bg-emerald-100 border-emerald-200" };
    case "ERROR":
      return { label: "Error", tone: "text-red-700 bg-red-100 border-red-200" };
    default:
      return { label: "Unknown", tone: "text-gray-700 bg-gray-100 border-gray-200" };
  }
};

export function ProjectsPanel() {
  const [projects, setProjects] = useState<ProjectResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const sortedProjects = useMemo(
    () =>
      (Array.isArray(projects) ? [...projects] : []).sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }),
    [projects]
  );

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllProjects();
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError("Nepodařilo se načíst projekty.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Zadejte název projektu.");
      return;
    }
    try {
      setCreating(true);
      setError(null);
      const res = await createProject({ name: name.trim(), description });
      if (res.status === 200 && res.data) {
        setProjects((prev) => [res.data as ProjectResponseDTO, ...prev]);
        setName("");
        setDescription("");
      } else {
        setError("Projekt se nepodařilo vytvořit (status " + res.status + ").");
      }
    } catch (e) {
      setError("Projekt se nepodařilo vytvořit.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      setDeletingId(id);
      const res = await deleteProject(id);
      if (res.status === 200) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        setError("Projekt se nepodařilo smazat (status " + res.status + ").");
      }
    } catch (e) {
      setError("Projekt se nepodařilo smazat.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-600">
            Create a project and track processing status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadProjects}
            disabled={loading}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 mb-6">
        <div className="grid gap-3 md:grid-cols-[1fr,2fr,auto] items-start">
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create project"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {sortedProjects.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-600">
          No projects yet. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedProjects.map((project, idx) => {
            const status = statusLabel(project.status);
            return (
              <div
                key={project.id ?? `${project.name}-${idx}`}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      ID: {project.id ?? "—"}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${status.tone}`}
                  >
                    {status.label}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-700 mt-2">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                  <span>
                    Created:{" "}
                    {project.createdAt
                      ? new Date(project.createdAt).toLocaleString()
                      : "—"}
                  </span>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {deletingId === project.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
