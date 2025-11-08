import type React from "react";
interface CardStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  color?: "primary" | "secondary" | "accent";
}

export default function CardStat({
  label,
  value,
  icon,
  trend,
  color = "primary",
}: CardStatProps) {
  const colorClass = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
  }[color];

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-2 ${trend > 0 ? "text-secondary" : "text-muted-foreground"}`}
            >
              {trend > 0 ? "+" : ""}
              {trend}% from last week
            </p>
          )}
        </div>
        {icon && <div className={`${colorClass} p-3 rounded-lg`}>{icon}</div>}
      </div>
    </div>
  );
}
