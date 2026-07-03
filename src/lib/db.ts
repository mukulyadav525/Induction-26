import { createClient, Client } from "@libsql/client";

let cachedClient: Client | null = null;

function buildTursoClient(): Client {
  if (cachedClient) return cachedClient;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) throw new Error("TURSO_DATABASE_URL env var is not set");
  cachedClient = createClient({ url, authToken });
  return cachedClient;
}

export default buildTursoClient;
