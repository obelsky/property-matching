import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization s build-time fallback
let _supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!_supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Build-time fallback - vytvoř dummy client pokud env vars chybí
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn(
        "Supabase env vars not found - using fallback for build. " +
        "This is expected during 'npm run build'. " +
        "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "are set in production."
      );
      
      // Dummy client pro build - nikdy by se neměl použít za runtime
      _supabaseClient = createClient(
        "https://placeholder.supabase.co",
        "placeholder-anon-key-for-build-only"
      );
    } else {
      _supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return _supabaseClient;
}

// Export getter funkce (DOPORUČENO místo Proxy)
export function getSupabase(): SupabaseClient {
  return getSupabaseClient();
}

// Backward compatibility - Proxy pattern
// POZNÁMKA: Pokud Proxy způsobuje build issues, použijte getSupabase() místo supabase
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

// Storage helper pro upload fotek
export async function uploadPhoto(file: File): Promise<string | null> {
  try {
    const client = getSupabaseClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await client.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET || "photos")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = client.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET || "photos")
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Upload exception:", error);
    return null;
  }
}

// Helper pro upload více fotek
export async function uploadPhotos(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadPhoto(file));
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
}
