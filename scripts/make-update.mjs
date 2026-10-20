import { execSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import mime from "mime";
import appConfig from "../app.json" with { type: "json" };

const OTA_DIR = "dist-ota";
const UPDATES_DIR = "public/updates";
const ASSETS_DIR = `${UPDATES_DIR}/assets`;

const runtimeVersion = process.argv[2] ?? appConfig.expo.runtimeVersion;
if (typeof runtimeVersion !== "string") {
	throw new Error(
		"Pass a runtime version or set a string runtimeVersion in app.json",
	);
}

const origin = new URL(appConfig.expo.updates.url).origin;
const manifestsDir = `${UPDATES_DIR}/manifests/${runtimeVersion}`;

const digest = (data, algorithm, encoding) =>
	crypto.createHash(algorithm).update(data).digest(encoding);

/** Copies a file from the export into the assets folder and returns its manifest entry. */
function publishAsset(file, { ext, launch = false } = {}) {
	const data = fs.readFileSync(path.join(OTA_DIR, file));
	const key = digest(data, "md5", "hex");
	const name = key + (ext ? `.${ext}` : path.extname(file));

	fs.writeFileSync(path.join(ASSETS_DIR, name), data);

	return {
		key,
		hash: digest(data, "sha256", "base64url"),
		contentType: launch
			? "application/javascript"
			: (mime.getType(ext) ?? "application/octet-stream"),
		fileExtension: launch ? undefined : `.${ext}`,
		url: `${origin}/updates/assets/${name}`,
	};
}

const { fileMetadata } = JSON.parse(
	fs.readFileSync(path.join(OTA_DIR, "metadata.json"), "utf8"),
);
const expoClient = JSON.parse(
	execSync("npx expo config --json --type public", { encoding: "utf8" }),
);

fs.mkdirSync(ASSETS_DIR, { recursive: true });
fs.mkdirSync(manifestsDir, { recursive: true });

for (const [platform, { bundle, assets }] of Object.entries(fileMetadata)) {
	const manifest = {
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
		runtimeVersion,
		launchAsset: publishAsset(bundle, { launch: true }),
		assets: assets.map(({ path: file, ext }) => publishAsset(file, { ext })),
		metadata: {},
		extra: { expoClient },
	};

	fs.writeFileSync(
		`${manifestsDir}/${platform}.json`,
		JSON.stringify(manifest),
	);
	console.log(
		`✓ ${platform}: ${assets.length + 1} files → ${manifestsDir}/${platform}.json`,
	);
}
