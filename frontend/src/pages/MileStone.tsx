import React, { useState } from "react";
import type { JSX } from "react/jsx-runtime";

type Task = { id: string; title: string; assignee?: string; done: boolean };
type Milestone = {
  id: string;
  title: string;
  description?: string;
  progress: number; // 0-100
  due?: string;
  tasks: Task[];
};

export default function MilestonesPage(): JSX.Element {
  // sample data
  console.log("Inside Milestone");

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "m-1",
      title: "Project Submission",
      description: "Finish README, demo video and deployment",
      progress: 65,
      due: "2025-01-20",
      tasks: [
        { id: "t-1", title: "Write README", assignee: "Jordan", done: true },
        {
          id: "t-2",
          title: "Record demo video",
          assignee: "Alex",
          done: false,
        },
        { id: "t-3", title: "Deploy to Vercel", assignee: "Sam", done: false },
      ],
    },
    {
      id: "m-2",
      title: "MVP Features",
      description: "Core features: auth, idea board, task tracking",
      progress: 42,
      due: "2025-01-15",
      tasks: [
        { id: "t-4", title: "Auth flow", assignee: "Sam", done: false },
        { id: "t-5", title: "Idea board UI", assignee: "Jordan", done: true },
      ],
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(
    milestones[0]?.id ?? null
  );
  const selected = milestones.find((m) => m.id === selectedId) ?? null;

  // modal state for add/edit
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Milestone | null>(null);

  function openNewModal(): void {
    setEditing({
      id: `m-${Date.now()}`,
      title: "",
      description: "",
      progress: 0,
      due: "",
      tasks: [],
    });
    setModalOpen(true);
  }

  function openEditModal(m: Milestone): void {
    setEditing({ ...m });
    setModalOpen(true);
  }

  function saveMilestone(data: Milestone): void {
    setMilestones((prev) => {
      const exists = prev.find((p) => p.id === data.id);
      if (exists) return prev.map((p) => (p.id === data.id ? data : p));
      return [data, ...prev];
    });
    setModalOpen(false);
    setSelectedId(data.id);
  }

  function deleteMilestone(id: string): void {
    setMilestones((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function toggleTask(mid: string, tid: string): void {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== mid) return m;
        const tasks = m.tasks.map((t) =>
          t.id === tid ? { ...t, done: !t.done } : t
        );
        const completed = tasks.filter((t) => t.done).length;
        const progress = tasks.length
          ? Math.round((completed / tasks.length) * 100)
          : m.progress;
        return { ...m, tasks, progress };
      })
    );
  }

  // small helper component: progress bar
  const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-muted/40">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background:
            "linear-gradient(90deg, var(--primary), var(--secondary))",
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-surface text-foreground">
      {/* small CSS variables so this component renders nicely without global setup */}
      <style>{`
        :root {
          --primary: #0B5A52; /* primary deep teal */
          --secondary: #0F7A66; /* secondary teal */
          --accent: #F59E0B; /* accent for highlights */
          --muted: #E6F3F1; /* muted cards */
          --surface: #F7FBFA; /* page bg */
          --fg: #063B34; /* default text */
        }
        .bg-muted { background-color: var(--muted); }
        .bg-surface { background-color: var(--surface); }
        .text-foreground { color: var(--fg); }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-8">
          {/* left column: milestones list */}
          <aside className="w-80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Milestones</h2>
              <button
                onClick={openNewModal}
                className="px-3 py-1 rounded-md bg-primary text-white"
              >
                + New
              </button>
            </div>

            {/* small gallery referencing the screenshots you uploaded (local paths) */}
            <div className="grid grid-cols-1 gap-2 mb-4">
              <img
                src="/mnt/data/9497a381-4467-4730-ad04-794490f80ad9.png"
                alt="landing"
                className="rounded-lg shadow-sm border"
              />
              <img
                src="/mnt/data/38ebf806-572a-495e-8ece-7187af032927.png"
                alt="dashboard"
                className="rounded-lg shadow-sm border"
              />
            </div>

            <div className="space-y-3">
              {milestones.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`w-full text-left p-3 rounded-lg border ${selectedId === m.id ? "ring-2 ring-offset-2 ring-primary/40 bg-white" : "bg-muted"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{m.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Due: {m.due || "—"}
                      </div>
                    </div>
                    <div className="text-sm">{m.progress}%</div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* main content: detail */}
          <main className="flex-1">
            {!selected && (
              <div className="p-8 bg-muted rounded-lg">
                Select a milestone or create a new one.
              </div>
            )}

            {selected && (
              <div className="space-y-6">
                <header className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{selected.title}</h1>
                    <p className="text-sm text-muted-foreground">
                      {selected.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(selected)}
                      className="px-4 py-2 rounded-md border"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMilestone(selected.id)}
                      className="px-4 py-2 rounded-md bg-red-50 text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </header>

                <section className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-3">Progress</h3>
                    <ProgressBar value={selected.progress} />
                    <p className="text-xs mt-2 text-muted-foreground">
                      {selected.progress}% complete
                    </p>

                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium">Tasks</h4>
                      <ul className="space-y-2 mt-2">
                        {selected.tasks.map((t) => (
                          <li
                            key={t.id}
                            className="flex items-center justify-between p-3 border rounded-md bg-white"
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={t.done}
                                onChange={() => toggleTask(selected.id, t.id)}
                              />
                              <div>
                                <div
                                  className={`font-medium ${t.done ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {t.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {t.assignee || "Unassigned"}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs">
                              {t.done ? "Done" : "Pending"}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-3">Details & Checklist</h3>
                    <p className="text-sm text-muted-foreground">
                      {selected.description}
                    </p>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Submission status</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        <li>
                          GitHub repo:{" "}
                          {selected.tasks.some((t) =>
                            t.title.toLowerCase().includes("repo")
                          )
                            ? "Ready"
                            : "Pending"}
                        </li>
                        <li>
                          Demo video:{" "}
                          {selected.progress > 50 ? "Recorded" : "Pending"}
                        </li>
                        <li>
                          Readme:{" "}
                          {selected.tasks.some((t) =>
                            t.title.toLowerCase().includes("readme")
                          )
                            ? "Ready"
                            : "Pending"}
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Actions</h4>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-md bg-primary text-white">
                          Add Task
                        </button>
                        <button className="px-4 py-2 rounded-md border">
                          Share
                        </button>
                        <button
                          className="px-4 py-2 rounded-md bg-accent/10 text-accent"
                          style={{ borderColor: "rgba(245,158,11,0.15)" }}
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="p-6 bg-white rounded-lg border">
                    <h3 className="font-semibold mb-3">Activity</h3>
                    <div className="text-sm text-muted-foreground">
                      Recent actions will appear here (task updates, file
                      uploads, comments).
                    </div>
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal (simple) */}
      {isModalOpen && editing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative p-6 bg-white rounded-lg w-[720px] shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editing && milestones.some((m) => m.id === editing.id)
                ? "Edit"
                : "New"}{" "}
              Milestone
            </h3>
            <div className="space-y-3">
              <input
                className="w-full p-2 border rounded"
                placeholder="Title"
                value={editing.title}
                onChange={(e) =>
                  setEditing((v) => (v ? { ...v, title: e.target.value } : v))
                }
              />
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Description"
                value={editing.description}
                onChange={(e) =>
                  setEditing((v) =>
                    v ? { ...v, description: e.target.value } : v
                  )
                }
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  className="p-2 border rounded"
                  value={editing.due}
                  onChange={(e) =>
                    setEditing((v) => (v ? { ...v, due: e.target.value } : v))
                  }
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="p-2 border rounded"
                  value={editing.progress}
                  onChange={(e) =>
                    setEditing((v) =>
                      v ? { ...v, progress: Number(e.target.value) } : v
                    )
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editing) saveMilestone(editing);
                }}
                className="px-4 py-2 bg-primary text-white rounded"
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
