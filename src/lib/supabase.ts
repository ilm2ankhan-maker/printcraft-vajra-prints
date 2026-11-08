import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummyAnonKeyForDev";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadDesignAsset(file: File | Blob, path: string): Promise<string | null> {
  // If Supabase is configured with real key
  if (supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("your-supabase-project")) {
    try {
      const { data, error } = await supabase.storage
        .from("ivory-ink-designs")
        .upload(path, file, { upsert: true });

      if (error) throw error;
      const { data: publicUrlData } = supabase.storage
        .from("ivory-ink-designs")
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.warn("Supabase upload failed, falling back to local base64/blob storage:", err);
    }
  }

  // Fallback: return data URL or object URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

