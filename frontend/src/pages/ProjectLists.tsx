"use client";

import { useEffect, useState } from "react";

interface Project {
  id: number;
  name: string;
  description?: string;
  category?: string;
}

export default function ProjectLists() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // 🔄 Load from localStorage
  function loadProjects() {
    const saved = localStorage.getItem("projects");
    setProjects(saved ? JSON.parse(saved) : []);
  }

  // 🧠 Delete project
  function handleDelete(id: number) {
    const updated = projects.filter((p) => p.id !== id);
    localStorage.setItem("projects", JSON.stringify(updated));
    setProjects(updated);
    window.dispatchEvent(new Event("projectsUpdated"));
  }

  // ✏️ Start editing a project
  function handleEditStart(project: Project) {
    setEditingProject(project);
    setEditName(project.name);
    setEditDesc(project.description || "");
    setEditCategory(project.category || "");
  }

  // 💾 Save edited project
  function handleEditSave() {
    if (!editingProject) return;
    const updated = projects.map((p) =>
      p.id === editingProject.id
        ? {
            ...p,
            name: editName,
            description: editDesc,
            category: editCategory,
          }
        : p
    );

    localStorage.setItem("projects", JSON.stringify(updated));
    setProjects(updated);
    setEditingProject(null);
    window.dispatchEvent(new Event("projectsUpdated"));
  }

  useEffect(() => {
    loadProjects();

    // 🔁 Listen for custom event (from Sidebar)
    const handleUpdate = () => loadProjects();
    window.addEventListener("projectsUpdated", handleUpdate);

    return () => window.removeEventListener("projectsUpdated", handleUpdate);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Projects</h1>

      {projects.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No projects yet. Click <strong>“+ New Project”</strong> in the sidebar
          to add one.
        </p>
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 bg-muted/40 flex justify-between items-start"
            >
              <div>
                <h2 className="font-semibold text-lg">{p.name}</h2>
                <p className="text-xs text-muted-foreground mb-1">
                  {p.category || "Uncategorized"}
                </p>
                {p.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {p.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {/* Edit Button */}
                <button
                  onClick={() => handleEditStart(p)}
                  className="px-3 py-1 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1 text-sm rounded-lg border border-red-400 text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✏️ Edit Modal */}
      {editingProject && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setEditingProject(null)}
        >
          <div
            className="bg-background p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Edit Project</h2>

            <input
              type="text"
              placeholder="Project Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            <textarea
              placeholder="Short Description (optional)"
              rows={3}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            <select
              className="w-full border rounded p-2 mb-4"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              <option className="text-black" value="">
                Select Category
              </option>
              <option className="text-black" value="Software">
                Software
              </option>
              <option className="text-black" value="Hardware">
                Hardware
              </option>
              <option className="text-black" value="Design">
                Design
              </option>
              <option className="text-black" value="Research">
                Research
              </option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingProject(null)}
                className="px-3 py-1 text-sm border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1 text-sm bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!editName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
