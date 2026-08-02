import bcrypt from "bcryptjs";

export async function verifyPanelPassword(plaintext: string): Promise<boolean> {
  const hash = "$2b$12$fNs/hqXuYykCLu96mjt01.12EUJhmYD.WR5PuYfC29dHqMSyW8316";

  return bcrypt.compare(plaintext, hash);
}
