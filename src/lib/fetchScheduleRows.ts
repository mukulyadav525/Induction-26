import {
  SCHEDULE_CONFIG,
  Track,
  ScheduleRow,
  ParsedDay,
  parseScheduleRows,
  groupRowsByDay,
} from "./scheduleEngine";

export interface FetchScheduleResult {
  days: ParsedDay[];
  rows: ScheduleRow[];
  fetchedAt: string;
  error: string | null;
}

export async function fetchScheduleRows(
  track: Track,
): Promise<FetchScheduleResult> {
  const sheetUrl =
    track === "BTECH"
      ? SCHEDULE_CONFIG.SHEET_CSV_BTECH
      : SCHEDULE_CONFIG.SHEET_CSV_PG;
  const fetchedAt = new Date().toISOString();

  try {
    const response = await fetch(sheetUrl, {
      next: { revalidate: 90 },
    });

    if (!response.ok) {
      return {
        days: [],
        rows: [],
        fetchedAt,
        error: `HTTP ${response.status}`,
      };
    }

    const csvText = await response.text();
    const rows = parseScheduleRows(csvText, track);
    const days = groupRowsByDay(rows);

    return { days, rows, fetchedAt, error: null };
  } catch (err) {
    return {
      days: [],
      rows: [],
      fetchedAt,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
