import { getPublicInfoValue } from "./serverInformation";

export async function getMinimumSupportedVersion() {
	return await getPublicInfoValue("minimum_supported_version_android");
}

export async function getApplicationDownloadUrl() {
	return await getPublicInfoValue("application_download_url");
}

export async function getApplicationCurrentVersion() {
	return await getPublicInfoValue("application_current_version");
}
