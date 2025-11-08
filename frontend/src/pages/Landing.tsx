import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Hackathon Helper 🚀
      </h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-md">
        Collaborate, track, and submit your hackathon project effortlessly.
      </p>
      <Link to="/dashboard">
        <Button size="lg">Go to Dashboard</Button>
      </Link>
    </div>
  );
}
