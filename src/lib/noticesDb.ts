import { InArgs } from "@libsql/client";
import buildTursoClient from "./db";

export interface DbNotice {
  id: number;
  title: string;
  message: string;
  severity: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function rowToDbNotice(row: Record<string, unknown>): DbNotice {
  return {
    id: Number(row.id),
    title: String(row.title ?? ""),
    message: String(row.message ?? ""),
    severity: String(row.severity ?? "info"),
    is_active: Number(row.is_active ?? 0) === 1,
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export interface ActiveNotice {
  id: number;
  title: string;
  message: string;
  severity: string;
  sort_order: number;
  created_at: string;
}

function rowToActiveNotice(row: Record<string, unknown>): ActiveNotice {
  return {
    id: Number(row.id),
    title: String(row.title ?? ""),
    message: String(row.message ?? ""),
    severity: String(row.severity ?? "info"),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ""),
  };
}

export async function getActiveNotices(): Promise<ActiveNotice[]> {
  const result = await buildTursoClient().execute(
    `SELECT id, title, message, severity, sort_order, created_at
     FROM notices
     WHERE is_active = 1
     ORDER BY sort_order ASC, created_at DESC`,
  );
  return result.rows.map((row) =>
    rowToActiveNotice(row as Record<string, unknown>),
  );
}

export async function getAllNotices(): Promise<DbNotice[]> {
  const result = await buildTursoClient().execute(
    `SELECT * FROM notices ORDER BY sort_order ASC, created_at DESC`,
  );
  return result.rows.map((row) => rowToDbNotice(row as Record<string, unknown>));
}

export async function createNotice(
  data: Omit<DbNotice, "id" | "created_at" | "updated_at">,
): Promise<DbNotice> {
  const result = await buildTursoClient().execute({
    sql: `INSERT INTO notices (title, message, severity, is_active, sort_order)
          VALUES (?, ?, ?, ?, ?)
          RETURNING *`,
    args: [
      data.title,
      data.message,
      data.severity,
      data.is_active ? 1 : 0,
      data.sort_order,
    ],
  });
  return rowToDbNotice(result.rows[0] as Record<string, unknown>);
}

export async function updateNotice(
  id: number,
  data: Partial<Omit<DbNotice, "id" | "created_at" | "updated_at">>,
): Promise<DbNotice | null> {
  const allowedFields = ["title", "message", "severity", "is_active", "sort_order"];

  const fieldsToUpdate = Object.keys(data).filter((key) =>
    allowedFields.includes(key),
  );
  if (fieldsToUpdate.length === 0) return null;

  const setClause = fieldsToUpdate.map((field) => `${field} = ?`).join(", ");
  const values = fieldsToUpdate.map((field) => {
    const raw = (data as Record<string, unknown>)[field];
    if (field === "is_active") return raw ? 1 : 0;
    return raw ?? null;
  });

  const result = await buildTursoClient().execute({
    sql: `UPDATE notices
          SET ${setClause}, updated_at = datetime('now')
          WHERE id = ?
          RETURNING *`,
    args: [...values, id] as InArgs,
  });

  if (result.rows.length === 0) return null;
  return rowToDbNotice(result.rows[0] as Record<string, unknown>);
}

export async function deleteNotice(id: number): Promise<boolean> {
  const result = await buildTursoClient().execute({
    sql: `DELETE FROM notices WHERE id = ?`,
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}
