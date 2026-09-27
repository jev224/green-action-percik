import * as FileSystemLegacy from "expo-file-system/legacy";
import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";
import {
	BarChart3,
	CalendarDays,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CircleCheckBig,
	Download,
	FileSpreadsheet,
	TriangleAlert,
	Trophy,
	Users,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable } from "react-native";
import { EaseView } from "react-native-ease";
import Animated, {
	Easing,
	interpolate,
	ReduceMotion,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import { BackButton } from "@/components/domain";
import {
	ActionTile,
	Button,
	ListSection,
	Screen,
	ScreenHeader,
	StatCard,
	SurfaceCard,
} from "@/components/primitives";
import {
	Calendar,
	CalendarBody,
	CalendarGrid,
	CalendarHeader,
	CalendarHeaderNextButton,
	CalendarHeaderPrevButton,
	CalendarHeaderTitle,
	CalendarWeekDaysHeader,
} from "@/components/ui/calendar";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useShowToast } from "@/hooks/useShowToast";
import { createExcelFile } from "@/lib/excel/excelFile";
import { type TaskEntry, useAsyncTaskStore } from "@/stores/asyncTask";
import { nativeOnlyProps, normalizeError } from "@/utils";

const INCLUDED_DATA = [
	{
		title: "Data Siswa",
		description: "Nama, NIS, dan kelas siswa",
		icon: Users,
	},
	{
		title: "Data Aktivitas",
		description: "Sampah, perawatan taman, dan kompos",
		icon: BarChart3,
	},
	{
		title: "Poin & Penghargaan",
		description: "Poin dan status penghargaan",
		icon: Trophy,
	},
];

// Stable id so the store can track this task across the app
const EXPORT_TASK_ID = "export-school-excel";

type DateRange = { from: Date; to?: Date };

const dateLabelFormatter = new Intl.DateTimeFormat("id-ID", {
	day: "2-digit",
	month: "long",
	year: "numeric",
});

const formatDateRangeLabel = (range: DateRange) => {
	const fromLabel = dateLabelFormatter.format(range.from);

	if (!range.to || range.to.toDateString() === range.from.toDateString()) {
		return fromLabel;
	}

	return `${fromLabel} — ${dateLabelFormatter.format(range.to)}`;
};

// Current Month date range
const now = new Date();
const from = new Date(now.getFullYear(), now.getMonth(), 1);
const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);

export default function DownloadScreen() {
	const [base64, setBase64] = useState<string | undefined>();
	const [isDownloading, setIsDownloading] = useState(false);

	const [calendarShown, setCalendarShown] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>({
		from,
		to,
	});

	const showToast = useShowToast();
	const runTask = useAsyncTaskStore((s) => s.runTask);
	const task = useAsyncTaskStore((s) => s.getTask(EXPORT_TASK_ID));

	const isRunning = task?.status === "running";
	const isSuccess = task?.status === "success";

	const fileName = `laporan-${dateRange.from.toISOString().slice(0, 10)}.xlsx`;

	const handleExport = () => {
		// Lives in the store, not component state — keeps running even
		// if this screen unmounts.
		runTask(EXPORT_TASK_ID, async (setProgress) => {
			const result = await createExcelFile(
				dateRange.from,
				dateRange.to,
				setProgress,
			);

			setBase64(result);

			setProgress(100, "Laporan Selesai");
		});
	};

	const handleDownload = async () => {
		if (!base64) return;

		setIsDownloading(true);

		try {
			if (Platform.OS === "web") {
				const byteChars = atob(base64);
				const byteNumbers = new Array(byteChars.length);
				for (let i = 0; i < byteChars.length; i++) {
					byteNumbers[i] = byteChars.charCodeAt(i);
				}
				const blob = new Blob([new Uint8Array(byteNumbers)], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				});
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
				return;
			}

			// Android / iOS — legacy API, base64 write (new API's bytes write is
			// currently broken on Android: bridge can't convert ArrayBuffer)
			const uri = FileSystemLegacy.cacheDirectory + fileName;
			await FileSystemLegacy.writeAsStringAsync(uri, base64, {
				encoding: FileSystemLegacy.EncodingType.Base64,
			});

			if (await Sharing.isAvailableAsync()) {
				await Sharing.shareAsync(uri, {
					mimeType:
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					dialogTitle: "Save Excel File",
					UTI: "com.microsoft.excel.xlsx",
				});
			}
		} catch (e) {
			const { uiMessage } = normalizeError(e, "Download Excel File");
			showToast({ title: uiMessage });
		} finally {
			setIsDownloading(false);
		}
	};

	const rangeLabel = formatDateRangeLabel(dateRange);

	const buttonLabel =
		task?.status === "running"
			? "Memproses..."
			: task?.status === "error"
				? "Coba Lagi"
				: task?.status === "success"
					? "Unduh Lagi"
					: "Unduh File Excel";

	return (
		<Screen
			scrollable
			headerComponent={
				<ScreenHeader title="Ekspor Data" leftComponent={<BackButton />} />
			}
			contentComponent={
				<>
					{/* Export Header */}
					<ActionTile
						title="Ekspor Data Sekolah"
						description="Unduh data aktivitas lingkungan dalam format Excel"
						icon={FileSpreadsheet}
						color="primary"
					/>

					<ListSection title="Pilih Periode">
						{/* Field that opens the calendar modal, like a date picker input */}
						<Pressable
							onPress={() => setCalendarShown(true)}
							disabled={isRunning}
							className="flex-row items-center justify-between rounded-2xl border border-border bg-background px-4 py-3.5"
						>
							<HStack space="sm" className="items-center">
								<Icon
									as={CalendarDays}
									size="sm"
									className="text-muted-foreground"
								/>
								<Text
									className="text-foreground font-medium flex-1 web:truncate mr-4"
									{...nativeOnlyProps({
										minimumFontScale: 0.5,
										adjustsFontSizeToFit: true,
										numberOfLines: 1,
									})}
								>
									{rangeLabel}
								</Text>
							</HStack>
							<Icon
								as={ChevronDownIcon}
								size="sm"
								className="text-muted-foreground absolute right-4"
							/>
						</Pressable>
					</ListSection>

					<ListSection title="Ekspor ke Excel">
						<ExportStatusCard task={task} />

						<ActionTile
							className="rounded-2xl p-3"
							thumbnailPosition="top"
							title="Ekspor Data Sekolah"
							description={`Unduh data aktivitas lingkungan bulan `}
							icon={FileSpreadsheet}
							color="primary"
							variant="solid"
							bottomComponent={
								<HStack space="md" className="justify-end">
									<Button
										fill
										className={`mt-2 mb-1 bg-primary-foreground
						        data-[hover=true]:bg-primary-foreground/80 data-[active=true]:bg-primary-foreground/60
								dark:data-[hover=true]:bg-primary-foreground/80 dark:data-[active=true]:bg-primary-foregroundd/50`}
										label={buttonLabel}
										icon={Download}
										variant="secondary"
										isLoading={isRunning}
										isDisabled={isDownloading}
										onPress={handleExport}
									/>

									{isSuccess && (
										<Button
											fill
											textClassName="text-background"
											iconClassName="text-background"
											className={`mt-2 mb-1 bg-foreground 
					              data-[hover=true]:bg-foreground/80 data-[active=true]:bg-foreground/60
								  dark:data-[hover=true]:bg-foreground/70 dark:data-[active=true]:bg-foreground/50`}
											label={"Download"}
											icon={Download}
											variant="ghost"
											isLoading={isDownloading}
											isDisabled={!isSuccess}
											onPress={handleDownload}
										/>
									)}
								</HStack>
							}
						/>
					</ListSection>

					{/* Included Data */}
					<ListSection title="Data yang Disertakan">
						<SurfaceCard color="neutral" variant="outline" className="p-5">
							{(styles) => (
								<VStack space="xl" className="w-full">
									{INCLUDED_DATA.map((item, index) => (
										<HStack
											// biome-ignore lint/suspicious/noArrayIndexKey: Static UI items with fixed order
											key={index}
											space="lg"
											className="w-full items-start"
										>
											<Icon
												className={styles.icon({
													className: "w-5.5 h-5.5 mt-1",
												})}
												as={item.icon}
											/>

											<VStack className="flex-1">
												<Text className="font-semibold text-foreground leading-5">
													{item.title}
												</Text>

												<Text className="text-sm text-muted-foreground leading-5 mt-0.5">
													{item.description}
												</Text>
											</VStack>
										</HStack>
									))}
								</VStack>
							)}
						</SurfaceCard>
					</ListSection>
				</>
			}
			overlayComponent={
				<Modal
					visible={calendarShown}
					transparent
					animationType="fade"
					style={{ zIndex: 10 }}
					onRequestClose={() => setCalendarShown(false)}
				>
					<Pressable
						className="absolute inset-0 items-center justify-center bg-black/50 px-8"
						onPress={() => setCalendarShown(false)}
					>
						<EaseView
							initialAnimate={{ scale: 0.9, translateY: 100 }}
							animate={{ scale: 1, translateY: 0 }}
							transition={{ type: "spring" }}
							style={{ width: "100%" }}
						>
							<Calendar
								mode="range"
								value={dateRange}
								onValueChange={setDateRange}
								className="p-6"
								locale="id-ID"
							>
								<CalendarHeader className="mb-4">
									<CalendarHeaderPrevButton className="h-12 w-12 rounded-xl">
										<Icon
											as={ChevronLeftIcon}
											size="md"
											className="h-6 w-6 text-foreground"
										/>
									</CalendarHeaderPrevButton>

									<CalendarHeaderTitle />

									<CalendarHeaderNextButton className="h-12 w-12 rounded-xl">
										<Icon
											as={ChevronRightIcon}
											size="md"
											className="h-6 w-6 text-foreground"
										/>
									</CalendarHeaderNextButton>
								</CalendarHeader>

								<CalendarWeekDaysHeader className="bg-card p-2 rounded-md" />

								<CalendarBody className="p-2">
									<CalendarGrid className="gap-y-4" />
								</CalendarBody>
							</Calendar>
						</EaseView>
					</Pressable>
				</Modal>
			}
		/>
	);
}

// ---------------------------------------------------------------------------
// Status card + supporting animated bits, kept in this file on purpose.
// Renders nothing when there's no task yet / it's idle. Only ever shows
// ONE StatCard at a time, swapped based on task.status. All animation runs
// through react-native-reanimated (UI-thread driven).
// ---------------------------------------------------------------------------

function ExportStatusCard({ task }: { task?: TaskEntry }) {
	const progress = useSharedValue(0);
	const shimmer = useSharedValue(0);

	// Tween the fill smoothly toward the latest progress value
	useEffect(() => {
		if (task?.status !== "running") {
			progress.value = 0;
			return;
		}
		progress.value = withTiming(task.progress ?? 0, {
			duration: 350,
			easing: Easing.out(Easing.cubic),
		});
	}, [task?.status, task?.progress, progress]);

	// Loop the shine sweep only while running
	useEffect(() => {
		if (task?.status !== "running") {
			shimmer.value = 0;
			return;
		}
		shimmer.value = withRepeat(
			withTiming(1, { duration: 2300 }),
			-1,
			false,
			undefined,
			ReduceMotion.Never,
		);
	}, [task?.status, shimmer]);

	const fillStyle = useAnimatedStyle(() => ({
		right: `${100 - progress.value}%`,
	}));

	const shimmerStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: interpolate(shimmer.value, [0, 1], [-200, 800]) },
		],
	}));

	if (!task || task.status === "idle") return null;

	if (task.status === "success") {
		return (
			<StatCard
				icon={CircleCheckBig}
				size="md"
				stats="Unduh Berhasil"
				title="Laporan siap diunduh"
				className="overflow-hidden"
				color="success"
			/>
		);
	}

	if (task.status === "error") {
		return (
			<StatCard
				icon={TriangleAlert}
				size="md"
				stats="Unduh Gagal"
				title={task.error ?? "Terjadi kesalahan, silakan coba lagi"}
				className="overflow-hidden"
				color="destructive"
			/>
		);
	}

	// running
	const progressPercent = Math.min(100, Math.max(0, task.progress ?? 0));

	return (
		<StatCard
			size="md"
			stats={`${progressPercent}%`}
			title={task.progressMessage ?? "Memproses laporan..."}
			className="overflow-hidden"
			color="secondary"
			innerDecoration={
				<Animated.View
					className="bg-success absolute inset-0 px-6 py-4 z-10 overflow-hidden"
					style={fillStyle}
				>
					<Heading
						className="text-lg font-bold text-success-foreground min-w-200"
						{...nativeOnlyProps({ numberOfLines: 1 })}
					>
						{task.progressMessage ?? "Memproses laporan..."}
					</Heading>

					<Heading
						className="text-3xl font-bold text-success-foreground min-w-200"
						{...nativeOnlyProps({ numberOfLines: 1 })}
					>
						{progressPercent}%
					</Heading>

					{/* Shine sweep */}
					<Animated.View
						pointerEvents="none"
						style={[
							{
								position: "absolute",
								top: 0,
								bottom: 0,
								width: 200,
								opacity: 0.25,
							},
							shimmerStyle,
						]}
					>
						<LinearGradient
							colors={[
								"transparent",
								"rgba(255,255,255,0.45)",
								"rgba(255,255,255,0.45)",
								"transparent",
							]}
							start={{ x: 0, y: 0 }}
							end={{ x: 10, y: 0 }}
							style={{ flex: 1 }}
						/>
					</Animated.View>
				</Animated.View>
			}
		/>
	);
}
