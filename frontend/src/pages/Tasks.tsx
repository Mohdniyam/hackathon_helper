"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, Clock } from "lucide-react";
import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "@/auth/AuthContext";

type TaskStatus = "todo" | "in-progress" | "done";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeId: string;
  dueDate: string; // "YYYY-MM-DD"
}

const PROJECT_ID = "default-project"; // later you can get this from route or team context

export default function Tasks() {
  const { profile } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const statusColors: Record<TaskStatus, string> = {
    todo: "bg-muted/50 text-muted-foreground",
    "in-progress": "bg-secondary/10 text-secondary",
    done: "bg-accent/10 text-accent",
  };

  const priorityColors: Record<TaskPriority, string> = {
    low: "border-l-4 border-secondary/50",
    medium: "border-l-4 border-accent/50",
    high: "border-l-4 border-primary/50",
  };

  // 🔄 Subscribe to tasks for this project
  useEffect(() => {
    const tasksRef = collection(db, "projects", PROJECT_ID, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Task[] = snapshot.docs.map((d) => {
          const docData = d.data() as any;
          return {
            id: d.id,
            title: docData.title,
            status: docData.status,
            priority: docData.priority ?? "medium",
            assignee: docData.assigneeName ?? "Unknown",
            assigneeId: docData.assigneeId ?? "",
            dueDate: docData.dueDate ?? "",
          };
        });
        setTasks(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error subscribing to tasks:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const assigneeName = profile?.name ?? profile?.email ?? "Anonymous Member";
    const assigneeId = profile?.uid ?? "unknown";

    try {
      const tasksRef = collection(db, "projects", PROJECT_ID, "tasks");
      const dueDate = new Date(Date.now() + 86400000)
        .toISOString()
        .split("T")[0];

      await addDoc(tasksRef, {
        title: newTask.trim(),
        status: "todo",
        priority: "medium",
        assigneeId,
        assigneeName,
        dueDate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setNewTask("");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const moveTask = async (id: string, newStatus: TaskStatus) => {
    try {
      const taskRef = doc(db, "projects", PROJECT_ID, "tasks", id);
      await updateDoc(taskRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const taskRef = doc(db, "projects", PROJECT_ID, "tasks", id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const columns = ["todo", "in-progress", "done"] as const;
  const columnTitles: Record<TaskStatus, string> = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Tasks</h1>
          <p className="text-muted-foreground">Manage your project tasks</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task..."
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-sm text-muted-foreground">
          Loading tasks for your team...
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {columns.map((status) => {
          const statusTasks = tasks.filter((t) => t.status === status);
          return (
            <div
              key={status}
              className="bg-muted/20 border border-border rounded-lg p-4"
            >
              <h2 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                {columnTitles[status]} ({statusTasks.length})
              </h2>
              <div className="space-y-3">
                {statusTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 bg-background border rounded-lg hover:shadow-md transition-all group ${
                      priorityColors[task.priority]
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-muted-foreground hover:text-accent rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        {task.assignee}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${statusColors[status]}`}
                      >
                        {status === "in-progress"
                          ? "In Progress"
                          : status === "done"
                            ? "Done"
                            : "To Do"}
                      </span>
                    </div>
                    {status !== "done" && (
                      <button
                        onClick={() =>
                          moveTask(
                            task.id,
                            status === "todo" ? "in-progress" : "done"
                          )
                        }
                        className="w-full mt-3 px-2 py-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        {status === "todo" ? "Start" : "Complete"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
