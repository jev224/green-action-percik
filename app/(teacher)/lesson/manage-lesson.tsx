import { Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
	type Control,
	Controller,
	useFieldArray,
	useForm,
	useWatch,
} from "react-hook-form";
import Animated from "react-native-reanimated";
import Sortable, { type OrderChangeParams } from "react-native-sortables";
import { contentLayoutTransition } from "@/components/animation/presets";
import { BackButton } from "@/components/domain";
import {
	BottomPanel,
	Button,
	Drawer,
	IconButton,
	ListSection,
	Modal,
	PhotoPicker,
	Screen,
	ScreenHeader,
	SortableCard,
	Spacer,
	TextAreaField,
	TextField,
} from "@/components/primitives";
import { HStack } from "@/components/ui/hstack";
import { CloseIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { useShowToast } from "@/hooks/useShowToast";
import { useUserProfile } from "@/hooks/useUser";
import type { LessonContent } from "@/lib/supabase/database.types";
import {
	createLesson,
	fetchLesson,
	getChangedLessonFields,
	type LessonFields,
	type LessonForm,
	updateLesson,
} from "@/services/fetcher/lesson/lessonManager";
import { ServerError } from "@/services/ServerError";
import { useLessonStore } from "@/stores/lesson";

// Date.now() alone can collide if two blocks are added in the same
// millisecond (e.g. double-tap); pad with a random suffix.
const createEmptyBlock = (index: number): LessonContent => ({
	id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
	title: `Konten Baru #${index}`,
	explanation: "",
});

export default function EditLessonScreen() {
	const { profile, isLoading } = useUserProfile();

	const { useBackGuard, bypassGuard, goBack } = useNavigation();
	const showToast = useShowToast();

	const [showUnsavedModal, setShowUnsavedModal] = useState(false);

	// ─────────────────────────────────────────────────────────────
	// MODE — this screen doubles as both "create lesson" and "edit
	// lesson"; almost everything below branches on `isEdit`.
	// ─────────────────────────────────────────────────────────────
	const lesson = useLessonStore((state) => state.lesson);
	const isEdit = lesson.mode === "edit";

	// ─────────────────────────────────────────────────────────────
	// FORM STATE — title/description/photoUri/contents all live in
	// one RHF form. `defaultValues` is just the empty-shell starting
	// point; real data (edit mode) is loaded in via `reset()` below.
	// ─────────────────────────────────────────────────────────────
	const { formState, control, watch, reset, handleSubmit } =
		useForm<LessonForm>({
			defaultValues: {
				title: "",
				description: "",
				contents: [],
				photoUri: undefined,
			},
		});

	// `contents` is a dynamic array (add/remove/reorder), so it gets
	// its own field-array binding instead of a plain Controller.
	// keyName is renamed to "fieldId" so RHF's internal tracking key
	// doesn't clobber LessonContent's own `id`.
	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: "contents",
		keyName: "fieldId",
	});

	// ─────────────────────────────────────────────────────────────
	// CONTENT BLOCK EDITING/DELETING — which block (if any) is open
	// in the drawer / pending delete confirmation. Stored as an id,
	// not an index, so it stays valid across reorders/deletes; the
	// actual index is derived fresh every render.
	// ─────────────────────────────────────────────────────────────
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const editingIndex = fields.findIndex((f) => f.id === editingId);

	const deletingIndex = fields.findIndex((f) => f.id === deletingId);
	const deletingBlock = deletingIndex !== -1 ? fields[deletingIndex] : null;

	const clearEditingId = () => setEditingId(null);
	const clearDeletingId = () => setDeletingId(null);

	const addContentBlock = () => {
		const block = createEmptyBlock(fields.length + 1);
		append(block);
		setEditingId(block.id); // open the new block for editing immediately
	};

	const deleteContentBlock = () => {
		if (!deletingId) return;
		remove(deletingIndex);

		// If the block being deleted is also open in the editor drawer,
		// close the drawer too — otherwise it'd be editing a block that
		// no longer exists.
		if (editingId === deletingId) {
			clearEditingId();
		}
		clearDeletingId();
	};

	// `indexToKey[newIndex] = id` — already in the correct new order,
	// so we just resolve each id back to its field and hand the whole
	// array to `replace()`. (Do NOT use `keyToIndex` for this — its
	// values are new positions, but reading it via `Object.values()`
	// preserves *old* key order, which produces a wrongly-ordered
	// array. `indexToKey` avoids that inversion entirely.)
	const reorderContents = ({ indexToKey }: OrderChangeParams) => {
		const fieldsById = new Map(fields.map((f) => [f.id, f]));

		const reordered = indexToKey
			.map((id) => fieldsById.get(id))
			.filter((content) => content !== undefined);

		replace(reordered);
	};

	// ─────────────────────────────────────────────────────────────
	// DATA FETCH + HYDRATION (edit mode only) — fetch the existing
	// lesson, then seed the form with it exactly once. `hasHydratedRef`
	// guards against re-seeding (and wiping user edits) if the fetch
	// result reference ever changes after the first successful load.
	// ─────────────────────────────────────────────────────────────
	const hasHydratedRef = useRef(false);

	const {
		data: fetchedLesson,
		isLoading: isLoadingLesson,
		isError: isLessonError,
		errorMessage,
	} = useAsyncData(
		async () => {
			if (isEdit) {
				return await fetchLesson(lesson.id);
			}
		},
		undefined,
		[isEdit, isEdit ? lesson.id : null],
	); // re-fetch if editing a different lesson

	useEffect(() => {
		if (isLessonError) {
			showToast({ title: errorMessage });
			goBackToHome();
			return;
		}

		if (!fetchedLesson || hasHydratedRef.current) return;

		reset({
			title: fetchedLesson.title,
			description: fetchedLesson.description,
			contents: fetchedLesson.contents,
			photoUri: fetchedLesson.photoUrl,
		});

		hasHydratedRef.current = true;
	}, [fetchedLesson, isLessonError, errorMessage, reset]);

	// ─────────────────────────────────────────────────────────────
	// DERIVED FORM STATUS
	// ─────────────────────────────────────────────────────────────
	const title = watch("title");
	const description = watch("description");

	const isSaveDisabled =
		!title ||
		!description ||
		fields.length === 0 ||
		formState.isSubmitting ||
		(isEdit && (isLoadingLesson || isLessonError || isLoading));

	// RHF tracks dirtiness against the last `reset()` baseline, so this
	// is true in create mode as soon as anything is typed, and in edit
	// mode only once something differs from what was loaded.
	const hasUnsavedChanges = formState.isDirty;

	// ─────────────────────────────────────────────────────────────
	// BACK NAVIGATION — intercepts hardware back / edge-swipe / header
	// back button when there are unsaved changes, and shows a confirm
	// modal. `proceed` resumes the exact action that was blocked.
	// ─────────────────────────────────────────────────────────────
	const proceedRef = useRef<(() => void) | null>(null);

	useBackGuard(hasUnsavedChanges, (proceed) => {
		proceedRef.current = proceed;
		setShowUnsavedModal(true);
	});

	const onDiscard = () => {
		setShowUnsavedModal(false);
		showToast({ title: "Perubahan tidak disampan" });

		const proceed = proceedRef.current;
		proceedRef.current = null;

		if (proceed) proceed();
		else goBackToHome();
	};

	// For navigation we trigger ourselves (successful submit, in-content
	// back button) rather than an intercepted system gesture — skips the
	// guard since we already know it's safe to leave.
	const goBackToHome = () =>
		bypassGuard(() => goBack("/(teacher)/(tabs)/home"));

	const onGoBack = () => {
		if (hasUnsavedChanges) {
			setShowUnsavedModal(true);
			return;
		}
		goBackToHome();
	};

	// ─────────────────────────────────────────────────────────────
	// SUBMIT — create or update, diffing against the loaded baseline
	// in edit mode so only changed fields are sent.
	// ─────────────────────────────────────────────────────────────
	const onSubmit = async (data: LessonForm) => {
		if (!profile) {
			return;
		}

		// Nothing changes just go back to home
		if (!hasUnsavedChanges) {
			goBackToHome();
			return;
		}

		try {
			if (isEdit) {
				const original = formState.defaultValues as LessonFields;
				const changedFields = formState.defaultValues
					? getChangedLessonFields(original, data)
					: data;

				await updateLesson(lesson.id, fetchedLesson?.photo, changedFields);

				showToast({ title: "Materi berhasil diedit" });
			} else {
				await createLesson(profile.name, data);
				showToast({ title: "Materi berhasil dibuat" });
			}

			goBackToHome();
		} catch (error) {
			if (error instanceof ServerError) {
				showToast({ title: error.ui_message });
			} else {
				showToast({ title: "Terjadi kesalahan, coba lagi" });
			}

			console.error(error);
		}
	};

	return (
		<Stack.Screen options={{ gestureEnabled: !hasUnsavedChanges }}>
			<Screen
				scrollable
				isLoading={isLoadingLesson || isLoading}
				headerComponent={
					<ScreenHeader
						title={isEdit ? "Edit Materi" : "Buat Materi"}
						leftComponent={<BackButton onPress={onGoBack} />}
					/>
				}
				contentComponent={
					<>
						<ListSection title="Judul" space="sm" size="md">
							<Controller
								control={control}
								name="title"
								render={({ field }) => (
									<TextField
										placeholder="Pengertian Sampah"
										value={field.value}
										onChangeText={field.onChange}
									/>
								)}
							/>
						</ListSection>

						<ListSection title="Deskripsi" space="sm" size="md">
							<Controller
								control={control}
								name="description"
								render={({ field }) => (
									<TextAreaField
										placeholder="Deskripsi untuk materi ini..."
										value={field.value}
										onChangeText={field.onChange}
									/>
								)}
							/>
						</ListSection>

						<ListSection title="Gambar sampul" space="sm" size="md">
							<Controller
								control={control}
								name="photoUri"
								render={({ field }) => (
									<PhotoPicker value={field.value} onChange={field.onChange} />
								)}
							/>
						</ListSection>

						<ListSection title="Konten" space="sm" size="md">
							<Sortable.Grid
								columns={1}
								rowGap={10}
								columnGap={10}
								activationAnimationDuration={140}
								dropAnimationDuration={200}
								hapticsEnabled
								onOrderChange={reorderContents}
								data={fields}
								keyExtractor={(item) => item.id}
								renderItem={({ item: { id, title, explanation } }) => (
									<SortableCard
										title={title}
										description={explanation || "Tidak ada penjelasan."}
										onPress={() => setEditingId(id)}
										onDelete={() => setDeletingId(id)}
									/>
								)}
							/>

							<Animated.View layout={contentLayoutTransition}>
								<Button
									label="Tambahan Konten"
									variant="outline"
									icon={Plus}
									onPress={addContentBlock}
								/>
							</Animated.View>
						</ListSection>

						<Spacer height={108} />
					</>
				}
				overlayComponent={
					<>
						<BottomPanel>
							<HStack space="md">
								<Button
									label="Simpan"
									fill
									size="cta"
									onPress={handleSubmit(onSubmit)}
									isDisabled={isSaveDisabled}
									isLoading={formState.isSubmitting}
								/>
							</HStack>
						</BottomPanel>

						<ContentEditorDrawer
							isOpen={!!editingId}
							onClose={clearEditingId}
							onSave={clearEditingId}
							control={control}
							editingIndex={editingIndex}
						/>

						<DeletingModal
							content={deletingBlock}
							isOpen={!!deletingId}
							onCancel={clearDeletingId}
							onContinue={deleteContentBlock}
						/>

						<UnsavedChangesModal
							isOpen={showUnsavedModal}
							onCancel={() => setShowUnsavedModal(false)}
							onContinue={onDiscard}
						/>
					</>
				}
			/>
		</Stack.Screen>
	);
}

// ───────────────────────────────────────────────────────────────
// Sub-components below are presentational only — all state and
// logic stays in the screen; these just receive props and render.
// ───────────────────────────────────────────────────────────────

const ContentEditorDrawer = ({
	isOpen,
	onClose,
	onSave,
	control,
	editingIndex,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSave: () => void;
	control: Control<LessonForm>;
	editingIndex: number;
}) => {
	const title = useWatch({ control, name: `contents.${editingIndex}.title` });

	return (
		<Drawer
			avoidKeyboard
			isOpen={isOpen}
			size="lg"
			anchor="bottom"
			onClose={onClose}
			headerComponenent={
				<ScreenHeader
					title="Edit Konten"
					rightComponent={<IconButton icon={CloseIcon} onPress={onClose} />}
				/>
			}
			contentComponent={
				<VStack space="lg">
					<ListSection title="Judul" size="md">
						<Controller
							control={control}
							name={`contents.${editingIndex}.title`}
							render={({ field }) => (
								<TextField
									placeholder="Pengertian Sampah"
									value={field.value}
									onChangeText={field.onChange}
								/>
							)}
						/>
					</ListSection>

					<ListSection title="Penjelasan" size="md">
						<Controller
							control={control}
							name={`contents.${editingIndex}.explanation`}
							render={({ field }) => (
								<TextAreaField
									placeholder="Penjelasan untuk materi ini..."
									value={field.value}
									onChangeText={field.onChange}
								/>
							)}
						/>
					</ListSection>
				</VStack>
			}
			footerComponent={
				<Button
					isDisabled={title === ""}
					size="cta"
					label="Simpan"
					onPress={onSave}
				/>
			}
		/>
	);
};

const DeletingModal = ({
	isOpen,
	onCancel,
	onContinue,
	content,
}: {
	isOpen: boolean;
	onCancel: () => void;
	onContinue: () => void;
	content?:
		| (LessonContent &
				Record<"fieldId", string> & {
					disabled?: boolean;
				})
		| null;
}) => (
	<Modal
		isOpen={isOpen}
		onClose={onCancel}
		title="Hapus konten?"
		description={
			content
				? `"${content.title}" akan dihapus dari materi ini.`
				: "Konten ini akan dihapus dari materi ini."
		}
		contentComponent={
			<>
				<Button label="Batal" variant="outline" onPress={onCancel} />
				<Button label="Ya" variant="destructive" onPress={onContinue} />
			</>
		}
	/>
);

const UnsavedChangesModal = ({
	isOpen,
	onCancel,
	onContinue,
}: {
	isOpen: boolean;
	onCancel: () => void;
	onContinue: () => void;
}) => (
	<Modal
		isOpen={isOpen}
		onClose={onCancel}
		title="Buang perubahan?"
		description="Perubahan yang belum disimpan akan hilang."
		contentComponent={
			<>
				<Button label="Batal" variant="outline" onPress={onCancel} />
				<Button label="Buang" variant="destructive" onPress={onContinue} />
			</>
		}
	/>
);
