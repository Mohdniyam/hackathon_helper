"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Video, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  completed: boolean;
  icon: typeof Circle;
}

interface SubmissionForm {
  projectName: string;
  teamName: string;
  githubLink: string;
  demoLink: string;
  videoLink: string;
  summary: string;
  techStack: string;
}

export default function Submit() {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "1",
      label: "Project name filled",
      required: true,
      completed: false,
      icon: CheckCircle2,
    },
    {
      id: "2",
      label: "GitHub repository link",
      required: true,
      completed: false,
      icon: CheckCircle2,
    },
    {
      id: "3",
      label: "Live demo URL",
      required: false,
      completed: false,
      icon: CheckCircle2,
    },
    {
      id: "4",
      label: "Demo video link",
      required: false,
      completed: false,
      icon: CheckCircle2,
    },
    {
      id: "5",
      label: "Project summary (50-200 words)",
      required: true,
      completed: false,
      icon: CheckCircle2,
    },
    {
      id: "6",
      label: "Tech stack documented",
      required: true,
      completed: false,
      icon: CheckCircle2,
    },
  ]);

  const [form, setForm] = useState<SubmissionForm>({
    projectName: "",
    teamName: "BuildCrew",
    githubLink: "",
    demoLink: "",
    videoLink: "",
    summary: "",
    techStack: "",
  });

  const handleInputChange = (field: keyof SubmissionForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    updateChecklist(field, value);
  };

  const updateChecklist = (field: string, value: string) => {
    const fieldChecklistMap: Record<string, string> = {
      projectName: "1",
      githubLink: "2",
      demoLink: "3",
      videoLink: "4",
      summary: "5",
      techStack: "6",
    };

    const checklistId = fieldChecklistMap[field];
    if (checklistId) {
      setChecklist((prev) =>
        prev.map((item) =>
          item.id === checklistId
            ? { ...item, completed: value.trim().length > 0 }
            : item
        )
      );
    }
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const requiredCount = checklist.filter((item) => item.required).length;
  const requiredCompleted = checklist.filter(
    (item) => item.required && item.completed
  ).length;

  const canSubmit =
    requiredCompleted === requiredCount && form.projectName.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      toast({
        title: "Cannot submit",
        description: "Please complete all required fields",
        id: "",
      });
      return;
    }

    toast({
      title: "Project submitted!",
      description: `${form.projectName} has been submitted successfully`,
      id: "",
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold mb-2">Submit Your Project</h1>
        <p className="text-muted-foreground">
          Complete the form and checklist below to submit your hackathon project
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  placeholder="e.g., AI Code Assistant"
                  value={form.projectName}
                  onChange={(e) =>
                    handleInputChange("projectName", e.target.value)
                  }
                  className="bg-input border-border"
                />
              </div>
              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="Your team name"
                  value={form.teamName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, teamName: e.target.value }))
                  }
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Repository Link *
              </Label>
              <Input
                id="github"
                placeholder="https://github.com/username/project"
                value={form.githubLink}
                onChange={(e) =>
                  handleInputChange("githubLink", e.target.value)
                }
                className="bg-input border-border"
              />
            </div>

            <div>
              <Label htmlFor="demo">Live Demo URL</Label>
              <Input
                id="demo"
                placeholder="https://your-demo.com"
                value={form.demoLink}
                onChange={(e) => handleInputChange("demoLink", e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <div>
              <Label htmlFor="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Demo Video Link
              </Label>
              <Input
                id="video"
                placeholder="https://youtube.com/watch?v=..."
                value={form.videoLink}
                onChange={(e) => handleInputChange("videoLink", e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <div>
              <Label htmlFor="summary">
                Project Summary *{" "}
                <span className="text-xs text-muted-foreground">
                  (50-200 words)
                </span>
              </Label>
              <Textarea
                id="summary"
                placeholder="Describe your project, what it does, and why it matters..."
                value={form.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                className="bg-input border-border min-h-24"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {form.summary.length} words
              </p>
            </div>

            <div>
              <Label htmlFor="tech-stack">Tech Stack *</Label>
              <Textarea
                id="tech-stack"
                placeholder="List technologies used (e.g., React, Node.js, MongoDB, TailwindCSS)"
                value={form.techStack}
                onChange={(e) => handleInputChange("techStack", e.target.value)}
                className="bg-input border-border min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-gradient-to-b from-primary/10 to-secondary/10 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pre-Flight Check</span>
                <span className="text-2xl font-bold text-primary">
                  {completedCount}/{checklist.length}
                </span>
              </CardTitle>
              <CardDescription>
                Complete {requiredCount - requiredCompleted} more required items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted/30 transition-colors"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={
                        item.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {item.label}
                      {item.required && <span className="text-red-500">*</span>}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full ${
                  canSubmit
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Submit Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
