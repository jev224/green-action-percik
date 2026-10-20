export async function onRequestGet({ request, env }) {
	const platform = request.headers.get("expo-platform");
	const rv = request.headers.get("expo-runtime-version");
	if (!["ios", "android"].includes(platform) || !rv)
		return new Response("Bad request", { status: 400 });

	const res = await env.ASSETS.fetch(
		new URL(`/updates/manifests/${rv}/${platform}.json`, request.url),
	);
	if (!res.ok) return new Response("No update", { status: 404 });

	return new Response(res.body, {
		headers: {
			"content-type": "application/expo+json",
			"expo-protocol-version": "1",
			"expo-sfv-version": "0",
			"cache-control": "private, max-age=0",
		},
	});
}
