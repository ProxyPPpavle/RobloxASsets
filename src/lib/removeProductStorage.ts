import { createClient } from "@supabase/supabase-js";
import { storagePathsFromProductUrls } from "@/lib/storagePaths";

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Deletes product files from shop-assets (requires SUPABASE_SERVICE_ROLE_KEY) */
export async function removeProductStorageFiles(
  imageUrl?: string | null,
  fileUrl?: string | null,
  extraUrls: (string | null | undefined)[] = []
) {
  const paths = storagePathsFromProductUrls(imageUrl, fileUrl, extraUrls);
  if (paths.length === 0) {
    return { ok: true, paths: [], warning: "No storage paths parsed from URLs" };
  }

  const admin = createServiceClient();
  if (!admin) {
    return {
      ok: false,
      paths,
      error: "SUPABASE_SERVICE_ROLE_KEY is not set — storage files were not removed",
    };
  }

  const { data, error } = await admin.storage.from("shop-assets").remove(paths);
  if (error) {
    return { ok: false, paths, error: error.message };
  }

  return { ok: true, paths, removed: data };
}
