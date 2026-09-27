import { GraduationCap, PiggyBank, Recycle } from "lucide-react-native";
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
	fetchAllUnpaidStudentsWaste,
	fetchCompostActivities,
	fetchWasteBanks,
} from "@/services/fetcher/activity/teacherActivityManager";
import {
	type ClassData,
	type FilterSection,
	type StudentData,
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

type DebtSettlementCardData = {
	type: "debt-settlement";
	id: number;
	title: string;
	description: string;
	completed: boolean;
	data: StudentData;
};

type ActivityCardData =
	| CompostCardData
	| WasteCardData
	| DebtSettlementCardData;

const FILTER_OPTIONS: SegmentedControlOption<FilterSection>[] = [
	{ label: "Belum Selesai", value: "incompleted" },
	{ label: "Selesai", value: "completed" },
];

const CARD_ICONS: Record<ActivityCardData["type"], typeof GraduationCap> = {
	"compost-activity": GraduationCap,
	"waste-bank": Recycle,
	"debt-settlement": PiggyBank,
};

const SKELETON_PLACEHOLDERS = Array.from({ length: 10 }, (_, index) => index);

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

	return wasteBanks.map((wasteBank) => ({
		type: "waste-bank",
		id: wasteBank.id,
		title: wasteBank.student.name,
		description: `${wasteBank.category} • ${formatDate(wasteBank.created_at)}`,
		completed: wasteBank.weight !== 0,
		data: wasteBank,
	}));
}

// NOTE: field names below (debtAmount / isSettled) are guesses — adjust to
// whatever StudentData actually exposes.
async function toDebtSettlementCards(): Promise<DebtSettlementCardData[]> {
	const students = await fetchAllUnpaidStudentsWaste();

	return students.map((student) => ({
		type: "debt-settlement",
		id: student.id,
		title: student.name,
		description: "Belum lunas",
		completed: false,
		data: student,
	}));
}

export default function ActivityListScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] =
		useState<FilterSection>("incompleted");

	const activityType = useActivityManagerStore((s) => s.activityType);
	const setSelectedClass = useActivityManagerStore((s) => s.setSelectedClass);
	const setSelectedWaste = useActivityManagerStore((s) => s.setSelectedWaste);
	const setSelectedStudent = useActivityManagerStore(
		(s) => s.setSelectedStudent,
	);
	const setSourceSection = useActivityManagerStore((s) => s.setSourceSection);

	const { goBack, navigateTo } = useNavigation();
	const showToast = useShowToast();

	const { data, isLoading, isError, refresh, errorMessage, isRefreshing } =
		useAsyncData<ActivityCardData[] | null>(
			async () => {
				switch (activityType) {
					case "compost-activity":
						return toCompostCards();
					case "waste-bank":
						return toWasteCards();
					case "debt-settlement":
						return toDebtSettlementCards();
					default:
						return null;
				}
			},
			undefined,
			[activityType],
		);

	const searchResults = useFuzzySearch(
		data ?? [],
		["title", "description"],
		searchQuery,
	);

	const filteredResults = useMemo(
		() =>
			searchResults.filter(({ completed }) =>
				filterStatus === "completed" ? completed : !completed,
			),
		[searchResults, filterStatus],
	);

	const handleCardPress = useCallback(
		(card: ActivityCardData) => {
			setSourceSection(filterStatus);

			switch (card.type) {
				case "compost-activity":
					setSelectedClass(card.data);
					navigateTo("/(teacher)/activity-manager/compost-submission");
					break;
				case "waste-bank":
					setSelectedWaste(card.data);
					navigateTo("/(teacher)/activity-manager/waste-verifier");
					break;
				case "debt-settlement":
					setSelectedStudent(card.data);
					navigateTo("/(teacher)/activity-manager/debt-settlement");
					break;
			}
		},
		[
			filterStatus,
			navigateTo,
			setSelectedClass,
			setSelectedStudent,
			setSelectedWaste,
			setSourceSection,
		],
	);

	const renderCard = useCallback(
		({ item }: { item: ActivityCardData }) => (
			<ActionTile
				className="mb-4 shadow-none"
				icon={CARD_ICONS[item.type]}
				title={item.title}
				description={item.description}
				onPress={() => handleCardPress(item)}
			/>
		),
		[handleCardPress],
	);

	useEffect(() => {
		if (!activityType) {
			showToast({ title: "Data tidak valid" });
			goBack();
		}
	}, [activityType, goBack, showToast]);

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

					{activityType !== "debt-settlement" && (
						<SegmentedControl
							options={FILTER_OPTIONS}
							value={filterStatus}
							onChange={setFilterStatus}
						/>
					)}
				</>
			}
			contentComponent={
				filteredResults.length > 0 ? (
					<FlatList
						data={filteredResults}
						showsVerticalScrollIndicator={false}
						className="overflow-visible"
						renderItem={renderCard}
						keyExtractor={(item) => String(item.id)}
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
						{SKELETON_PLACEHOLDERS.map((key) => (
							<Skeleton key={key} className="h-32" />
						))}
					</VStack>
				</ScrollView>
			}
		/>
	);
}
