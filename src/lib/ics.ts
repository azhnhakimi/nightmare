import ICAL from "ical.js";

export type ParsedIcsEvent = {
  uid: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: string;
  endAt: string;
};

export async function fetchIcsFeed(feedUrl: string): Promise<string> {
  const response = await fetch(feedUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch ics feed: ${response.status}`);
  }

  return response.text();
}

export function parseIcsFeed(icsText: string): ParsedIcsEvent[] {
  const jcalData = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");

  return vevents.map((vevent) => {
    const event = new ICAL.Event(vevent);

    return {
      uid: event.uid,
      title: event.summary,
      description: event.description || null,
      location: event.location || null,
      startAt: event.startDate.toJSDate().toISOString(),
      endAt: event.endDate.toJSDate().toISOString(),
    };
  });
}

export async function fetchAndParseIcsFeed(
  feedUrl: string,
): Promise<ParsedIcsEvent[]> {
  const icsText = await fetchIcsFeed(feedUrl);
  return parseIcsFeed(icsText);
}
