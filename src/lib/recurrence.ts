import { RRule, type Options } from "rrule";

const FREQUENCY_MAP: Record<string, number> = {
  Daily: RRule.DAILY,
  Weekly: RRule.WEEKLY,
  Monthly: RRule.MONTHLY,
};

function toRRuleDate(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ),
  );
}

export type RecurrencePayload = {
  isRecurring: boolean;
  frequency: string;
  interval: number;
  endRecurrenceOption: string;
  nTimesAmount: string;
  endDate: string;
  startAt: string;
};

export function buildRRuleString(payload: RecurrencePayload): string | null {
  if (!payload.isRecurring) return null;

  const dtstart = toRRuleDate(new Date(payload.startAt));

  const options: Partial<Options> = {
    freq: FREQUENCY_MAP[payload.frequency],
    interval: payload.interval,
    dtstart,
  };

  if (payload.endRecurrenceOption === "times") {
    options.count = parseInt(payload.nTimesAmount, 10);
  } else {
    const [year, month, day] = payload.endDate.split("-").map(Number);

    options.until = toRRuleDate(new Date(year, month - 1, day, 23, 59));
  }

  return new RRule(options).toString();
}
