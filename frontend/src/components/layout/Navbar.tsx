"use client";

import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-background sticky top-0 z-10">
      <div className="flex items-center flex-1 gap-4">
        <button className="lg:hidden text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>

        {searchOpen ? (
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search tasks, ideas, team..."
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Search</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
      </div>
    </nav>
  );
}
