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
