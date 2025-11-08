import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b bg-background">
      <h1 className="font-bold text-lg">Hackathon Helper</h1>
      <nav className="space-x-4">
        <Link to="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link to="/tasks">
          <Button variant="ghost">Tasks</Button>
        </Link>
        <Link to="/submission">
          <Button variant="ghost">Submission</Button>
        </Link>
        <Link to="/showcase">
          <Button variant="outline">Showcase</Button>
        </Link>
      </nav>
    </header>
  );
}
