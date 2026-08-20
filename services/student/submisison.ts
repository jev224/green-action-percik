import { supabase } from "@/lib/supabase";
import { uploadPhoto } from "../photoStorage";

const ACTIVITY_PHOTO_BUCKET = "activity-photos";

const wasteBankPhotoPath = (id: number, name: string) =>
  `bank_sampah/${Date.now()}${name}${id}.jpg`;

const gardenActivityPhotoPath = (id: number, name: string) =>
  `perawatan_tanaman/${Date.now()}${name}${id}.jpg`;

const compostActivityPhotoPath = (id: number, name: string) =>
  `kegiatan_tanaman/${Date.now()}${name}${id}.jpg`;

export const submitWasteBank = async (
  student_id: string,
  category: string,
  weight: number,
  photoUri: string,
  studentName: string,
) => {
  const { data, error } = await supabase
    .from("waste_banks")
    .insert({ student_id, category, weight })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  const wasteId = data.id;

  const storagePath = await uploadPhoto(
    ACTIVITY_PHOTO_BUCKET,
    wasteBankPhotoPath(wasteId, studentName),
    photoUri,
  );

  const { error: photoError } = await supabase
    .from("waste_banks")
    .update({ photo: storagePath })
    .eq("id", wasteId);

  if (photoError) {
    throw photoError;
  }
};

export const submitCompostActivity = async (
  class_id: number,
  submitted_by: string,
  photoUri: string,
  studentName: string,
) => {
  const { data, error } = await supabase
    .from("compost_activities")
    .insert({ class_id, submitted_by })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  const activityId = data.id;

  const storagePath = await uploadPhoto(
    ACTIVITY_PHOTO_BUCKET,
    compostActivityPhotoPath(activityId, studentName),
    photoUri,
  );

  const { error: photoError } = await supabase
    .from("compost_activities")
    .update({ photo: storagePath })
    .eq("id", activityId);

  if (photoError) {
    throw photoError;
  }
};
