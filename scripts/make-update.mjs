import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
import mime from "mime";

const [rv, base] = process.argv.slice(2); // e.g. 1.0.0 https://my-app.pages.dev
const dist = "dist",
	pub = "public/updates";
const meta = JSON.parse(fs.readFileSync(`${dist}/metadata.json`, "utf8"));
const expoClient = JSON.parse(
	execSync("npx expo config --json --type public").toString(),
);
const h = (b, alg, enc) => crypto.createHash(alg).update(b).digest(enc);
fs.mkdirSync(`${pub}/assets`, { recursive: true });

function add(file, ext, launch) {
	const buf = fs.readFileSync(path.join(dist, file));
	const key = h(buf, "md5", "hex");
	const name = key + (ext ? "." + ext : path.extname(file));
	fs.copyFileSync(path.join(dist, file), `${pub}/assets/${name}`);
	return {
		hash: h(buf, "sha256", "base64url"),
		key,
		fileExtension: !launch && ext ? "." + ext : undefined,
		contentType: launch
			? "application/javascript"
			: mime.getType(ext) || "application/octet-stream",
		url: `${base}/updates/assets/${name}`,
	};
}

for (const platform of ["ios", "android"]) {
	const m = meta.fileMetadata[platform];
	const manifest = {
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
		runtimeVersion: rv,
		launchAsset: add(m.bundle, null, true),
		assets: m.assets.map((a) => add(a.path, a.ext)),
		metadata: {},
		extra: { expoClient },
	};
	fs.mkdirSync(`${pub}/manifests/${rv}`, { recursive: true });
	fs.writeFileSync(
		`${pub}/manifests/${rv}/${platform}.json`,
		JSON.stringify(manifest),
	);
}
