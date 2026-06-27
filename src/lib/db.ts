import { createClient } from "@libsql/client";

function buildTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) throw new Error("TURSO_DATABASE_URL env var is not set");
  return createClient({ url, authToken });
}

export default buildTursoClient;
