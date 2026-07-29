import {
  fetchSubtasksByTaskId,
  fetchTaskById,
  Subtask,
  Task,
} from "@/lib/tasks";
import { useCallback, useEffect, useState } from "react";

export function useTaskDetails(id: string) {
  const [task, setTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [taskData, subtaskData] = await Promise.all([
        fetchTaskById(id),
        fetchSubtasksByTaskId(id),
      ]);
      setTask(taskData);
      setSubtasks(subtaskData);
    } catch (err) {
      console.error("Failed to fetch task details:", err);
      setError("Couldn't load this task.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { task, subtasks, setSubtasks, isLoading, error, refetch: load };
}
