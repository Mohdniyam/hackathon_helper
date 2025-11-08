"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Send, LinkIcon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

interface SubmissionItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export default function Submission() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState<SubmissionItem[]>([
    {
      id: "project-name",
      label: "Project Name",
      description: "Enter your project title",
      completed: false,
      required: true,
    },
    {
      id: "category",
      label: "Project Category",
      description: "Select the project category",
      completed: false,
      required: true,
    },
    {
      id: "tech-stack",
      label: "Technology Stack",
      description: "List all technologies used (comma separated)",
      completed: false,
      required: true,
    },
    {
      id: "github",
      label: "GitHub Repository",
      description: "Link to your GitHub repository",
      completed: false,
      required: true,
    },
    {
      id: "demo-url",
      label: "Live Demo URL",
      description: "Link to your deployed project",
      completed: false,
      required: false,
    },
    {
      id: "summary",
      label: "Project Summary",
      description: "50–200 words describing your project",
      completed: false,
      required: true,
    },
    {
      id: "dates",
      label: "Project Duration",
      description: "Select the start and end date of your project",
      completed: false,
      required: false,
    },
    {
      id: "team",
      label: "Team Members",
      description: "List all team members involved",
      completed: false,
      required: true,
    },
  ]);

  // form fields
  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState("");
  const [techStack, setTechStack] = useState("");
  const [gitHub, setGitHub] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [team, setTeam] = useState("");

  useEffect(() => {
    if (!projectId) return;
    const saved = localStorage.getItem(`submissionData-${projectId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setProjectName(data.projectName || "");
      setSummary(data.summary || "");
      setGitHub(data.github || "");
      setDemoUrl(data.demoUrl || "");
      setTeam(data.team || "");
      setCategory(data.category || "");
      setTechStack(data.technologiesUsed || "");
    }
  }, [projectId]);

  const markComplete = (id: string, condition: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: condition } : item
      )
    );
  };

  // Auto-mark fields complete based on input
  const handleAutoValidation = () => {
    markComplete("project-name", projectName.trim().length > 2);
    markComplete("category", category.trim().length > 0);
    markComplete("tech-stack", techStack.trim().length > 0);
    markComplete("github", gitHub.startsWith("http"));
    markComplete("demo-url", demoUrl.startsWith("http"));
    markComplete("summary", summary.trim().length >= 50);
    markComplete("dates", startDate !== "" && endDate !== "");
    markComplete("team", team.trim().length > 0);
  };

  const completedCount = items.filter((i) => i.completed).length;
  const requiredCount = items.filter((i) => i.required).length;
  const completedRequired = items.filter(
    (i) => i.required && i.completed
  ).length;
  const isReady = completedRequired === requiredCount;

  const handleSubmit = () => {
    const submissionData = {
      projectName,
      category,
      techStack,
      gitHub,
      demoUrl,
      summary,
      startDate,
      endDate,
      team,
    };

    // ✅ Keep your existing logic
    if (projectId) {
      localStorage.setItem(
        `submissionData-${projectId}`,
        JSON.stringify(submissionData)
      );
    }

    // ✅ New showcase logic (separate from your existing storage)
    const existingShowcaseData =
      JSON.parse(localStorage.getItem("submittedProjects") || "[]");

    const newSubmission = {
      id: projectId || Date.now().toString(),
      projectName,
      category,
      techStack,
      gitHub,
      demoUrl,
      summary,
      startDate,
      endDate,
      team,
    };

    const updatedShowcaseData = existingShowcaseData.filter(
      (p: any) => p.id !== newSubmission.id
    );
    updatedShowcaseData.push(newSubmission);

    localStorage.setItem(
      "submittedProjects",
      JSON.stringify(updatedShowcaseData)
    );

    navigate("/showcase");
  };

  return (
    <div className="p-6 space-y-8" onChange={handleAutoValidation}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Project Submission
        </h1>
        <p className="text-muted-foreground">
          Complete all fields below to submit your project.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Submission Progress
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span>
                Overall ({completedCount}/{items.length})
              </span>
              <span>{Math.round((completedCount / items.length) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / items.length) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span>
                Required ({completedRequired}/{requiredCount})
              </span>
              <span
                className={isReady ? "text-accent" : "text-muted-foreground"}
              >
                {isReady ? "Ready to submit" : "Not ready"}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isReady ? "bg-accent" : "bg-muted-foreground"
                }`}
                style={{
                  width: `${(completedRequired / requiredCount) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fields Section */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Project Name *
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-background border-border text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Project Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-background border-border text-sm"
          >
            <option value="">Select category</option>
            <option value="Web App">Web App</option>
            <option value="Mobile App">Mobile App</option>
            <option value="AI/ML">AI / ML</option>
            <option value="IoT">IoT</option>
            <option value="Blockchain">Blockchain</option>
            <option value="Research">Research</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tech Stack *</label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="e.g. React, Node.js, MongoDB"
            className="w-full border rounded-lg px-3 py-2 bg-background border-border text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            GitHub Repository *
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 border rounded-lg bg-background">
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                value={gitHub}
                onChange={(e) => setGitHub(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Live Demo URL (optional)
          </label>
          <input
            type="url"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-background border-border text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Project Summary *
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-background border-border text-sm h-32 resize-none"
            placeholder="Describe your project in 50–200 words..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            {summary.length}/200 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Team Members *
          </label>
          <input
            type="text"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Enter team member names, separated by commas"
            className="w-full border rounded-lg px-3 py-2 bg-background border-border text-sm"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
      >
        <Send className="w-4 h-4" />
        Submit Project
      </button>
    </div>
  );
}
