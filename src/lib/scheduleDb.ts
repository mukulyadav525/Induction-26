import { InArgs } from "@libsql/client";
import buildTursoClient from "./db";

export interface DbEvent {
  id: number;
  track: string;
  day_label: string;
  day_index: number;
  time: string;
  end_time: string;
  event: string;
  venue: string;
  speaker: string;
  status: string | null;
  type: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function rowToDbEvent(row: Record<string, unknown>): DbEvent {
  return {
    id: Number(row.id),
    track: String(row.track ?? ""),
    day_label: String(row.day_label ?? ""),
    day_index: Number(row.day_index ?? 0),
    time: String(row.time ?? ""),
    end_time: String(row.end_time ?? ""),
    event: String(row.event ?? ""),
    venue: String(row.venue ?? ""),
    speaker: String(row.speaker ?? ""),
    status: row.status != null ? String(row.status) : null,
    type: row.type != null ? String(row.type) : null,
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

function nullifyEmpty(value: string | undefined | null): string | null {
  if (value === "" || value == null) return null;
  return value;
}

export async function getAllEvents(): Promise<DbEvent[]> {
  const result = await buildTursoClient().execute(
    `SELECT * FROM schedule_events ORDER BY day_index ASC, sort_order ASC, time ASC`,
  );
  return result.rows.map((row) => rowToDbEvent(row as Record<string, unknown>));
}

export async function getEventsByTrack(track: string): Promise<DbEvent[]> {
  const result = await buildTursoClient().execute({
    sql: `SELECT * FROM schedule_events
          WHERE track = ? OR track = 'ALL'
          ORDER BY day_index ASC, sort_order ASC, time ASC`,
    args: [track],
  });
  return result.rows.map((row) => rowToDbEvent(row as Record<string, unknown>));
}

export async function createEvent(
  data: Omit<DbEvent, "id" | "created_at" | "updated_at">,
): Promise<DbEvent> {
  const result = await buildTursoClient().execute({
    sql: `INSERT INTO schedule_events
            (track, day_label, day_index, time, end_time, event, venue, speaker, status, type, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          RETURNING *`,
    args: [
      data.track,
      data.day_label,
      data.day_index,
      data.time,
      data.end_time,
      data.event,
      data.venue,
      data.speaker,
      nullifyEmpty(data.status),
      nullifyEmpty(data.type),
      data.sort_order,
    ],
  });
  return rowToDbEvent(result.rows[0] as Record<string, unknown>);
}

export async function updateEvent(
  id: number,
  data: Partial<Omit<DbEvent, "id" | "created_at" | "updated_at">>,
): Promise<DbEvent | null> {
  const allowedFields = [
    "track",
    "day_label",
    "day_index",
    "time",
    "end_time",
    "event",
    "venue",
    "speaker",
    "status",
    "type",
    "sort_order",
  ];

  const fieldsToUpdate = Object.keys(data).filter((key) =>
    allowedFields.includes(key),
  );
  if (fieldsToUpdate.length === 0) return null;

  const setClause = fieldsToUpdate.map((field) => `${field} = ?`).join(", ");
  const values = fieldsToUpdate.map((field) => {
    const raw = (data as Record<string, unknown>)[field];
    if (field === "status" || field === "type") {
      return nullifyEmpty(raw as string | null);
    }
    return raw ?? null;
  });

  const result = await buildTursoClient().execute({
    sql: `UPDATE schedule_events
          SET ${setClause}, updated_at = datetime('now')
          WHERE id = ?
          RETURNING *`,
    args: [...values, id] as InArgs,
  });

  if (result.rows.length === 0) return null;
  return rowToDbEvent(result.rows[0] as Record<string, unknown>);
}

export async function deleteEvent(id: number): Promise<boolean> {
  const result = await buildTursoClient().execute({
    sql: `DELETE FROM schedule_events WHERE id = ?`,
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}
