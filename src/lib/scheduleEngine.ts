export const SCHEDULE_CONFIG = {
  SHEET_CSV_BTECH:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSB_N0q2HTJoKi9yE272st8HUCTxpRjl4P0wNLvpOpaMJY_2zCVRVYHS3dT--0sP64HVf3bba-IdJy9/pub?output=csv",
  SHEET_CSV_PG:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSB_N0q2HTJoKi9yE272st8HUCTxpRjl4P0wNLvpOpaMJY_2zCVRVYHS3dT--0sP64HVf3bba-IdJy9/pub?output=csv",
  ONE_SHEET: true,
  INDUCTION_START: new Date("2026-07-17T09:00:00+05:30"),
  REFRESH_EVERY_MS: 3 * 60 * 1000,
};

export type Track = "BTECH" | "PG";

export interface ScheduleRow {
  [key: string]: string;
}

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

export function readColumn(row: ScheduleRow, ...aliases: string[]): string {
  for (const alias of aliases) {
    for (const key of Object.keys(row)) {
      if (key.trim().toLowerCase() === alias.toLowerCase()) {
        const value = row[key];
        return value == null ? "" : String(value).trim();
      }
    }
  }
  return "";
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

export function uniqueDayLabels(rows: ScheduleRow[]): string[] {
  const seen = new Set<string>();
  const days: string[] = [];
  for (const row of rows) {
    const dayLabel = readColumn(row, "Day", "day", "Date", "date");
    if (dayLabel && !seen.has(dayLabel)) {
      seen.add(dayLabel);
      days.push(dayLabel);
    }
  }
  return days;
}

const HEADER_FIRST_CELL_PATTERN = /^day$/i;

function isHeaderRow(values: string[]): boolean {
  return HEADER_FIRST_CELL_PATTERN.test(values[0]?.trim() ?? "");
}

function isEmptyRow(values: string[]): boolean {
  return values.every((v) => !v.trim());
}

function joinQuotedNewlines(rawText: string): string[] {
  const physicalLines = rawText.split(/\r?\n/);
  const logicalLines: string[] = [];
  let buffer = "";
  let openQuotes = 0;
  for (const line of physicalLines) {
    for (const ch of line) {
      if (ch === '"') openQuotes = openQuotes === 0 ? 1 : 0;
    }
    buffer = buffer ? buffer + "\n" + line : line;
    if (openQuotes === 0) {
      logicalLines.push(buffer);
      buffer = "";
    }
  }
  if (buffer) logicalLines.push(buffer);
  return logicalLines;
}

export function parseScheduleRows(
  csvText: string,
  track: Track,
): ScheduleRow[] {
  const logicalLines = joinQuotedNewlines(csvText);
  if (logicalLines.length < 2) return [];

  let currentHeaders: string[] = [];
  const dataRows: ScheduleRow[] = [];

  for (const rawLine of logicalLines) {
    if (!rawLine.trim()) continue;
    const values = parseCsvLine(rawLine);
    if (isEmptyRow(values)) continue;
    if (isHeaderRow(values)) {
      currentHeaders = values.map((h) => h.trim());
      continue;
    }
    if (currentHeaders.length === 0) continue;
    const row: ScheduleRow = {};
    currentHeaders.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? "";
    });
    dataRows.push(row);
  }

  if (!SCHEDULE_CONFIG.ONE_SHEET) return dataRows;

  return dataRows.filter((row) => {
    const rowTrack = readColumn(
      row,
      "Track",
      "TRACK",
      "TRACH",
      "track",
    ).toUpperCase();
    return !rowTrack || rowTrack === "ALL" || rowTrack === track;
  });
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function extractDayNumber(dayLabel: string): number {
  const match = dayLabel.match(/\d+/);
  return match ? parseInt(match[0], 10) - 1 : 0;
}

export function groupRowsByDay(rows: ScheduleRow[]): ParsedDay[] {
  const allDayLabels = uniqueDayLabels(rows);
  return allDayLabels.map((dayLabel) => {
    const dayIndex = extractDayNumber(dayLabel);
    const dayRows = rows.filter(
      (row) => readColumn(row, "Day", "day", "Date", "date") === dayLabel,
    );
    const events: ParsedEvent[] = dayRows
      .filter((row) => {
        const eventName = readColumn(
          row,
          "Event",
          "event",
          "Session",
          "session",
          "Title",
          "title",
          "Activity",
        ).trim();
        return eventName && eventName.toUpperCase() !== "LOADING";
      })
      .map((row) => ({
        time: readColumn(row, "Time", "time", "Start Time", "start_time"),
        endTime: readColumn(row, "End Time", "end_time", "EndTime", "End"),
        event: readColumn(
          row,
          "Event",
          "event",
          "Session",
          "session",
          "Title",
          "title",
          "Activity",
        ),
        venue: readColumn(
          row,
          "Venue",
          "venue",
          "Location",
          "location",
          "Room",
          "room",
        ),
        speaker: readColumn(row, "Speaker", "speaker"),
        status: readColumn(row, "Status", "status").toUpperCase(),
        type: readColumn(row, "Type", "type", "Category").toUpperCase(),
      }));
    return { dayLabel, dayIndex, events };
  });
}
