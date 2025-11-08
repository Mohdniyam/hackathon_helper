"use client";

import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  BookOpen,
  CheckSquare,
  Send,
  Presentation,
  X,
  Projector,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Team", icon: Users, path: "/team" },
  { label: "Ideas", icon: Lightbulb, path: "/ideas" },
  { label: "Resources", icon: BookOpen, path: "/resources" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  // { label: "Submission", icon: Send, path: "/submission" },
  { label: "Showcase", icon: Presentation, path: "/showcase" },
  { label: "Projects", icon: Projector, path: "/projects" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // ✅ Form fields
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [problemItSolves, setProblemItSolves] = useState("");
  const [challengesFaced, setChallengesFaced] = useState("");
  const [technologiesUsed, setTechnologiesUsed] = useState("");
  const [projectCategory, setProjectCategory] = useState("");

  const location = useLocation();

  // 🧠 Create project and save in localStorage
  function handleCreateProject() {
    if (!projectName.trim()) return;

    const newProject = {
      id: Date.now(),
      name: projectName,
      description: projectDesc,
      problemItSolves,
      challengesFaced,
      technologiesUsed,
      category: projectCategory || "Uncategorized",
    };

    const existing = JSON.parse(localStorage.getItem("projects") || "[]");
    existing.push(newProject);
    localStorage.setItem("projects", JSON.stringify(existing));

    window.dispatchEvent(new Event("projectsUpdated"));

    // Clear form + close modal
    setProjectName("");
    setProjectDesc("");
    setProblemItSolves("");
    setChallengesFaced("");
    setTechnologiesUsed("");
    setProjectCategory("");
    setShowModal(false);
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
        />
      )}

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static h-screen w-64 border-r border-border bg-background transition-transform duration-300 z-40 flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            HackHelper
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Team Info */}
        <div className="px-6 py-4 border-b border-border">
          <div className="mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Team
            </p>
            <p className="text-sm font-medium mt-1">BuildCrew</p>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>
              Time Left:{" "}
              <span className="text-accent font-semibold">2d 14h 32m</span>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <button
            onClick={() => setShowModal(true)}
            className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + New Project
          </button>
        </div>
      </aside>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-background p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>

            {/* Project Name */}
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            {/* Description */}
            <textarea
              placeholder="Short Description (optional)"
              rows={3}
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            {/* Problem It Solves */}
            <textarea
              placeholder="The problem it solves"
              rows={3}
              value={problemItSolves}
              onChange={(e) => setProblemItSolves(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            {/* Challenges Faced */}
            <textarea
              placeholder="Challenges faced"
              rows={3}
              value={challengesFaced}
              onChange={(e) => setChallengesFaced(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            {/* Technologies Used */}
            <textarea
              placeholder="Technologies used"
              rows={2}
              value={technologiesUsed}
              onChange={(e) => setTechnologiesUsed(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            {/* Category */}
            <select
              className="w-full border rounded p-2 mb-4"
              value={projectCategory}
              onChange={(e) => setProjectCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option className="text-black" value="Web App">
                Web App
              </option>
              <option className="text-black" value="Mobile App">
                Mobile App
              </option>
              <option className="text-black" value="AI/ML">
                AI / ML
              </option>
              <option className="text-black" value="IoT">
                IoT
              </option>
              <option className="text-black" value="Blockchain">
                Blockchain
              </option>
              <option className="text-black" value="Research">
                Research
              </option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
                className="px-3 py-1 text-sm bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
