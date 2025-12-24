import { supabase } from "./supabase";

/**
 * Generuje bezpečný random token pro veřejný přístup
 */
export function generatePublicToken(): string {
  // Používá crypto.randomUUID() pro bezpečný token
  // Formát:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  return crypto.randomUUID();
}

/**
 * Ověří token pro nabídku
 */
export async function verifyListingToken(
  id: string,
  token: string
): Promise<boolean> {
  const { data } = await supabase
    .from("listings")
    .select("public_token")
    .eq("id", id)
    .eq("public_token", token)
    .single();

  return !!data;
}

/**
 * Ověří token pro poptávku
 */
export async function verifyRequestToken(
  id: string,
  token: string
): Promise<boolean> {
  const { data } = await supabase
    .from("requests")
    .select("public_token")
    .eq("id", id)
    .eq("public_token", token)
    .single();

  return !!data;
}
