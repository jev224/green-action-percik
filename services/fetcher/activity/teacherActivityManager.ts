import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/database.types";
import { ServerError } from "@/services/ServerError";
import { activityPhotos } from "./studentActivitySubmission";

export type WasteBankPatch =
  Database["public"]["Tables"]["waste_banks"]["Update"];

export async function fetchCompostActivities() {
  const { error, data } = await supabase
    .from("classes")
    .select("*,  compost:compost_activities(*)");

  if (error) {
    throw new ServerError({
      status: 500,
      message: `Failed to fetch compost activity: ${error.message}`,
      ui_message: "Daftar Kegiatan kompos belum bisa dimuat. Coba lagi ya",
    });
  }

  return data ?? [];
}

export async function fetchWasteBanks() {
  const { error, data } = await supabase
    .from("waste_banks")
    .select("*, student:students(name)");

  if (error) {
    throw new ServerError({
      status: 500,
      message: `Failed to fetch waste banks activity: ${error.message}`,
      ui_message: "Daftar bank sampah belum bisa dimuat. Coba lagi ya",
    });
  }

  return data ?? [];
}

export async function updateWasteBank(id: number, patch: WasteBankPatch) {
  const { error } = await supabase
    .from("waste_banks")
    .update(patch)
    .eq("id", id);

  if (error) {
    throw new ServerError({
      status: 500,
      message: `Failed to update waste bank: ${error.message}`,
      ui_message: "Daftar bank sampah tidak bisa diperbarui. Coba lagi ya",
    });
  }
}

export async function deleteWasteBank(id: number) {
  const { error } = await supabase.from("waste_banks").delete().eq("id", id);

  if (error) {
    throw new ServerError({
      status: 500,
      message: `Failed to delete waste bank: ${error.message}`,
      ui_message: "Daftar bank sampah tidak bisa dihapus. Coba lagi ya",
    });
  }
}

export async function fetchWastePhotoURL(photo: string) {
  return await activityPhotos.getPrivateUrl(photo);
}
