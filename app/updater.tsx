// On Expo SDK < 54 use: import * as FileSystem from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { useRouter } from "expo-router";
import { Check, Download, XIcon } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { Button, IconButton, Screen } from "@/components/primitives";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useShowToast } from "@/hooks/useShowToast";
import {
	getApplicationCurrentVersion,
	getApplicationDownloadUrl,
} from "@/services/fetcher/client/clientUpdater";

const APK_PATH = `${FileSystem.cacheDirectory}update.apk`;
const FLAG_GRANT_READ_URI_PERMISSION = 1;

async function installApk(fileUri: string) {
	const contentUri = await FileSystem.getContentUriAsync(fileUri);

	await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
		data: contentUri,
		flags: FLAG_GRANT_READ_URI_PERMISSION,
		type: "application/vnd.android.package-archive",
	});
}

export default function UpdaterScreen() {
	const router = useRouter();
	const showToast = useShowToast();

	const [isDownloading, setIsDownloading] = useState(false);
	const [isInterrupted, setIsInterrupted] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [progress, setProgress] = useState(0);

	const downloadRef = useRef<FileSystem.DownloadResumable | null>(null);
	const cancelledRef = useRef(false);
	const lastProgressRef = useRef(0);

	const { data, isError, isLoading, errorMessage, refresh } = useAsyncData(
		async () => ({
			downloadUrl: await getApplicationDownloadUrl(),
			version: await getApplicationCurrentVersion(),
		}),
	);

	useEffect(() => {
		if (errorMessage) showToast({ title: errorMessage });
	}, [errorMessage]);

	// Stop any running download when leaving the screen.
	useEffect(() => {
		return () => {
			cancelledRef.current = true;
			downloadRef.current?.pauseAsync().catch(() => {});
		};
	}, []);

	const install = useCallback(async () => {
		try {
			await installApk(APK_PATH);
		} catch {
			showToast({ title: "Gagal membuka installer. Coba lagi." });
		}
	}, [showToast]);

	const startDownload = useCallback(async () => {
		if (Platform.OS !== "android") {
			showToast({ title: "Pembaruan hanya tersedia untuk Android." });
			return;
		}

		if (!data?.downloadUrl) return;

		cancelledRef.current = false;
		setIsFinished(false);
		setIsInterrupted(false);
		setIsDownloading(true);

		try {
			// Continue from the partial file if there is one, otherwise start fresh.
			let resumeData: string | undefined;

			if (isInterrupted) {
				const info = await FileSystem.getInfoAsync(APK_PATH);
				if (info.exists && info.size > 0) resumeData = String(info.size);
			}

			if (!resumeData) {
				lastProgressRef.current = 0;
				setProgress(0);
				await FileSystem.deleteAsync(APK_PATH, { idempotent: true });
			}

			const task = FileSystem.createDownloadResumable(
				data.downloadUrl,
				APK_PATH,
				{},
				({ totalBytesWritten, totalBytesExpectedToWrite }) => {
					if (totalBytesExpectedToWrite <= 0) return;

					const percent = Math.floor(
						(totalBytesWritten / totalBytesExpectedToWrite) * 100,
					);

					// Only re-render when the visible number changes.
					if (percent !== lastProgressRef.current) {
						lastProgressRef.current = percent;
						setProgress(percent);
					}
				},
				resumeData,
			);
			downloadRef.current = task;

			const result = await task.downloadAsync();
			if (cancelledRef.current) return;

			// 200 = full download, 206 = resumed (partial content).
			if (!result || (result.status !== 200 && result.status !== 206)) {
				// Server rejected the request (e.g. it doesn't support ranges).
				// Discard the partial file so the next press starts fresh.
				await FileSystem.deleteAsync(APK_PATH, { idempotent: true });
				lastProgressRef.current = 0;
				setProgress(0);
				setIsDownloading(false);
				showToast({ title: "Gagal mengunduh pembaruan. Coba lagi." });
				return;
			}

			setProgress(100);
			setIsDownloading(false);
			setIsFinished(true);

			// Hand the APK to Android's package installer.
			await install();
		} catch {
			if (cancelledRef.current) return;

			// Network dropped or the request failed. Keep the partial file and
			// freeze the progress so the download can continue.
			setIsDownloading(false);
			setIsInterrupted(true);
			showToast({
				title: "Unduhan terhenti. Ketuk Lanjutkan untuk melanjutkan.",
			});
		} finally {
			downloadRef.current = null;
		}
	}, [data?.downloadUrl, install, isInterrupted, showToast]);

	const handleClose = useCallback(async () => {
		cancelledRef.current = true;
		try {
			await downloadRef.current?.pauseAsync();
		} catch {}
		if (router.canGoBack()) router.back();
	}, [router]);

	const handlePress = () => {
		if (isError) {
			refresh();
			return;
		}

		if (isFinished) {
			install();
			return;
		}

		// Starts fresh, or continues if the last attempt was interrupted.
		startDownload();
	};

	const showProgress = isDownloading || isInterrupted;

	return (
		<Screen
			requiredInternet
			contentComponent={
				<>
					<HStack className="items-center justify-between">
						<Heading size="xl">
							{isFinished
								? "Pembaruan selesai"
								: isInterrupted
									? "Unduhan terhenti"
									: isDownloading
										? "Mengunduh pembaruan"
										: "Pembaruan tersedia"}
						</Heading>

						<IconButton icon={XIcon} onPress={handleClose} />
					</HStack>

					<Center className="flex-1 gap-12">
						<Center className="w-[70%] max-w-80 aspect-square rounded-full bg-primary/10">
							<Center className="w-[82%] h-[82%] rounded-full bg-card border-8 border-primary/20">
								{isFinished ? (
									<Icon as={Check} className="w-[30%] h-[30%] text-primary" />
								) : showProgress ? (
									<Heading size="4xl">{progress}%</Heading>
								) : (
									<Icon
										as={Download}
										className="w-[28%] h-[28%] text-primary"
									/>
								)}
							</Center>
						</Center>

						<Center className="gap-2 px-6">
							{isFinished ? (
								<>
									<Heading size="xl" className="text-center">
										Siap dipasang
									</Heading>

									<Text className="text-center opacity-70">
										Pembaruan berhasil diunduh. Ketuk Pasang di jendela
										installer untuk menyelesaikan. Jika tidak muncul, ketuk
										tombol di bawah.
									</Text>
								</>
							) : isInterrupted ? (
								<>
									<Heading size="xl" className="text-center">
										Koneksi terputus
									</Heading>

									<Text className="text-center opacity-70">
										Periksa koneksi internet Anda, lalu ketuk Lanjutkan untuk
										meneruskan unduhan dari {progress}%.
									</Text>
								</>
							) : isDownloading ? (
								<>
									<Heading size="xl" className="text-center">
										Sedang mengunduh...
									</Heading>

									<Text className="text-center opacity-70">
										Jangan tutup aplikasi selama proses berlangsung.
									</Text>
								</>
							) : (
								<>
									<Heading size="xl" className="text-center">
										Versi baru tersedia
									</Heading>

									{data && (
										<Text className="text-center opacity-70">
											Nikmati fitur terbaru dan peningkatan performa dengan
											memperbarui aplikasi ke versi terbaru.
										</Text>
									)}
								</>
							)}
						</Center>
					</Center>

					<Button
						label={
							isLoading
								? "Mendapatkan info..."
								: isError
									? "Coba lagi"
									: isFinished
										? "Pasang sekarang"
										: isInterrupted
											? "Lanjutkan"
											: isDownloading
												? "Mengunduh..."
												: "Unduh sekarang"
						}
						size="cta"
						isDisabled={isLoading || isDownloading || (!isError && !data)}
						onPress={handlePress}
					/>
				</>
			}
		/>
	);
}
