import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function Submission() {
  const [projectName, setProjectName] = useState("");
  const [summary, setSummary] = useState("");

  const handleSubmit = () => {
    alert(`Project submitted: ${projectName}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Project 🚀</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <Textarea
            placeholder="Project Summary..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
}
