import { getPublicInfoValue } from "./serverInformation";

export async function getMinimumSupportedVersion() {
	return (
		parseInt(await getPublicInfoValue("minimum_supported_version"), 10) || 0
	);
}

export async function getApplicationDownloadUrl() {
	return await getPublicInfoValue("application_download_url");
}

export async function getApplicationCurrentVersion() {
	return await getPublicInfoValue("application_current_version");
}
