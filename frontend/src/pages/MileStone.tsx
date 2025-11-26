"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { db } from "@/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { Plus, Trash2, Edit3 } from "lucide-react";

type Step = { id: string; title: string; done: boolean };
type MilestoneDoc = {
  id: string;
  title: string;
  description?: string;
  due?: string;
  steps: Step[];
  progress: number;
};

const PROJECT_ID = "default-project"; // <-- replace with your project id or read from route

export default function MilestonesPage() {
  const { profile } = useAuth();
  const [milestones, setMilestones] = useState<MilestoneDoc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // modal/edit state
  const [editing, setEditing] = useState<MilestoneDoc | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const selected = milestones.find((m) => m.id === selectedId) ?? null;

  // subscribe to milestones
  useEffect(() => {
    const col = collection(db, "projects", PROJECT_ID, "milestones");
    const q = query(col, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            title: data.title ?? "",
            description: data.description ?? "",
            due: data.due ?? "",
            steps: (data.steps ?? []) as Step[],
            progress: Number(data.progress ?? 0),
          } as MilestoneDoc;
        });
        setMilestones(docs);
        if (!selectedId && docs.length) setSelectedId(docs[0].id);
        setLoading(false);
      },
      (err) => {
        console.error("Milestones snapshot error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helpers
  function computeProgress(steps: Step[]) {
    if (!steps || steps.length === 0) return 0;
    const done = steps.filter((s) => s.done).length;
    return Math.round((done / steps.length) * 100);
  }

  // create new milestone (opens modal with blank)
  function openNew() {
    setEditing({
      id: `m-${Date.now()}`,
      title: "",
      description: "",
      due: "",
      steps: [],
      progress: 0,
    });
    setModalOpen(true);
  }

  // open edit
  function openEdit(m: MilestoneDoc) {
    setEditing({ ...m });
    setModalOpen(true);
  }

  // save (create or update)
  async function saveMilestone(m: MilestoneDoc) {
    try {
      const ref = doc(db, "projects", PROJECT_ID, "milestones", m.id);
      const payload = {
        title: m.title,
        description: m.description ?? "",
        due: m.due ?? "",
        steps: m.steps,
        progress: computeProgress(m.steps),
        updatedAt: serverTimestamp(),
      };

      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, payload);
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
      setModalOpen(false);
      setSelectedId(m.id);
    } catch (err) {
      console.error("saveMilestone error", err);
    }
  }

  // delete milestone
  async function deleteMilestone(id: string) {
    try {
      await deleteDoc(doc(db, "projects", PROJECT_ID, "milestones", id));
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      console.error("deleteMilestone error", err);
    }
  }

  // toggle step done (updates Firestore progress too)
  async function toggleStep(mid: string, stepId: string) {
    try {
      const ref = doc(db, "projects", PROJECT_ID, "milestones", mid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data() as any;
      const steps: Step[] = (data.steps ?? []).map((s: Step) =>
        s.id === stepId ? { ...s, done: !s.done } : s
      );
      const progress = computeProgress(steps);
      await updateDoc(ref, { steps, progress, updatedAt: serverTimestamp() });
    } catch (err) {
      console.error("toggleStep error:", err);
    }
  }

  // add a step in UI modal (local)
  function addStepToEditing(title: string) {
    if (!editing) return;
    const step: Step = {
      id: `s-${Date.now()}`,
      title: title.trim(),
      done: false,
    };
    setEditing({ ...editing, steps: [...editing.steps, step] });
  }

  // add step to a selected milestone (saves to Firestore)
  async function addStepToSelected(mid: string, title: string) {
    if (!title.trim()) return;
    try {
      const ref = doc(db, "projects", PROJECT_ID, "milestones", mid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data() as any;
      const steps: Step[] = data.steps ?? [];
      const newStep: Step = {
        id: `s-${Date.now()}`,
        title: title.trim(),
        done: false,
      };
      const newSteps = [...steps, newStep];
      const progress = computeProgress(newSteps);
      await updateDoc(ref, {
        steps: newSteps,
        progress,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  }

  // mark milestone complete (set all steps done)
  async function markMilestoneComplete(mid: string) {
    try {
      const ref = doc(db, "projects", PROJECT_ID, "milestones", mid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data() as any;
      const newSteps = (data.steps ?? []).map((s: Step) => ({
        ...s,
        done: true,
      }));
      await updateDoc(ref, {
        steps: newSteps,
        progress: 100,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  }

  // progress bar component (uses same look as dashboard)
  const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-muted/40">
      <div
        className="h-full rounded-full transition-[width]"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background:
            "linear-gradient(90deg, var(--primary), var(--secondary))",
        }}
      />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Milestones</h1>
        <p className="text-muted-foreground">
          Define milestone steps and track progress
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Milestones</h2>
              <button
                onClick={openNew}
                className="px-3 py-1 bg-primary text-white rounded-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New
              </button>
            </div>

            <div className="space-y-3">
              {loading && (
                <div className="p-3 bg-muted rounded">Loading...</div>
              )}
              {!loading && milestones.length === 0 && (
                <div className="p-3 bg-muted rounded">No milestones yet.</div>
              )}
              {milestones.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`w-full text-left p-3 rounded-lg border flex items-center justify-between ${selectedId === m.id ? "bg-white ring-1 ring-primary/50" : "bg-muted"}`}
                >
                  <div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Due: {m.due || "—"}
                    </div>
                  </div>
                  <div className="text-sm">{m.progress}%</div>
                </button>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1">
            {!selected && (
              <div className="p-6 bg-muted rounded">
                Select or create a milestone
              </div>
            )}

            {selected && (
              <div className="space-y-6">
                <header className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{selected.title}</h1>
                    {selected.description && (
                      <p className="text-sm text-muted-foreground">
                        {selected.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(selected)}
                      className="px-3 py-1 border rounded flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => deleteMilestone(selected.id)}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </header>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-muted/30 border border-border rounded-lg">
                    <h3 className="font-semibold mb-3">Progress</h3>
                    <ProgressBar value={selected.progress} />
                    <p className="text-xs mt-2 text-muted-foreground">
                      {selected.progress}% complete
                    </p>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Checklist</h4>
                      <ul className="space-y-2">
                        {selected.steps.map((s) => (
                          <li
                            key={s.id}
                            className="flex items-center justify-between p-3 bg-white rounded border"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={s.done}
                                onChange={() => toggleStep(selected.id, s.id)}
                              />
                              <div
                                className={
                                  s.done
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }
                              >
                                {s.title}
                              </div>
                            </div>
                            <div className="text-xs">
                              {s.done ? "Done" : "Pending"}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-muted/30 border border-border rounded-lg">
                    <h3 className="font-semibold mb-3">Details & Actions</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {selected.description}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">
                          Add quick step
                        </h4>
                        <QuickAdd
                          onAdd={(title) =>
                            addStepToSelected(selected.id, title)
                          }
                        />
                      </div>

                      <div>
                        <button
                          className="px-3 py-2 bg-primary text-white rounded"
                          onClick={() => markMilestoneComplete(selected.id)}
                        >
                          Mark Milestone Complete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal for add/edit */}
      {modalOpen && editing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded shadow-lg w-[700px] p-6">
            <h3 className="text-lg font-semibold mb-3">
              {milestones.some((m) => m.id === editing.id)
                ? "Edit Milestone"
                : "New Milestone"}
            </h3>

            <div className="space-y-3">
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Title"
              />
              <textarea
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Description"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={editing.due || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, due: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <div className="flex-1" />
              </div>

              <div>
                <h4 className="font-medium mb-2">Steps</h4>
                <div className="space-y-2">
                  {editing.steps.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={s.title}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            steps: editing.steps.map((x) =>
                              x.id === s.id
                                ? { ...x, title: e.target.value }
                                : x
                            ),
                          })
                        }
                        className="flex-1 p-2 border rounded"
                      />
                      <label className="text-sm">
                        <input
                          type="checkbox"
                          checked={s.done}
                          onChange={() =>
                            setEditing({
                              ...editing,
                              steps: editing.steps.map((x) =>
                                x.id === s.id ? { ...x, done: !x.done } : x
                              ),
                            })
                          }
                        />{" "}
                        Done
                      </label>
                      <button
                        onClick={() =>
                          setEditing({
                            ...editing,
                            steps: editing.steps.filter((x) => x.id !== s.id),
                          })
                        }
                        className="px-2 py-1 bg-red-50 text-red-700 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <InlineAdd onAdd={(title) => addStepToEditing(title)} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded"
                onClick={() => {
                  if (editing) saveMilestone(editing);
                }}
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

/* Small helper components */

function InlineAdd({ onAdd }: { onAdd: (t: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="flex gap-2">
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        className="flex-1 p-2 border rounded"
        placeholder="New step title"
      />
      <button
        onClick={() => {
          if (!v.trim()) return;
          onAdd(v.trim());
          setV("");
        }}
        className="px-3 py-1 bg-primary text-white rounded"
      >
        + Step
      </button>
    </div>
  );
}

function QuickAdd({ onAdd }: { onAdd: (t: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="flex gap-2 items-center">
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        className="flex-1 p-2 border rounded"
        placeholder="Quick step title"
      />
      <button
        onClick={() => {
          if (!v.trim()) return;
          onAdd(v.trim());
          setV("");
        }}
        className="px-3 py-1 bg-primary text-white rounded"
      >
        Add
      </button>
    </div>
  );
}
