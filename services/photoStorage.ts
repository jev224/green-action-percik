import { File } from "expo-file-system";

import { supabase } from "@/lib/supabase";

export const uploadPhoto = async (
  bucket: string,
  path: string,
  localUri: string,
  contentType = "image/jpeg",
) => {
  const file = new File(localUri);
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType, upsert: true });

  if (error) {
    throw error;
  }

  return path;
};

export const deletePhoto = async (bucket: string, path: string) => {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw error;
  }
};

export const getPhotoUrl = (bucket: string, path: string) =>
  supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
