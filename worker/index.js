export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname === "/manifest") {
			const platform = request.headers.get("expo-platform");
			const rv = request.headers.get("expo-runtime-version");
			if (!["ios", "android"].includes(platform) || !rv)
				return new Response("Bad request", { status: 400 });

			const res = await env.ASSETS.fetch(
				new URL(`/updates/manifests/${rv}/${platform}.json`, url),
			);
			// SPA mode returns index.html (200) for missing files, so check content-type
			if (!res.ok || !res.headers.get("content-type")?.includes("json"))
				return new Response("No update", { status: 404 });

			return new Response(res.body, {
				headers: {
					"content-type": "application/expo+json",
					"expo-protocol-version": "1",
					"expo-sfv-version": "0",
					"cache-control": "private, max-age=0",
				},
			});
		}

		return env.ASSETS.fetch(request);
	},
};
