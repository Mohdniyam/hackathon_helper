import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaskStatus = "todo" | "in-progress" | "done";
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

interface ProjectState {
  tasks: Task[];
  addTask: (title: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
  resetTasks: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            { id: crypto.randomUUID(), title, status: "todo" },
          ],
        })),
      updateTaskStatus: (id, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),
      removeTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      resetTasks: () => set({ tasks: [] }),
    }),
    { name: "project-store" }
  )
);
