"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Lightbulb,
  CheckSquare,
  ArrowUpRight,
} from "lucide-react";
import CardStat from "../components/shared/CardStat";
import ActivityItem from "../components/shared/ActivityItem";
import { useAuth } from "../auth/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const PROJECT_ID = "default-project"; // <-- replace with your real project id

interface Stats {
  teamMembers: number;
  totalIdeas: number;
  tasksCompleted: number;
  tasksTotal: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState<Stats>({
    teamMembers: 0,
    totalIdeas: 0,
    tasksCompleted: 0,
    tasksTotal: 0,
  });

  // next milestone shown in the Next Milestone card
  const [nextMilestone, setNextMilestone] = useState<{
    id?: string;
    title: string;
    progress: number;
    due?: string | null;
  } | null>(null);

  // milestone aggregates (counts) and steps aggregates
  const [milestoneCounts, setMilestoneCounts] = useState({
    totalMilestones: 0,
    completedMilestones: 0,
    totalSteps: 0,
    completedSteps: 0,
  });

  // Redirect unauthenticated users to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Subscribe to milestones collection:
  // - choose the next incomplete milestone (by due ascending)
  // - compute milestone counts and step counts across all milestones
  useEffect(() => {
    const col = collection(db, "projects", PROJECT_ID, "milestones");
    const q = query(col, orderBy("due", "asc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            title: data.title ?? "Milestone",
            progress: Number(data.progress ?? 0),
            due: data.due ?? null,
            steps: (data.steps ?? []) as Array<{
              id?: string;
              title?: string;
              done?: boolean;
            }>,
          };
        });

        // pick next incomplete milestone (earliest due)
        const incomplete = docs.filter((d) => (d.progress ?? 0) < 100);
        const next = (incomplete.length ? incomplete : docs)[0] ?? null;
        if (next) {
          setNextMilestone({
            id: next.id,
            title: next.title,
            progress: Number(next.progress ?? 0),
            due: next.due ?? null,
          });
        } else {
          setNextMilestone(null);
        }

        // milestone-level counts
        const totalMilestones = docs.length;
        const completedMilestones = docs.filter(
          (d) => Number(d.progress ?? 0) >= 100
        ).length;

        // step-level counts across all milestones
        let totalSteps = 0;
        let completedSteps = 0;
        for (const d of docs) {
          const steps = d.steps ?? [];
          totalSteps += steps.length;
          completedSteps += steps.filter((s) => !!s.done).length;
        }

        setMilestoneCounts({
          totalMilestones,
          completedMilestones,
          totalSteps,
          completedSteps,
        });
      },
      (err) => {
        console.error("Milestones subscription error:", err);
        setNextMilestone(null);
        setMilestoneCounts({
          totalMilestones: 0,
          completedMilestones: 0,
          totalSteps: 0,
          completedSteps: 0,
        });
      }
    );

    return () => unsub();
  }, []);

  // Subscribe to tasks in the project to compute tasks metrics
  useEffect(() => {
    const tasksRef = collection(db, "projects", PROJECT_ID, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => d.data() as any);

        const tasksTotal = docs.length;
        const tasksCompleted = docs.filter((t) => t.status === "done").length;

        // Count unique assigneeIds as a naive teamMembers metric
        const memberIds = new Set(
          docs
            .map((t) => (t.assigneeId ? String(t.assigneeId) : null))
            .filter(Boolean)
        );

        setStats((prev) => ({
          ...prev,
          teamMembers: memberIds.size || 1,
          tasksCompleted,
          tasksTotal,
        }));
      },
      (error) => {
        console.error("Tasks subscription error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // compute tasks-based progress
  const tasksProgress =
    stats.tasksTotal === 0
      ? 0
      : Math.round((stats.tasksCompleted / stats.tasksTotal) * 100);

  // compute milestone-level and step-level percentages
  const milestonesProgress =
    milestoneCounts.totalMilestones === 0
      ? 0
      : Math.round(
          (milestoneCounts.completedMilestones /
            milestoneCounts.totalMilestones) *
            100
        );

  const stepsProgress =
    milestoneCounts.totalSteps === 0
      ? 0
      : Math.round(
          (milestoneCounts.completedSteps / milestoneCounts.totalSteps) * 100
        );

  // Display logic:
  // prefer showing step-level progress (if any steps exist),
  // otherwise show milestone-level progress (completed milestones/total),
  // otherwise fall back to tasksProgress.
  const displayProgress =
    milestoneCounts.totalSteps > 0
      ? stepsProgress
      : milestoneCounts.totalMilestones > 0
        ? milestonesProgress
        : tasksProgress;

  const activities = [
    {
      type: "join" as const,
      user: "Alex",
      action: "joined the team",
      time: "5m ago",
    },
    {
      type: "task" as const,
      user: "Jordan",
      action: "completed Design login page",
      time: "12m ago",
    },
    {
      type: "comment" as const,
      user: "You",
      action: 'pinned "AI Chatbot" idea',
      time: "1h ago",
    },
    {
      type: "task" as const,
      user: "Sam",
      action: "started Backend API setup",
      time: "2h ago",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your hackathon overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardStat
          label="Team Members"
          value={stats.teamMembers}
          icon={<Users className="w-5 h-5" />}
          color="primary"
        />

        {/* show milestones/steps counts */}
        <CardStat
          label="Milestones"
          value={`${milestoneCounts.completedMilestones}/${milestoneCounts.totalMilestones}`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="secondary"
        />

        <CardStat
          label="Tasks Completed"
          value={`${stats.tasksCompleted}/${stats.tasksTotal}`}
          icon={<CheckSquare className="w-5 h-5" />}
          color="accent"
          trend={12}
        />

        <CardStat
          label="Progress"
          value={`${displayProgress}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="primary"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Next Milestone card */}
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6">
          <h3
            className="group font-semibold text-foreground mb-2 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate("/milestones")}
            title={nextMilestone ? nextMilestone.title : "Open milestones"}
          >
            {"Next Milestone"}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </h3>
          {/* show the checklist done for the latestest milstone */}
          {/* <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
              style={{
                width: `${nextMilestone ? Math.min(Math.max(nextMilestone.progress, 0), 100) : 0}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {nextMilestone
              ? `${nextMilestone.progress}% Complete`
              : "No milestone"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {nextMilestone?.due ? `Due: ${nextMilestone.due}` : "No due date"}
          </p> */}

          {/* show global checklist completion when steps exist */}
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
              style={{ width: `${displayProgress}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {milestoneCounts.totalSteps > 0
              ? `${milestoneCounts.completedSteps}/${milestoneCounts.totalSteps} checklist items completed (${stepsProgress}%)`
              : milestoneCounts.totalMilestones > 0
                ? `${milestoneCounts.completedMilestones}/${milestoneCounts.totalMilestones} milestones completed (${milestonesProgress}%)`
                : `${tasksProgress}% Complete (tasks)`}
          </p>
        </div>

        <div className="bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">
            Submission Status
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            2 of 4 items ready
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span className="text-muted-foreground">GitHub Repository</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span className="text-muted-foreground">Project Summary</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recent Activity
        </h2>
        <div className="space-y-0">
          {activities.map((activity, i) => (
            <ActivityItem key={i} {...activity} />
          ))}
        </div>
        <button className="w-full mt-4 px-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  );
}
