"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getAllProjects,
  createProject,
  deleteProject,
  type ProjectResponseDTO,
} from "@/lib/api";
import { useDashboardTheme } from "./dashboard-theme";

type StatusVariant =
  | "UPLOADING"
  | "PROCESSING"
  | "COMPLETED"
  | "ERROR"
  | "UNKNOWN";

const statusLabel = (
  status?: string,
  isDark?: boolean
): { label: string; tone: string } => {
  switch (status) {
    case "UPLOADING":
      return {
        label: "Uploading",
        tone: isDark
          ? "text-indigo-200 bg-indigo-500/20 border border-indigo-400/40"
          : "text-indigo-700 bg-indigo-50 border border-indigo-200",
      };
    case "PROCESSING":
      return {
        label: "Processing",
        tone: isDark
          ? "text-indigo-200 bg-indigo-500/15 border border-indigo-400/40"
          : "text-indigo-700 bg-indigo-50 border border-indigo-200",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        tone: isDark
          ? "text-green-200 bg-green-900/40 border border-green-500/40"
          : "text-green-700 bg-green-50 border border-green-200",
      };
    case "ERROR":
      return {
        label: "Error",
        tone: isDark
          ? "text-red-200 bg-red-900/40 border border-red-500/40"
          : "text-red-700 bg-red-50 border border-red-200",
      };
    default:
      return {
        label: "Unknown",
        tone: isDark
          ? "text-white/80 bg-white/10 border-white/15"
          : "text-slate-700 bg-slate-100 border-slate-200",
      };
  }
};

export function ProjectsPanel() {
  const { isDark, palette } = useDashboardTheme();
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
    <div className={`${palette.card} rounded-xl p-6`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Projects
          </h2>
          <p
            className={`text-sm ${
              isDark ? "text-white/70" : "text-slate-600"
            }`}
          >
            Create a project and track processing status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadProjects}
            disabled={loading}
            className={`px-4 py-2.5 text-sm rounded-full transition-all border ${palette.border} ${
              isDark
                ? "bg-white/5 text-white hover:bg-white/10"
                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
            } disabled:opacity-50`}
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
            className={`w-full px-3 py-2 rounded-full border focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent ${
              isDark
                ? "border-white/15 bg-white/5 text-white placeholder:text-white/40"
                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm"
            }`}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 rounded-full border focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent ${
              isDark
                ? "border-white/15 bg-white/5 text-white placeholder:text-white/40"
                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm"
            }`}
          />
          <button
            onClick={handleCreate}
            disabled={creating}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all disabled:opacity-60 border ${palette.border} ${palette.accentButton} ${palette.accentButtonHover}`}
          >
            {creating ? "Creating..." : "Create project"}
          </button>
        </div>
        {error && (
          <p
            className={`text-sm ${
              isDark ? "text-red-200" : "text-red-700"
            }`}
          >
            {error}
          </p>
        )}
      </div>

      {sortedProjects.length === 0 ? (
        <div
          className={`border border-dashed rounded-lg p-6 text-center ${
            isDark
              ? "border-white/10 text-white/70 bg-white/5"
              : "border-slate-200 text-slate-600 bg-white/60"
          }`}
        >
          No projects yet. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedProjects.map((project, idx) => {
            const status = statusLabel(project.status, isDark);
            return (
              <div
                key={project.id ?? `${project.name}-${idx}`}
                className={`rounded-xl p-4 border ${palette.border} ${
                  isDark ? "bg-white/5" : "bg-white shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-white/50" : "text-slate-500"
                      }`}
                    >
                      ID: {project.id ?? "—"}
                    </p>
                    <h3
                      className={`text-lg font-semibold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
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
                  <p
                    className={`text-sm mt-2 ${
                      isDark ? "text-white/75" : "text-slate-700"
                    }`}
                  >
                    {project.description}
                  </p>
                )}
                <div
                  className={`flex items-center justify-between mt-4 text-sm ${
                    isDark ? "text-white/60" : "text-slate-600"
                  }`}
                >
                  <span>
                    Created:{" "}
                    {project.createdAt
                      ? new Date(project.createdAt).toLocaleString()
                      : "—"}
                  </span>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors border ${
                      isDark
                        ? "text-red-300 hover:text-red-200 disabled:opacity-50 border-red-500/30 bg-red-500/10 hover:bg-red-500/15"
                        : "text-red-600 hover:text-red-700 disabled:opacity-50 border-red-200 bg-red-50 hover:bg-red-100"
                    }`}
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
