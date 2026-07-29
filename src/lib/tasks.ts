import { supabase } from "./supabase";

type NewTaskInput = {
  title: string;
  category: string;
  dueDate: string;
  subtasks: DraftSubtask[];
};

export type Task = {
  id: string;
  title: string;
  category: string;
  due_date: string | null;
  is_complete: boolean;
  created_at: string;
};

export type DraftSubtask = {
  id: string;
  title: string;
};

export type Subtask = {
  id: string;
  task_id: string;
  title: string;
  is_complete: boolean;
  position: number;
};

export async function createTask({
  title,
  category,
  dueDate,
  subtasks,
}: NewTaskInput) {
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .insert({
      title,
      category,
      due_date: dueDate || null,
    })
    .select()
    .single();

  if (taskError) throw taskError;

  if (subtasks.length > 0) {
    const { error: subtaskError } = await supabase.from("subtasks").insert(
      subtasks.map((s, index) => ({
        task_id: task.id,
        title: s.title,
        position: index,
      })),
    );

    if (subtaskError) {
      await supabase.from("tasks").delete().eq("id", task.id);
      throw subtaskError;
    }
  }

  return task;
}

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateTaskCompletion(id: string, isComplete: boolean) {
  const { error } = await supabase
    .from("tasks")
    .update({ is_complete: isComplete })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchTaskById(id: string): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchSubtasksByTaskId(
  taskId: string,
): Promise<Subtask[]> {
  const { data, error } = await supabase
    .from("subtasks")
    .select("*")
    .eq("task_id", taskId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateSubtaskCompletion(id: string, isComplete: boolean) {
  const { error } = await supabase
    .from("subtasks")
    .update({ is_complete: isComplete })
    .eq("id", id);

  if (error) throw error;
}
