"use client";

import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  BookOpen,
  CheckSquare,
  Send,
  Presentation,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Team", icon: Users, path: "/team" },
  { label: "Ideas", icon: Lightbulb, path: "/ideas" },
  { label: "Resources", icon: BookOpen, path: "/resources" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Submission", icon: Send, path: "/submission" },
  { label: "Showcase", icon: Presentation, path: "/showcase" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
        />
      )}

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static h-screen w-64 border-r border-border bg-background transition-transform duration-300 z-40 flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            HackHelper
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Team Info */}
        <div className="px-6 py-4 border-b border-border">
          <div className="mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Team
            </p>
            <p className="text-sm font-medium mt-1">BuildCrew</p>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>
              Time Left:{" "}
              <span className="text-accent font-semibold">2d 14h 32m</span>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            + New Project
          </button>
        </div>
      </aside>
    </>
  );
}
