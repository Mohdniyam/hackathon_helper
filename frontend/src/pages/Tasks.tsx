import { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Tasks() {
  const { tasks, addTask, updateTaskStatus, removeTask, resetTasks } =
    useProjectStore();
  const [taskTitle, setTaskTitle] = useState("");

  const handleAdd = () => {
    if (taskTitle.trim()) {
      addTask(taskTitle);
      setTaskTitle("");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Task Manager 🧠</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <Button onClick={handleAdd}>Add</Button>
        <Button variant="destructive" onClick={resetTasks}>
          Reset
        </Button>
      </div>

      {tasks.map((t) => (
        <Card key={t.id} className="p-4 flex justify-between items-center">
          <div>
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {t.status}
            </p>
          </div>
          <div className="flex gap-2">
            <Select onValueChange={(v) => updateTaskStatus(t.id, v as any)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeTask(t.id)}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
