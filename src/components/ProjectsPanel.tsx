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
      return { label: "Uploading", tone: "text-black bg-[#FAE12A] border-transparent" };
    case "PROCESSING":
      return { label: "Processing", tone: "text-black bg-[#FAE12A]/80 border-transparent" };
    case "COMPLETED":
      return { label: "Completed", tone: "text-green-200 bg-green-900/40 border-green-500/40" };
    case "ERROR":
      return { label: "Error", tone: "text-red-200 bg-red-900/40 border-red-500/40" };
    default:
      return { label: "Unknown", tone: "text-white/80 bg-white/10 border-white/15" };
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
    <div className="bg-[#0f0f14] border border-white/10 shadow-sm rounded-xl p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Projects</h2>
          <p className="text-sm text-white/70">
            Create a project and track processing status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadProjects}
            disabled={loading}
            className="px-3 py-2 text-sm border border-white/10 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50"
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
            className="w-full px-3 py-2 border border-white/15 bg-white/5 rounded-lg focus:ring-2 focus:ring-[#FAE12A]/60 focus:border-transparent text-white placeholder:text-white/40"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-white/15 bg-white/5 rounded-lg focus:ring-2 focus:ring-[#FAE12A]/60 focus:border-transparent text-white placeholder:text-white/40"
          />
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-4 py-2 bg-[#FAE12A] text-black rounded-lg hover:shadow-[0_12px_30px_rgba(250,225,42,0.35)] disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create project"}
          </button>
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
      </div>

      {sortedProjects.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-lg p-6 text-center text-white/70 bg-white/5">
          No projects yet. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedProjects.map((project, idx) => {
            const status = statusLabel(project.status);
            return (
              <div
                key={project.id ?? `${project.name}-${idx}`}
                className="border border-white/10 rounded-xl p-4 bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/50">
                      ID: {project.id ?? "—"}
                    </p>
                    <h3 className="text-lg font-semibold text-white">
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
                  <p className="text-sm text-white/75 mt-2">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4 text-sm text-white/60">
                  <span>
                    Created:{" "}
                    {project.createdAt
                      ? new Date(project.createdAt).toLocaleString()
                      : "—"}
                  </span>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="text-red-300 hover:text-red-200 disabled:opacity-50"
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
