import { supabase } from "@/lib/supabase";

export type CalendarEventItem = {
  id: string;
  type: "event";
  title: string;
  date: string;
  description: string | null;
  location: string | null;
  startAt: string;
  endAt: string;
};

export type CalendarTaskItem = {
  id: string;
  type: "task";
  title: string;
  date: string;
  category: string | null;
  dueDate: string;
  is_complete: boolean;
};

export type CalendarItem = CalendarEventItem | CalendarTaskItem;

export async function fetchCalendarItems(): Promise<CalendarItem[]> {
  const [eventsRes, tasksRes] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, description, location, start_at, end_at"),
    supabase
      .from("tasks")
      .select("id, title, category, due_date, is_complete")
      .not("due_date", "is", null),
  ]);

  if (eventsRes.error) throw eventsRes.error;
  if (tasksRes.error) throw tasksRes.error;

  const events: CalendarItem[] = (eventsRes.data ?? []).map((e) => ({
    id: e.id,
    type: "event",
    title: e.title,
    date: e.start_at,
    description: e.description,
    location: e.location,
    startAt: e.start_at,
    endAt: e.end_at,
  }));

  const tasks: CalendarItem[] = (tasksRes.data ?? []).map((t) => ({
    id: t.id,
    type: "task",
    title: t.title,
    date: t.due_date,
    category: t.category,
    dueDate: t.due_date,
    is_complete: t.is_complete,
  }));

  return [...events, ...tasks];
}
