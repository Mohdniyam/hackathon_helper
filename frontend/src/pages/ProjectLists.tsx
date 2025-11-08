"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  name: string;
  description?: string;
  problemItSolves?: string;
  challengesFaced?: string;
  technologiesUsed?: string;
  category?: string;
}

export default function ProjectLists() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form fields for editing
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editProblem, setEditProblem] = useState("");
  const [editChallenges, setEditChallenges] = useState("");
  const [editTech, setEditTech] = useState("");
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
    setEditProblem(project.problemItSolves || "");
    setEditChallenges(project.challengesFaced || "");
    setEditTech(project.technologiesUsed || "");
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
            problemItSolves: editProblem,
            challengesFaced: editChallenges,
            technologiesUsed: editTech,
            category: editCategory,
          }
        : p
    );

    localStorage.setItem("projects", JSON.stringify(updated));
    setProjects(updated);
    setEditingProject(null);
    window.dispatchEvent(new Event("projectsUpdated"));
  }

  // 📨 Handle Submit (send project data to Submission form)
  const navigate = useNavigate();

  // 📨 Handle Submit (send project data to Submission form)
  function handleSubmitProject(project: Project) {
    // store this project under a unique key
    localStorage.setItem(
      `submissionData-${project.id}`,
      JSON.stringify({
        projectName: project.name || "",
        summary:
          project.description ||
          project.problemItSolves ||
          project.challengesFaced ||
          "",
        github: "",
        demoUrl: "",
        team: "",
        category: project.category || "",
        technologiesUsed: project.technologiesUsed || "",
      })
    );

    // redirect to that project’s submission page
    navigate(`/submission/${project.id}`);
  }

  useEffect(() => {
    loadProjects();
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
              <div className="max-w-[80%]">
                <h2 className="font-semibold text-lg">{p.name}</h2>
                <p className="text-xs text-muted-foreground mb-1">
                  {p.category || "Uncategorized"}
                </p>

                {p.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Description:</strong> {p.description}
                  </p>
                )}
                {p.problemItSolves && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Problem It Solves:</strong> {p.problemItSolves}
                  </p>
                )}
                {p.challengesFaced && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Challenges Faced:</strong> {p.challengesFaced}
                  </p>
                )}
                {p.technologiesUsed && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Technologies Used:</strong> {p.technologiesUsed}
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
                <button
                  onClick={() => handleSubmitProject(p)}
                  className="px-3 py-1 text-sm rounded-lg border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition"
                >
                  Submit
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
            className="bg-background p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto"
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

            <textarea
              placeholder="The problem it solves"
              rows={3}
              value={editProblem}
              onChange={(e) => setEditProblem(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            <textarea
              placeholder="Challenges faced"
              rows={3}
              value={editChallenges}
              onChange={(e) => setEditChallenges(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            <textarea
              placeholder="Technologies used"
              rows={2}
              value={editTech}
              onChange={(e) => setEditTech(e.target.value)}
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
                disabled={!editName.trim()}
                className="px-3 py-1 text-sm bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
