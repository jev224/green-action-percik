import { PhotoStorage } from "@/services/storage/photo";

const photo = new PhotoStorage("organization_photo");

export async function fetchOrganizationPhotoURLs() {
	return (await photo.getRecentPhotos("")).map((p) =>
		photo.getPublicUrl(p.name),
	);
}
