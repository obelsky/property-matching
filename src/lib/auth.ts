import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24 hodin v sekundách

// Ověří admin heslo
export function verifyAdminPassword(password: string): boolean {
  const adminKey = process.env.ADMIN_KEY || "admin123";
  return password === adminKey;
}

// Vytvoří session (uloží cookie)
export async function createSession() {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

// Zkontroluje, jestli je uživatel přihlášený
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return !!session;
}

// Odstraní session (logout)
export async function deleteSession() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}