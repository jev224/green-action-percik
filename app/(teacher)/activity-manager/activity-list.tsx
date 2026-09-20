import { GraduationCap } from "lucide-react-native";
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
} from "@/services/fetcher/teacher/activityManager";
import { useActivityManagerStore } from "@/stores/activityManager";
import { formatDate, parseProfileInfo } from "@/utils";

type ActivityCardData = {
	id: number;
	title: string; // return type of parseProfileInfo
	description: string;
	completed: boolean;
};

export default function ActivityListScreen() {
	const showToast = useShowToast();
	const [searchQuery, setSearchQuery] = useState("");
	const [type, setType] = useState("incompleted");

	const { activityType } = useActivityManagerStore();
	const { goBack } = useNavigation();

	const { data, isLoading, isError, refresh, errorMessage, isRefreshing } =
		useAsyncData<ActivityCardData[] | null>(async () => {
			if (activityType === "compost-activity") {
				return (await fetchCompostActivities()).map((classData) => ({
					id: classData.id,
					title: parseProfileInfo({ role: "student", ...classData }, true),
					description:
						classData.compost.length !== 0 ? "Sudah selesai" : "Belum selesai",
					completed: classData.compost.length !== 0,
				}));
			}

			if (activityType === "waste-bank") {
				return (await fetchWasteBanks()).map((wasteData) => ({
					id: wasteData.id,
					title: wasteData.student.name,
					description: `${wasteData.category} • ${formatDate(wasteData.created_at)}`,
					completed: wasteData.weight !== 0,
				}));
			}

			return null;
		});

	const searched = useFuzzySearch(
		data ?? [],
		["title", "description"],
		searchQuery,
	);

	const results = useMemo(() => {
		return searched.filter(({ completed }) =>
			type === "completed" ? completed : !completed,
		);
	}, [searched, type]);

	const handlePress = useCallback(
		(_id: number) => {
			// navigate to detail, using id + activityType
		},
		[activityType],
	);

	const renderItem = useCallback(
		(item: ActivityCardData) => (
			<ActionTile
				className="mb-4 shadow-none"
				icon={GraduationCap}
				title={item.title}
				description={item.description}
				onPress={() => handlePress(item.id)}
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
						options={[
							{ label: "Belum Selesai", value: "incompleted" },
							{ label: "Selesai", value: "completed" },
						]}
						value={type}
						onChange={setType}
					/>
				</>
			}
			contentComponent={
				results.length > 0 ? (
					<FlatList
						data={results}
						showsVerticalScrollIndicator={false}
						className="overflow-visible"
						renderItem={({ item }) => renderItem(item)}
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
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
					</VStack>
				</ScrollView>
			}
		/>
	);
}
