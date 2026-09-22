import { GraduationCap, Recycle } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
	ActionTile,
	EmptyState,
	Screen,
	ScreenHeader,
	SearchField,
	SegmentedControl,
	type SegmentedControlOption,
} from "@/components/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { useNavigation } from "@/hooks/useNavigation";
import { useShowToast } from "@/hooks/useShowToast";
import {
	fetchCompostActivities,
	fetchWasteBanks,
} from "@/services/fetcher/activity/teacherActivityManager";
import {
	type ClassData,
	useActivityManagerStore,
	type WasteBankData,
} from "@/stores/activityManager";
import { formatDate, parseClassName } from "@/utils";

type CompostCardData = {
	type: "compost-activity";
	id: number;
	title: string;
	description: string;
	completed: boolean;
	data: ClassData;
};

type WasteCardData = {
	type: "waste-bank";
	id: number;
	title: string;
	description: string;
	completed: boolean;
	data: WasteBankData;
};

type ActivityCardData = CompostCardData | WasteCardData;

type FilterStatus = "incompleted" | "completed";

const FILTER_OPTIONS: SegmentedControlOption<FilterStatus>[] = [
	{ label: "Belum Selesai", value: "incompleted" },
	{ label: "Selesai", value: "completed" },
] as const;

async function toCompostCards(): Promise<CompostCardData[]> {
	const activities = await fetchCompostActivities();

	return activities.map((classData) => ({
		type: "compost-activity",
		id: classData.id,
		title: parseClassName(classData),
		description:
			classData.compost.length !== 0 ? "Sudah selesai" : "Belum selesai",
		completed: classData.compost.length !== 0,
		data: classData,
	}));
}

async function toWasteCards(): Promise<WasteCardData[]> {
	const wasteBanks = await fetchWasteBanks();

	return wasteBanks.map((wasteData) => ({
		type: "waste-bank",
		id: wasteData.id,
		title: wasteData.student.name,
		description: `${wasteData.category} • ${formatDate(wasteData.created_at)}`,
		completed: wasteData.weight !== 0,
		data: wasteData,
	}));
}

export default function ActivityListScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("incompleted");

	const activityType = useActivityManagerStore((s) => s.activityType);
	const setSelectedClass = useActivityManagerStore((s) => s.setSelectedClass);
	const setSelectedWaste = useActivityManagerStore((s) => s.setSelectedWaste);

	const { goBack, navigateTo } = useNavigation();
	const showToast = useShowToast();

	const { data, isLoading, isError, refresh, errorMessage, isRefreshing } =
		useAsyncData<ActivityCardData[] | null>(
			async () => {
				if (activityType === "compost-activity") return toCompostCards();
				if (activityType === "waste-bank") return toWasteCards();
				return null;
			},
			undefined,
			[activityType],
		);

	const searched = useFuzzySearch(
		data ?? [],
		["title", "description"],
		searchQuery,
	);

	const results = useMemo(
		() =>
			searched.filter(({ completed }) =>
				filterStatus === "completed" ? completed : !completed,
			),
		[searched, filterStatus],
	);

	const handlePress = useCallback(
		(cardData: ActivityCardData) => {
			if (cardData.type === "compost-activity") {
				setSelectedClass(cardData.data);
				navigateTo("/activity-manager/compost-submission");
			}

			if (cardData.type === "waste-bank") {
				setSelectedWaste(cardData.data);
				navigateTo("/activity-manager/waste-verifier");
			}
		},
		[setSelectedClass, setSelectedWaste],
	);

	const renderItem = useCallback(
		({ item }: { item: ActivityCardData }) => (
			<ActionTile
				className="mb-4 shadow-none"
				icon={item.type === "compost-activity" ? GraduationCap : Recycle}
				title={item.title}
				description={item.description}
				onPress={() => handlePress(item)}
			/>
		),
		[handlePress],
	);

	useEffect(() => {
		if (!activityType) {
			showToast({ title: "Data tidak valid" });
			goBack();
		}
	}, [activityType]);

	return (
		<Screen
			isLoading={isLoading}
			isError={isError}
			onRefresh={refresh}
			isRefreshing={isRefreshing}
			errorMessage={errorMessage}
			onTryAgain={refresh}
			requiredInternet
			headerComponent={
				<>
					<ScreenHeader title="Kelola Aktivitas" />

					<SearchField
						value={searchQuery}
						onChangeText={setSearchQuery}
						className="flex-none"
					/>

					<SegmentedControl
						options={FILTER_OPTIONS}
						value={filterStatus}
						onChange={setFilterStatus}
					/>
				</>
			}
			contentComponent={
				results.length > 0 ? (
					<FlatList
						data={results}
						showsVerticalScrollIndicator={false}
						className="overflow-visible"
						renderItem={renderItem}
						keyExtractor={(data) => String(data.id)}
					/>
				) : (
					<EmptyState message="Tidak ada data." />
				)
			}
			loadingComponent={
				<ScrollView
					showsVerticalScrollIndicator={false}
					className="overflow-visible"
				>
					<VStack space="md">
						{Array.from({ length: 10 }, (_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list, never reordered or mutated
							<Skeleton key={i} className="h-32" />
						))}
					</VStack>
				</ScrollView>
			}
		/>
	);
}
