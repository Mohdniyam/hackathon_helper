import { Home, ListTodo, Send, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/tasks", icon: ListTodo, label: "Tasks" },
  { to: "/submission", icon: Send, label: "Submission" },
  { to: "/showcase", icon: Sparkles, label: "Showcase" },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-background p-4">
      <h2 className="font-semibold text-xl mb-6">Menu</h2>
      <nav className="space-y-2">
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to}>
            <div
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted transition ${location.pathname === to ? "bg-muted font-semibold" : ""}`}
            >
              <Icon size={18} />
              {label}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
