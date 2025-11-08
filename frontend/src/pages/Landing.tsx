"use client";

import { useNavigate } from "react-router-dom";
import { Rocket, Users, Zap, Target } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            HackHelper
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Enter App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="mb-6 inline-block">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
            <Rocket className="w-4 h-4" />
            <span>Your hackathon companion</span>
          </div>
        </div>
        <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-4 leading-tight">
          Build, Collaborate, Submit
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            With Confidence
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Organize your team, brainstorm ideas, manage tasks, and submit your
          project—all in one place.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors mb-16"
        >
          <Zap className="w-4 h-4" />
          Get Started
        </button>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {[
            {
              icon: Users,
              title: "Team Management",
              desc: "Invite and organize your team",
            },
            {
              icon: Target,
              title: "Idea Board",
              desc: "Brainstorm and vote on ideas",
            },
            {
              icon: Zap,
              title: "Task Tracking",
              desc: "Stay on top of progress",
            },
            {
              icon: Rocket,
              title: "Submit Easily",
              desc: "Pre-flight checks & submit",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="p-4 bg-muted/50 border border-border rounded-lg hover:border-muted-foreground/30 transition-colors"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-border">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Ready to win your hackathon?
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Rocket className="w-4 h-4" />
            Launch HackHelper
          </button>
        </div>
      </section>
    </div>
  );
}
