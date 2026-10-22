import { GraduationCap, PiggyBank, Recycle } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BackButton } from "@/components/domain";
import {
	ActionTile,
	EmptyState,
	ListSection,
	NativeRefreshControl,
	Screen,
	ScreenHeader,
	SearchField,
	SegmentedControl,
	type SegmentedControlOption,
	SelectField,
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
	type CompostData,
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
	data: CompostData;
};

type CompostActivityData = {
	type: "compost-activity";
	cardsData: CompostCardData[];
};

type WasteCardsData = {
	type: "waste-banks";
	id: number;
	title: string;
	description: string;
	createdAt: string;
	completed: boolean;
	data: WasteBankData;
};

type WasteActivityData = {
	type: "waste-banks";
	cardsData: WasteCardsData[];
	classes: Awaited<ReturnType<typeof fetchAllStudentClasses>>;
};

type DebtSettlementCardData = {
	type: "debt-settlement";
	id: number;
	title: string;
	description: string;
	createdAt: string;
	data: StudentData;
};

type DebtSettlementActivityData = {
	type: "debt-settlement";
	cardsData: DebtSettlementCardData[];
};

export type ActivityCardData =
	| CompostCardData
	| WasteCardsData
	| DebtSettlementCardData;

export type ActivityData =
	| CompostActivityData
	| WasteActivityData
	| DebtSettlementActivityData;

const SEARCH_KEYS = ["title", "description"];

const EMPTY: ActivityCardData[] = [];

const FILTER_OPTIONS: SegmentedControlOption<FilterSection>[] = [
	{ label: "Belum Selesai", value: "incompleted" },
	{ label: "Selesai", value: "completed" },
];

const EXCLUDED_FILTER: Set<ActivityCardData["type"] | null> = new Set([
	"debt-settlement",
]);

const CARD_ICONS: Record<ActivityCardData["type"], typeof GraduationCap> = {
	"compost-activity": GraduationCap,
	"waste-banks": Recycle,
	"debt-settlement": PiggyBank,
};

const SKELETON_PLACEHOLDERS = Array.from({ length: 10 }, (_, index) => index);

async function toCompostCards(): Promise<CompostActivityData> {
	const activities = await fetchCompostActivities();

	return {
		type: "compost-activity",
		cardsData: activities.map((classData) => ({
			type: "compost-activity",
			id: classData.id,
			title: parseClassName(classData),
			description:
				classData.compost.length !== 0 ? "Sudah selesai" : "Belum selesai",
			completed: classData.compost.length !== 0,
			data: classData,
		})),
	};
}

async function toWasteCards(): Promise<WasteActivityData> {
	const [wasteBanks, classes] = await Promise.all([
		fetchWasteBanks(),
		fetchAllStudentClasses(),
	]);

	return {
		type: "waste-banks",
		cardsData: wasteBanks.map((wasteBank) => ({
			type: "waste-banks",
			id: wasteBank.id,
			title: wasteBank.student.name,
			description: `${wasteBank.category} • ${formatDate(wasteBank.created_at)}`,
			createdAt: wasteBank.created_at,
			completed: Number(wasteBank.price ?? 0) > 0,
			data: wasteBank,
		})),
		classes,
	};
}

function wasteBankMatchesFilter(item: ActivityCardData, filter: string) {
	if (item.type !== "waste-banks" || filter === "all") {
		return true;
	}

	return String(item.data.student.class_id) === filter;
}

async function toDebtSettlementCards(): Promise<DebtSettlementActivityData> {
	const students = await fetchAllUnpaidStudentsWaste();

	return {
		type: "debt-settlement",
		cardsData: students.map((student) => ({
			type: "debt-settlement",
			id: student.id,
			title: student.name,
			description: "Belum lunas",
			createdAt: student.created_at,
			data: student,
		})),
	};
}

const createDefaultAdditionalData = () => ({
	wasteBankClassFilter: "all",
});

type AdditionalData = ReturnType<typeof createDefaultAdditionalData>;

type SetAdditionalData = <K extends keyof AdditionalData>(
	key: K,
	value: AdditionalData[K],
) => void;

export default function ActivityListScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] =
		useState<FilterSection>("incompleted");

	const [additionalData, setAdditionalDataState] = useState(
		createDefaultAdditionalData(),
	);

	const setAdditionalData: SetAdditionalData = (key, value) => {
		setAdditionalDataState((prev) => ({ ...prev, [key]: value }));
	};

	const activityType = useActivityManagerStore((s) => s.activityType);
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
		useAsyncData<ActivityData | null>(
			async () => {
				switch (activityType) {
					case "compost-activity":
						return toCompostCards();
					case "waste-banks":
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
		data?.cardsData ?? EMPTY,
		SEARCH_KEYS,
		searchQuery,
	);

	const finalResults = useMemo(() => {
		const wantsCompleted = filterStatus === "completed";

		const filtered = searchResults.filter((item) => {
			if ("completed" in item && wantsCompleted !== item.completed) {
				return false;
			}

			switch (item.type) {
				case "waste-banks":
					return wasteBankMatchesFilter(
						item,
						additionalData.wasteBankClassFilter,
					);
				default:
					return true;
			}
		});

		const sorted = filtered.sort((a, b) => {
			if ("createdAt" in a && "createdAt" in b) {
				const dateDiff =
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

				if (dateDiff !== 0) return dateDiff;
			}

			return a.title.localeCompare(b.title);
		});

		return sorted;
	}, [searchResults, filterStatus, additionalData.wasteBankClassFilter]);

	const handleCardPress = useCallback(
		(card: ActivityCardData) => {
			setSourceSection(filterStatus);
			setSearchQuery("");

			switch (card.type) {
				case "compost-activity":
					setSelectedClass(card.data);
					navigateTo("/(teacher)/activity-manager/compost-submission");
					break;
				case "waste-banks":
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
		if (!activityType) onInvalid();
	}, [activityType, goBack, showToast]);

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

					{!EXCLUDED_FILTER.has(activityType) && (
						<SegmentedControl
							options={FILTER_OPTIONS}
							value={filterStatus}
							onChange={setFilterStatus}
						/>
					)}
				</>
			}
			contentComponent={
				<>
					{data?.type === "waste-banks" && (
						<AdditionalWasteBankComponent
							data={data}
							additionalData={additionalData}
							setAdditionalData={setAdditionalData}
						/>
					)}

					<FlatList
						refreshControl={
							<NativeRefreshControl
								refreshing={isRefreshing}
								onRefresh={refresh}
							/>
						}
						data={finalResults}
						showsVerticalScrollIndicator={false}
						className="-mx-6 px-6"
						renderItem={renderCard}
						keyExtractor={(item) => `${item.type}-${item.id}`}
						ListEmptyComponent={<EmptyState message="Tidak ada data." />}
					/>
				</>
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

function AdditionalWasteBankComponent({
	data,
	additionalData,
	setAdditionalData,
}: {
	data: WasteActivityData;
	additionalData: AdditionalData;
	setAdditionalData: SetAdditionalData;
}) {
	return (
		<ListSection title="Filter berdasarkan kelas">
			<SelectField
				value={additionalData.wasteBankClassFilter}
				onValueChange={(value) =>
					setAdditionalData("wasteBankClassFilter", value)
				}
				options={[
					{
						label: "Semua",
						value: "all",
					},
					...data.classes.map((classData) => ({
						label: parseClassName(classData),
						value: classData.id.toString(),
					})),
				]}
			/>
		</ListSection>
	);
}
