"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Github, Award } from "lucide-react";

export default function Showcase() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const showcaseProjects = JSON.parse(
      localStorage.getItem("submittedProjects") || "[]"
    );
    setProjects(showcaseProjects);
  }, []);

  if (projects.length === 0) {
    return (
      <div className="p-6 space-y-8 text-center text-muted-foreground">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Project Showcase
        </h1>
        <p>No project submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Project Showcase
        </h1>
        <p className="text-muted-foreground">
          Your hackathon project presentations
        </p>
      </div>

      {projects.map((project) => (
        <div
          key={project.id}
          className="max-w-2xl mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg overflow-hidden"
        >
          <div className="h-48 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <div className="text-center">
              <Award className="w-12 h-12 text-primary-foreground mx-auto mb-2 opacity-80" />
              <p className="text-primary-foreground/80 font-medium">
                {project.projectName
                  ? "Project Submitted"
                  : "Awaiting Submission"}
              </p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {project.projectName || "Untitled Project"}
              </h2>
              <p className="text-muted-foreground">{project.summary}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-background border border-border rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {(project.techStack?.split(",") || []).map((tech: string) => (
                    <span
                      key={tech.trim()}
                      className="px-2 py-1 bg-primary/20 text-primary text-xs rounded"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-background border border-border rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Team
                </p>
                <div className="flex gap-2">
                  {(project.team?.split(",") || []).map((member: string) => (
                    <div
                      key={member.trim()}
                      className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-xs font-medium text-primary-foreground"
                    >
                      {member.trim()[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Links</h3>
              <div className="space-y-2">
                {project.gitHub && (
                  <a
                    href={project.gitHub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Repository</span>
                    <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                    <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
