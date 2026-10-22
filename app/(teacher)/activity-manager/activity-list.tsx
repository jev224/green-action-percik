import { GraduationCap, PiggyBank, Recycle } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BackButton } from "@/components/domain";
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
import { refreshOnNextNavigate } from "@/hooks/useRefreshOnNavigate";
import { useShowToast } from "@/hooks/useShowToast";
import {
	fetchAllUnpaidStudentsWaste,
	fetchCompostActivities,
	fetchWasteBanks,
} from "@/services/fetcher/activity/teacherActivityManager";
import { fetchAllStudentClasses } from "@/services/fetcher/student/studentClass";
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

type WasteCardStudentsData = {
	type: "waste-bank-students";
	id: number;
	title: string;
	description: string;
	createdAt: string;
	completed: boolean;
	data: WasteBankData;
};

type WasteCardClassesData = {
	type: "waste-bank-classes";
	id: number;
	title: string;
	description: string;
	data: ClassData;
};

type DebtSettlementCardData = {
	type: "debt-settlement";
	id: number;
	title: string;
	description: string;
	createdAt: string;
	completed: boolean;
	data: StudentData;
};

type ActivityCardData =
	| CompostCardData
	| WasteCardStudentsData
	| WasteCardClassesData
	| DebtSettlementCardData;

const FILTER_OPTIONS: SegmentedControlOption<FilterSection>[] = [
	{ label: "Belum Selesai", value: "incompleted" },
	{ label: "Selesai", value: "completed" },
];

const EXCLUDED_FILTER: Set<ActivityCardData["type"] | string> = new Set([
	"waste-bank-classes",
	"debt-settlement",
]);

const CARD_ICONS: Record<ActivityCardData["type"], typeof GraduationCap> = {
	"compost-activity": GraduationCap,
	"waste-bank-students": Recycle,
	"waste-bank-classes": GraduationCap,
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

async function toWasteStudentsCards(
	classId: number | null | undefined,
	onInvalid: () => void,
): Promise<WasteCardStudentsData[]> {
	if (!classId) {
		onInvalid();
		throw new Error("Invalid class");
	}

	const wasteBanksStudents = await fetchWasteBanks(classId);

	return wasteBanksStudents.map((wasteBank) => ({
		type: "waste-bank-students",
		id: wasteBank.id,
		title: wasteBank.student.name,
		description: `${wasteBank.category} • ${formatDate(wasteBank.created_at)}`,
		createdAt: wasteBank.created_at,
		completed: Number(wasteBank.weight ?? 0) > 0,
		data: wasteBank,
	}));
}

async function toWasteClassessCards(): Promise<WasteCardClassesData[]> {
	const wasteBanksClasses = await fetchAllStudentClasses();

	return wasteBanksClasses.map((classData) => ({
		type: "waste-bank-classes",
		id: classData.id,
		title: parseClassName(classData),
		description: "",
		data: classData,
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
		createdAt: student.created_at,
		completed: false,
		data: student,
	}));
}

export default function ActivityListScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] =
		useState<FilterSection>("incompleted");

	const activityType = useActivityManagerStore((s) => s.activityType);
	const selectedClass = useActivityManagerStore((s) => s.selectedClass);
	const setActivityType = useActivityManagerStore((s) => s.setActivityType);
	const setSelectedClass = useActivityManagerStore((s) => s.setSelectedClass);
	const setSelectedWaste = useActivityManagerStore((s) => s.setSelectedWaste);
	const setSelectedStudent = useActivityManagerStore(
		(s) => s.setSelectedStudent,
	);
	const setSourceSection = useActivityManagerStore((s) => s.setSourceSection);

	const { goBack, navigateTo } = useNavigation();
	const showToast = useShowToast();

	const onInvalid = () => {
		showToast({ title: "Data tidak valid" });
		goBack();
		refreshOnNextNavigate();
	};

	const { data, isLoading, isError, refresh, errorMessage, isRefreshing } =
		useAsyncData<ActivityCardData[] | null>(
			async () => {
				switch (activityType) {
					case "compost-activity":
						return toCompostCards();
					case "waste-bank-students":
						return toWasteStudentsCards(selectedClass?.id, onInvalid);
					case "waste-bank-classes":
						return toWasteClassessCards();
					case "debt-settlement":
						return toDebtSettlementCards();
					default:
						return null;
				}
			},
			undefined,
			[activityType, selectedClass?.id],
		);

	const searchResults = useFuzzySearch(
		data ?? [],
		["title", "description"],
		searchQuery,
	);

	const finalResults = useMemo(() => {
		const filtered = searchResults.filter((data) =>
			"completed" in data
				? filterStatus === "completed"
					? data.completed
					: !data.completed
				: true,
		);

		const sorted = filtered.sort((a, b) => {
			if ("createdAt" in a && "createdAt" in b) {
				const dateDiff =
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

				if (dateDiff !== 0) return dateDiff;
			}

			return a.title.localeCompare(b.title);
		});

		return sorted;
	}, [searchResults, filterStatus, selectedClass?.id]);

	const handleCardPress = useCallback(
		(card: ActivityCardData) => {
			setSourceSection(filterStatus);
			setSearchQuery("");

			switch (card.type) {
				case "compost-activity":
					setSelectedClass(card.data);
					navigateTo("/(teacher)/activity-manager/compost-submission");
					break;
				case "waste-bank-students":
					setSelectedWaste(card.data);
					navigateTo("/(teacher)/activity-manager/waste-verifier");
					break;
				case "waste-bank-classes":
					setSelectedClass(card.data);
					setActivityType("waste-bank-students");
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
			setActivityType,
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
		if (!activityType) onInvalid();
	}, [activityType, goBack, showToast, selectedClass?.id]);

	return (
		<Screen
			isLoading={isLoading}
			isError={isError}
			errorMessage={errorMessage}
			onTryAgain={refresh}
			requiredInternet
			headerComponent={
				<>
					<ScreenHeader
						title="Kelola Aktivitas"
						leftComponent={<BackButton />}
					/>

					<SearchField
						value={searchQuery}
						onChangeText={setSearchQuery}
						className="flex-none"
					/>

					{!EXCLUDED_FILTER.has(activityType || "") && (
						<SegmentedControl
							options={FILTER_OPTIONS}
							value={filterStatus}
							onChange={setFilterStatus}
						/>
					)}
				</>
			}
			contentComponent={
				<FlatList
					refreshControl={
						<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
					}
					data={finalResults}
					showsVerticalScrollIndicator={false}
					className="overflow-visible"
					renderItem={renderCard}
					keyExtractor={(item) => `${item.type}-${item.id}`}
					ListEmptyComponent={<EmptyState message="Tidak ada data." />}
				/>
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
