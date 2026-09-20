import { Plus, XIcon } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { useResolveClassNames } from "uniwind";
import {
	IconButton,
	SearchField,
	SmoothSelectPortal,
	type SortFieldOption,
	SortSelect,
	type SortState,
} from "@/components/primitives";
import ErrorState from "@/components/primitives/Feedback/ErrorState";
import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	Checkbox,
	CheckboxIcon,
	CheckboxIndicator,
} from "@/components/ui/checkbox";
import { FlatList } from "@/components/ui/flat-list";
import { HStack } from "@/components/ui/hstack";
import { CheckIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Select } from "@/components/ui/select";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { StudentSortField } from "@/hooks/useStudents";
import type { fetchStudentByClass } from "@/services/fetcher/shared/student";
import { StudentListItem } from "../student/StudentListItem";
import type { StudentData } from "../student/types";

export const STUDENT_SORT_OPTIONS: SortFieldOption<StudentSortField>[] = [
	{
		field: "name",
		label: "Nama",
		ascLabel: "Nama A-Z",
		descLabel: "Nama Z-A",
	},
	{
		field: "grade",
		label: "Kelas",
		ascLabel: "Kelas A-Z",
		descLabel: "Kelas Z-A",
	},
];

interface StudentMultiSelectProps {
	onSelectionChange?: (selected: StudentData[]) => void;
	onRefresh?: () => void;
	isLoading?: boolean;
	errorMessage?: string;
	studentsRes?: Awaited<ReturnType<typeof fetchStudentByClass>> | null;
}

export function StudentMultiSelect({
	onSelectionChange,
	onRefresh,
	isLoading,
	errorMessage,
	studentsRes,
}: StudentMultiSelectProps) {
	const [isPortalOpen, setPortalOpen] = useState(false);
	const [isSelectAll, setSelectAll] = useState(false);
	const [manualSelection, setManualSelection] = useState<StudentData[]>([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [sort, setSort] = useState<SortState<StudentSortField> | null>(null);

	const unfilteredResults = useMemo(
		() =>
			(studentsRes ?? []).map((s) => ({
				id: s.id,
				user_id: s.user_id,
				name: s.name,
				photoUrl: s.photoUrl,
				grade: `Kelas ${s.class.grade}`,
				point: 0,
			})),
		[studentsRes],
	);

	const searched = useFuzzySearch(unfilteredResults, ["name"], searchQuery);

	const filtered = useMemo(() => {
		if (!sort) return searched;

		const { field, direction } = sort;

		let sorted = searched;

		switch (field) {
			case "name":
				sorted = [...searched].sort((a, b) => a.name.localeCompare(b.name));
				break;
			case "grade":
				sorted = [...searched].sort((a, b) => a.grade.localeCompare(b.grade));
				break;
		}

		return direction === "asc" ? sorted : sorted.reverse();
	}, [searched, sort]);

	const handlePressStudent = (student: StudentData) => {
		const source = isSelectAll ? unfilteredResults : manualSelection;

		const isAlreadySelected = source.some((s) => s.user_id === student.user_id);

		const next = isAlreadySelected
			? source.filter((s) => s.user_id !== student.user_id)
			: [...source, student];

		setManualSelection(next);
		setSelectAll(next.length === unfilteredResults.length);
		onSelectionChange?.(next);
	};

	const handleSelectAllChange = () => {
		if (!isSelectAll) {
			setSelectAll(true);
			onSelectionChange?.(unfilteredResults);
			return;
		}

		if (unfilteredResults.length === manualSelection.length) {
			setManualSelection([]);
			onSelectionChange?.([]);
		} else {
			onSelectionChange?.(manualSelection);
		}

		setSelectAll(false);
	};

	const selected = isSelectAll ? unfilteredResults : manualSelection;
	const selectedCount = selected.length;

	// `hasItem` used to run `.some()` over the whole `selected`
	// array for every rendered row (O(n*m) over the list). Memoize a Set of
	// selected ids instead for O(1) lookups. This also makes use of the
	// previously-unused `useMemo` import.
	const selectedIds = useMemo(
		() => new Set(selected.map((s) => s.user_id)),
		[selected],
	);
	const hasItem = (student: StudentData) => selectedIds.has(student.user_id);

	return (
		<Select onClose={() => setPortalOpen(false)}>
			<SelectedAvatarsPreview
				selected={selected}
				onPress={() => setPortalOpen(true)}
			/>

			<SmoothSelectPortal
				isOpen={isPortalOpen}
				onClose={() => setPortalOpen(false)}
				fullHeight
				scrollable={false}
			>
				<VStack className="px-2" space="lg">
					<HStack space="sm">
						<SearchField value={searchQuery} onChangeText={setSearchQuery} />
						<SortSelect
							options={STUDENT_SORT_OPTIONS}
							value={sort}
							onChange={setSort}
						/>
					</HStack>

					<HStack className="justify-between items-center px-1 -mb-2">
						<Pressable onPress={handleSelectAllChange}>
							<Checkbox
								value="select-all"
								isChecked={isSelectAll}
								pointerEvents="none"
							>
								<CheckboxIndicator className="p-2.5">
									<CheckboxIcon as={CheckIcon} />
								</CheckboxIndicator>
								<Text size="sm" className="font-medium">
									Pilih Semua
								</Text>
							</Checkbox>
						</Pressable>

						<Text size="lg" className="font-semibold">
							{selectedCount} Dipilih
						</Text>
					</HStack>

					<View>
						<View className="absolute inset-0 z-10">
							{errorMessage && !isLoading && (
								<View className="absolute inset-0">
									<ErrorState
										icon={XIcon}
										message={errorMessage}
										onRetry={onRefresh}
									/>
								</View>
							)}

							{isLoading && (
								<VStack space="md" className="mt-4">
									{Array.from({ length: 12 }).map((_, index) => (
										<HStack
											// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders have no identity or state
											key={index}
											space="lg"
											className="w-full items-center mb-2"
										>
											<Skeleton className="h-16 w-16 rounded-full" />

											<VStack space="sm">
												<SkeletonText className="h-5 w-48" />
												<SkeletonText className="h-5 w-32" />
											</VStack>
										</HStack>
									))}
								</VStack>
							)}
						</View>

						<FlatList
							data={filtered}
							style={{
								overflow: "visible",
								opacity: isLoading || errorMessage ? 0 : 255,
								zIndex: isLoading || errorMessage ? 0 : 100,
							}}
							keyExtractor={(student) => student.user_id}
							renderItem={({ item }) => (
								<StudentListItem
									student={item}
									className="mb-2"
									selected={hasItem(item)}
									onPress={handlePressStudent}
									noOffset
								/>
							)}
						/>
					</View>
				</VStack>
			</SmoothSelectPortal>
		</Select>
	);
}

interface SelectedAvatarsPreviewProps {
	selected: StudentData[];
	onPress: () => void;
}

const AVATAR_OVERLAP = 16;

function SelectedAvatarsPreview({
	selected,
	onPress,
}: SelectedAvatarsPreviewProps) {
	const [containerWidth, setContainerWidth] = useState(0);

	const avatarSize =
		parseFloat(`${useResolveClassNames("size-15").width}`) || 0;

	const handleContainerLayout = useCallback((e: LayoutChangeEvent) => {
		setContainerWidth(e.nativeEvent.layout.width);
	}, []);

	const selectedCount = selected.length;

	const isMeasured = containerWidth > 0 && avatarSize > 0;

	const maxVisible = isMeasured
		? Math.max(
				1,
				Math.floor(
					// guard the denominator so this can't hit 0/negative
					// and produce NaN/Infinity if avatarSize ever resolves
					// smaller than the overlap.
					(containerWidth - avatarSize) /
						Math.max(1, avatarSize - AVATAR_OVERLAP),
				) + 1,
			)
		: 3;

	const visibleCount = Math.min(
		selectedCount,
		selectedCount > maxVisible ? maxVisible - 1 : maxVisible,
	);

	const overflowCount = selectedCount - visibleCount;
	const visible = selected.slice(0, visibleCount);

	return (
		<Pressable onPress={onPress}>
			<HStack className="items-center justify-center gap-5 border-2 border-border border-dashed rounded-lg p-3">
				{selectedCount === 0 ? (
					<>
						<IconButton
							icon={Plus}
							className="p-4"
							variant="default"
							onPress={onPress}
						/>

						<Text size="xl" className="font-medium max-w-[70%] my-8">
							Pilih siswa yang hadir
						</Text>
					</>
				) : (
					<>
						<View className="flex-1 flex-row" onLayout={handleContainerLayout}>
							{visible.map((student) => (
								// FIX: was `key={index}` — array index is not a stable
								// identity for these items (breaks reordering/animation
								// correctness). Use the student's own id instead.
								<Avatar
									key={student.user_id}
									style={{
										marginLeft: student === visible[0] ? 0 : -AVATAR_OVERLAP,
									}}
									className="border-4 border-background size-15"
								>
									<AvatarImage src={student.photoUrl} />
									<AvatarFallbackText>{student.name}</AvatarFallbackText>
								</Avatar>
							))}

							{overflowCount > 0 && (
								<Avatar
									className="border-4 border-background size-15"
									style={{ marginLeft: -AVATAR_OVERLAP }}
								>
									<AvatarFallbackText className="font-medium text-md">
										{`+ ${overflowCount.toString()}`}
									</AvatarFallbackText>
								</Avatar>
							)}
						</View>

						{/* FIX: was hardcoded `"3 Dipilih"` — always showed 3 regardless
                of how many students were actually selected. */}
						<Text size="xl" className="font-semibold mr-2">
							{selectedCount} Dipilih
						</Text>
					</>
				)}
			</HStack>
		</Pressable>
	);
}
