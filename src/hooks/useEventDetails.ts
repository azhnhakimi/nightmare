import { getEventById } from "@/lib/events";
import { useEffect, useState } from "react";

type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_at: string;
  end_at: string;
};

export function useEventDetails(id: string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    getEventById(id)
      .then(setEvent)
      .catch(() => setError("Couldn't load this event."))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { event, isLoading, error };
}
