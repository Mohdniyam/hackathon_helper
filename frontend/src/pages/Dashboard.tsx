"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Lightbulb, CheckSquare } from "lucide-react";
import CardStat from "../components/shared/CardStat";
import ActivityItem from "../components/shared/ActivityItem";

export default function Dashboard() {
  const [stats, setStats] = useState({
    teamMembers: 3,
    totalIdeas: 12,
    tasksCompleted: 8,
    tasksTotal: 15,
  });
  useEffect(() => {
    setStats({
      teamMembers: 5,
      totalIdeas: 9,
      tasksCompleted: 10,
      tasksTotal: 12,
    });
  }, []);

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
        <CardStat
          label="Total Ideas"
          value={stats.totalIdeas}
          icon={<Lightbulb className="w-5 h-5" />}
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
          value={`${Math.round((stats.tasksCompleted / stats.tasksTotal) * 100)}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="primary"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">Next Milestone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Project Submission
          </p>
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
              style={{ width: "65%" }}
            />
          </div>
          <p className="text-xs text-muted-foreground">65% Complete</p>
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
