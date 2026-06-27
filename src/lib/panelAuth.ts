import bcrypt from "bcryptjs";

export async function verifyPanelPassword(plaintext: string): Promise<boolean> {
  // const hash = process.env.PANEL_PASSWORD_HASH!;
  const hash = "$2b$12$EbmPJLHWIiJ6X7RlhbuAGucxzjzZ4ONDOAgUOoDeKDDPg97OZ1XxS";

  // console.log(hash?.length);
  return bcrypt.compare(plaintext, hash);
}
