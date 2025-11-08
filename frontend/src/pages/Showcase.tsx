import { ExternalLink, Github, Award } from "lucide-react";

export default function Showcase() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Project Showcase
        </h1>
        <p className="text-muted-foreground">
          Your hackathon project presentation
        </p>
      </div>

      {/* Project Card */}
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg overflow-hidden">
        {/* Hero */}
        <div className="h-48 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
          <div className="text-center">
            <Award className="w-12 h-12 text-primary-foreground mx-auto mb-2 opacity-80" />
            <p className="text-primary-foreground/80 font-medium">
              Awaiting Submission
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              AI Code Assistant
            </h2>
            <p className="text-muted-foreground">
              A voice-to-code generator that uses AI to convert your ideas into
              functional code snippets.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-background border border-border rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {["React", "Node.js", "OpenAI", "Tailwind"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-primary/20 text-primary text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-background border border-border rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Team
              </p>
              <div className="flex gap-2">
                {["You", "Alex", "Jordan"].map((member) => (
                  <div
                    key={member}
                    className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-xs font-medium text-primary-foreground"
                  >
                    {member[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Links</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Judging Info */}
      <div className="max-w-2xl mx-auto bg-muted/30 border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-3">After Submission</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Judges will review and score your project</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Your scores and feedback will appear here</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Share your showcase with your network</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
