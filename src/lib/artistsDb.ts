import { InArgs } from "@libsql/client";
import buildTursoClient from "./db";
import {
  ArtistRevealVariant,
  DEFAULT_ARTIST_REVEAL_VARIANT,
} from "./revealVariants";

export interface DbArtistReveal {
  id: number;
  name: string;
  role: string;
  photoUrl: string;
  badge: string;
  sortOrder: number;
  revealVariant: ArtistRevealVariant;
  createdAt: string;
  updatedAt: string;
}

function rowToDbArtistReveal(row: Record<string, unknown>): DbArtistReveal {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    role: String(row.role ?? ""),
    photoUrl: String(row.photo_url ?? ""),
    badge: String(row.badge ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
    revealVariant:
      (row.reveal_variant as ArtistRevealVariant) ??
      DEFAULT_ARTIST_REVEAL_VARIANT,
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

export async function getFeaturedArtistReveals(): Promise<DbArtistReveal[]> {
  const result = await buildTursoClient().execute(
    `SELECT * FROM artist_reveals ORDER BY sort_order ASC, created_at ASC LIMIT 4`,
  );
  return result.rows.map((row) =>
    rowToDbArtistReveal(row as Record<string, unknown>),
  );
}

export async function getAllArtistReveals(): Promise<DbArtistReveal[]> {
  const result = await buildTursoClient().execute(
    `SELECT * FROM artist_reveals ORDER BY sort_order ASC, created_at ASC`,
  );
  return result.rows.map((row) =>
    rowToDbArtistReveal(row as Record<string, unknown>),
  );
}

export async function createArtistReveal(
  data: Omit<DbArtistReveal, "id" | "createdAt" | "updatedAt">,
): Promise<DbArtistReveal> {
  const result = await buildTursoClient().execute({
    sql: `INSERT INTO artist_reveals (name, role, photo_url, badge, sort_order, reveal_variant)
          VALUES (?, ?, ?, ?, ?, ?)
          RETURNING *`,
    args: [
      data.name,
      data.role,
      data.photoUrl,
      data.badge,
      data.sortOrder,
      data.revealVariant ?? DEFAULT_ARTIST_REVEAL_VARIANT,
    ],
  });
  return rowToDbArtistReveal(result.rows[0] as Record<string, unknown>);
}

export async function updateArtistReveal(
  id: number,
  data: Partial<Omit<DbArtistReveal, "id" | "createdAt" | "updatedAt">>,
): Promise<DbArtistReveal | null> {
  const fieldToColumn: Record<string, string> = {
    name: "name",
    role: "role",
    photoUrl: "photo_url",
    badge: "badge",
    sortOrder: "sort_order",
    revealVariant: "reveal_variant",
  };

  const fieldsToUpdate = Object.keys(data).filter(
    (key) => key in fieldToColumn,
  );
  if (fieldsToUpdate.length === 0) return null;

  const setClause = fieldsToUpdate
    .map((field) => `${fieldToColumn[field]} = ?`)
    .join(", ");
  const values = fieldsToUpdate.map(
    (field) => (data as Record<string, unknown>)[field] ?? null,
  );

  const result = await buildTursoClient().execute({
    sql: `UPDATE artist_reveals
          SET ${setClause}, updated_at = datetime('now')
          WHERE id = ?
          RETURNING *`,
    args: [...values, id] as InArgs,
  });

  if (result.rows.length === 0) return null;
  return rowToDbArtistReveal(result.rows[0] as Record<string, unknown>);
}

export async function deleteArtistReveal(id: number): Promise<boolean> {
  const result = await buildTursoClient().execute({
    sql: `DELETE FROM artist_reveals WHERE id = ?`,
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}
