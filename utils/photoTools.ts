import { File } from "expo-file-system";
import { Platform } from "react-native";

export async function readPhotoBytes(uri: string): Promise<ArrayBuffer> {
	if (Platform.OS === "web") {
		const response = await fetch(uri);
		if (!response.ok)
			throw new Error(`Failed to read photo (${response.status})`);
		return await response.arrayBuffer();
	}

	return await new File(uri).arrayBuffer();
}

export async function getPhotoSize(uri: string): Promise<number> {
	try {
		if (Platform.OS === "web") {
			const blob = await (await fetch(uri)).blob();
			return blob.size;
		}
		const file = new File(uri);
		return file.exists
			? (file.size ?? Number.POSITIVE_INFINITY)
			: Number.POSITIVE_INFINITY;
	} catch {
		return Number.POSITIVE_INFINITY;
	}
}
