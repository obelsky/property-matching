import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage helper pro upload fotek
export async function uploadPhoto(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET || "photos")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage
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
