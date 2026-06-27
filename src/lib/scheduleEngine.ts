export const SCHEDULE_CONFIG = {
  INDUCTION_START: new Date("2026-07-17T09:00:00+05:30"),
  REFRESH_EVERY_MS: 3 * 60 * 1000,
};

export type Track = "BTECH" | "PG";

export interface ParsedEvent {
  time: string;
  endTime: string;
  event: string;
  venue: string;
  speaker: string;
  status: string;
  type: string;
}

export interface ParsedDay {
  dayLabel: string;
  dayIndex: number;
  events: ParsedEvent[];
}

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatTimeDisplay(timeStr: string): string | null {
  if (!timeStr || /^tba$/i.test(timeStr.trim())) return null;
  const asDecimal = parseFloat(timeStr);
  if (!isNaN(asDecimal) && asDecimal > 0 && asDecimal < 1) {
    const totalMinutes = Math.round(asDecimal * 24 * 60);
    const hour24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${pad(minutes)} ${ampm}`;
  }
  const match = timeStr
    .trim()
    .match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i);
  if (!match) return timeStr;
  let hour = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = (match[3] || "").toUpperCase();
  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  const displayAmpm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${pad(minutes)} ${displayAmpm}`;
}
