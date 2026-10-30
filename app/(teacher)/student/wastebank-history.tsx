import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BackButton } from "@/components/domain";
import {
	ActionTile,
	EmptyState,
	NativeRefreshControl,
	Screen,
	ScreenHeader,
	SearchField,
} from "@/components/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { useNavigation } from "@/hooks/useNavigation";
import { refreshOnNextNavigate } from "@/hooks/useRefreshOnNavigate";
import { useShowToast } from "@/hooks/useShowToast";
import {
	fetchWasteBanksByStudentId,
	fetchWastePhotoURL,
} from "@/services/fetcher/activity/teacherActivityManager";
import { useActivityManagerStore } from "@/stores/activityManager";
import { useStudentActionStore } from "@/stores/studentOverview";
import { formatDate, formatTime } from "@/utils";

const isWasteCompleted = (price: number | string | null | undefined) =>
	Number(price ?? 0) > 0;

const byNewest = (a: { created_at: string }, b: { created_at: string }) =>
	new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

async function toWasteCards(studentId: string) {
	const wasteBanks = await fetchWasteBanksByStudentId(studentId);

	// Newest first. Sorting here (once) keeps the fuzzy search ranking intact.
	const sorted = [...wasteBanks].sort(byNewest);

	return Promise.all(
		sorted.map(async (wasteBank) => {
			const completed = isWasteCompleted(wasteBank.price);
			const status = completed ? "Sudah diverifikasi" : "Belum diverifikasi";
			const date = formatDate(wasteBank.created_at);
			const time = formatTime(wasteBank.created_at);

			return {
				id: wasteBank.id,
				title: wasteBank.category,
				description: `${status} • ${date}  ${time}`,
				completed,
				// A failed photo lookup should only hide the image, not break the screen.
				photoUrl: wasteBank.photo
					? await fetchWastePhotoURL(wasteBank.photo).catch(() => undefined)
					: undefined,
				data: wasteBank,
			};
		}),
	);
}
type WasteCard = Awaited<ReturnType<typeof toWasteCards>>[number];

const SKELETON_PLACEHOLDERS = Array.from({ length: 10 }, (_, index) => index);
const SEARCH_KEYS = ["title", "description"];
const EMPTY: WasteCard[] = [];

export default function StudentWastebankHistory() {
	const showToast = useShowToast();
	const { goBack, navigateTo } = useNavigation();

	const [searchQuery, setSearchQuery] = useState("");

	const studentProfile = useStudentActionStore((s) => s.studentProfile);
	const setSelectedWaste = useActivityManagerStore((s) => s.setSelectedWaste);
	const setSourceSection = useActivityManagerStore((s) => s.setSourceSection);

	const { data, isLoading, isError, refresh, errorMessage, isRefreshing } =
		useAsyncData(
			async () =>
				studentProfile ? toWasteCards(studentProfile.user_id) : EMPTY,
			undefined,
			[studentProfile?.user_id],
		);

	const searchResults = useFuzzySearch(data ?? EMPTY, SEARCH_KEYS, searchQuery);

	const handleCardPress = useCallback(
		(card: WasteCard) => {
			setSelectedWaste(card.data);
			setSourceSection(card.completed ? "completed" : "incompleted");
			navigateTo("/(teacher)/activity-manager/waste-verifier");
		},
		[navigateTo, setSelectedWaste, setSourceSection],
	);

	const renderCard = useCallback(
		({ item }: { item: WasteCard }) => (
			<ActionTile
				className="mb-4 shadow-none"
				title={item.title}
				description={item.description}
				imageSource={item.photoUrl ? { uri: item.photoUrl } : undefined}
				onPress={() => handleCardPress(item)}
				thumbnailPosition="top"
				size="lg"
			/>
		),
		[handleCardPress],
	);

	useEffect(() => {
		if (!studentProfile) {
			showToast({ title: "Data tidak valid" });
			goBack();
			refreshOnNextNavigate();
		}
	}, [studentProfile, goBack, showToast]);

	// Must stay after all hooks.
	if (!studentProfile) return null;

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
						title={`Riwayat ${studentProfile.name}`}
						leftComponent={<BackButton />}
					/>
					<SearchField
						value={searchQuery}
						onChangeText={setSearchQuery}
						className="flex-none"
					/>
				</>
			}
			contentComponent={
				<FlatList
					refreshControl={
						<NativeRefreshControl
							refreshing={isRefreshing}
							onRefresh={refresh}
						/>
					}
					data={searchResults}
					showsVerticalScrollIndicator={false}
					className="-mx-6 px-6"
					renderItem={renderCard}
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
							<Skeleton key={key} className="h-64" />
						))}
					</VStack>
				</ScrollView>
			}
		/>
	);
}
