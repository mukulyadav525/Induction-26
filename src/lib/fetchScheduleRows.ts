import { Track, ParsedEvent, ParsedDay } from "./scheduleEngine";
import { getEventsByTrack, DbEvent } from "./scheduleDb";

export interface FetchScheduleResult {
  days: ParsedDay[];
  fetchedAt: string;
  error: string | null;
}

function dbEventsToParsedDays(dbEvents: DbEvent[]): ParsedDay[] {
  const dayMap = new Map<
    string,
    { dayLabel: string; dayIndex: number; events: ParsedEvent[] }
  >();

  for (const ev of dbEvents) {
    if (!dayMap.has(ev.day_label)) {
      dayMap.set(ev.day_label, {
        dayLabel: ev.day_label,
        dayIndex: ev.day_index,
        events: [],
      });
    }
    dayMap.get(ev.day_label)!.events.push({
      time: ev.time,
      endTime: ev.end_time,
      event: ev.event,
      venue: ev.venue,
      speaker: ev.speaker,
      status: ev.status ?? "",
      type: ev.type ?? "",
    });
  }

  return Array.from(dayMap.values()).sort((a, b) => a.dayIndex - b.dayIndex);
}

export async function fetchScheduleRows(
  track: Track,
): Promise<FetchScheduleResult> {
  const fetchedAt = new Date().toISOString();

  try {
    const dbEvents = await getEventsByTrack(track);
    return {
      days: dbEventsToParsedDays(dbEvents),
      fetchedAt,
      error: null,
    };
  } catch (dbError) {
    console.error("[fetchScheduleRows] DB fetch failed:", dbError);
    return {
      days: [],
      fetchedAt,
      error: dbError instanceof Error ? dbError.message : "Database error",
    };
  }
}
