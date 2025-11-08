import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Hackathon Countdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">21h 30m left</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tasks Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={60} />
          <p className="mt-2 text-sm text-muted-foreground">
            3 of 5 tasks completed
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Team Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>All members active ✅</p>
        </CardContent>
      </Card>
    </div>
  );
}
