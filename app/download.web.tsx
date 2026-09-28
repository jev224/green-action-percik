import { useEffect, useState } from "react";

function isStandalone() {
	if (typeof window === "undefined") return false;
	if ("standalone" in window.navigator && window.navigator.standalone === true)
		return true; // iOS
	if (window.matchMedia("(display-mode: standalone)").matches) return true; // Android/Chrome
	return false;
}

export default function DownloadScreen() {
	const [showIframe, setShowIframe] = useState(false);

	useEffect(() => {
		if (isStandalone()) {
			window.location.replace("/");
		} else {
			setShowIframe(true);
		}
	}, []);

	if (!showIframe) return null;

	return (
		<iframe
			title="Download"
			src="./download-website/index.html"
			style={{
				width: "100vw",
				height: "100vh",
				border: "none",
				display: "block",
			}}
		/>
	);
}
