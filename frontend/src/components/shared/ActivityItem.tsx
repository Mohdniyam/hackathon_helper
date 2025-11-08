import type React from "react";
import { User, Zap, CheckCircle, Users } from "lucide-react";

interface ActivityItemProps {
  type: "task" | "comment" | "submit" | "join";
  user: string;
  action: string;
  time: string;
  icon?: React.ReactNode;
}

export default function ActivityItem({
  type,
  user,
  action,
  time,
  icon,
}: ActivityItemProps) {
  const iconMap = {
    task: <CheckCircle className="w-4 h-4 text-secondary" />,
    comment: <Zap className="w-4 h-4 text-accent" />,
    submit: <User className="w-4 h-4 text-primary" />,
    join: <Users className="w-4 h-4 text-secondary" />,
  };

  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-shrink-0 mt-1">{icon || iconMap[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-semibold">{user}</span> {action}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}
