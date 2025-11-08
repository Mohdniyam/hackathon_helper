"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Send, LinkIcon } from "lucide-react";

interface SubmissionItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export default function Submission() {
  const [items, setItems] = useState<SubmissionItem[]>([
    {
      id: "project-name",
      label: "Project Name",
      description: "Enter your project title",
      completed: true,
      required: true,
    },
    {
      id: "github",
      label: "GitHub Repository",
      description: "Link to your GitHub repository",
      completed: true,
      required: true,
    },
    {
      id: "demo-url",
      label: "Live Demo URL",
      description: "Link to your deployed project",
      completed: false,
      required: true,
    },
    {
      id: "summary",
      label: "Project Summary",
      description: "50-200 words describing your project",
      completed: false,
      required: true,
    },
    {
      id: "video",
      label: "Demo Video",
      description: "Link to your demo video (optional)",
      completed: false,
      required: false,
    },
    {
      id: "team",
      label: "Team Members",
      description: "List all team members involved",
      completed: true,
      required: true,
    },
  ]);

  const [projectName, setProjectName] = useState("AI Code Assistant");
  const [gitHub, setGitHub] = useState("https://github.com/yourrepo/hackathon");
  const [summary, setSummary] = useState("");

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = items.filter((i) => i.completed).length;
  const requiredCount = items.filter((i) => i.required).length;
  const completedRequired = items.filter(
    (i) => i.required && i.completed
  ).length;
  const isReady = completedRequired === requiredCount;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Project Submission
        </h1>
        <p className="text-muted-foreground">
          Complete the checklist to submit your project
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Submission Progress
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Overall ({completedCount}/{items.length})
              </span>
              <span className="text-sm font-medium text-foreground">
                {Math.round((completedCount / items.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / items.length) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Required ({completedRequired}/{requiredCount})
              </span>
              <span
                className={`text-sm font-medium ${isReady ? "text-accent" : "text-muted-foreground"}`}
              >
                {isReady ? "Ready to submit" : "Not ready"}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${isReady ? "bg-accent" : "bg-muted-foreground"}`}
                style={{
                  width: `${(completedRequired / requiredCount) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Project Name *
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            GitHub Repository *
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg">
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                value={gitHub}
                onChange={(e) => setGitHub(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
              />
            </div>
            <button className="px-3 py-2 bg-secondary/10 text-secondary rounded-lg text-sm font-medium hover:bg-secondary/20 transition-colors">
              Verify
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Project Summary *
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Describe your project in 50-200 words..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-32"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {summary.length}/200 characters
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground text-lg">
          Pre-Submission Checklist
        </h2>
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 border rounded-lg transition-colors cursor-pointer ${
              item.completed
                ? "bg-accent/5 border-accent/30"
                : "bg-muted/30 border-border hover:border-muted-foreground/30"
            }`}
            onClick={() => toggleItem(item.id)}
          >
            <div className="flex items-start gap-3">
              <button
                className={`mt-1 p-1 rounded-lg transition-colors ${
                  item.completed
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground bg-muted hover:text-foreground"
                }`}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{item.label}</p>
                  {item.required && (
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded font-medium">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Message */}
      <div
        className={`p-4 border rounded-lg flex items-start gap-3 ${
          isReady
            ? "bg-accent/5 border-accent/30"
            : "bg-primary/5 border-primary/30"
        }`}
      >
        {isReady ? (
          <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
        )}
        <div>
          <p
            className={`font-semibold ${isReady ? "text-accent" : "text-primary"}`}
          >
            {isReady
              ? "Ready to Submit!"
              : "Complete all required items to submit"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {isReady
              ? "Your project is ready for submission. Click the button below to submit."
              : `Complete ${requiredCount - completedRequired} more required item${requiredCount - completedRequired !== 1 ? "s" : ""} to proceed.`}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        disabled={!isReady}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
          isReady
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        <Send className="w-4 h-4" />
        {isReady ? "Submit Project" : "Complete Checklist to Submit"}
      </button>
    </div>
  );
}
