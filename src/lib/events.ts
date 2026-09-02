import { ParsedIcsEvent } from "@/lib/ics";
import { supabase } from "@/lib/supabase";

export async function importIcsEvents(events: ParsedIcsEvent[]) {
  const rows = events.map((event) => ({
    uid: event.uid,
    title: event.title,
    description: event.description,
    location: event.location,
    start_at: event.startAt,
    end_at: event.endAt,
    source: "ics_import",
  }));

  const { error } = await supabase
    .from("events")
    .upsert(rows, { onConflict: "uid" });

  if (error) {
    throw error;
  }
}

export async function createEvent(event: {
  uid: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: string;
  endAt: string;
}) {
  const { error } = await supabase.from("events").insert({
    uid: event.uid,
    title: event.title,
    description: event.description,
    location: event.location,
    start_at: event.startAt,
    end_at: event.endAt,
    source: "manual",
  });

  if (error) {
    throw error;
  }
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, location, start_at, end_at")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateEvent(
  id: string,
  event: {
    title: string;
    description: string | null;
    location: string | null;
    startAt: string;
    endAt: string;
  },
) {
  const { error } = await supabase
    .from("events")
    .update({
      title: event.title,
      description: event.description,
      location: event.location,
      start_at: event.startAt,
      end_at: event.endAt,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
