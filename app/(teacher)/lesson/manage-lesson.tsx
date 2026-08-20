import { useEffect, useRef, useState } from "react";
import Animated from "react-native-reanimated";
import Sortable, { OrderChangeParams } from "react-native-sortables";
import { Plus } from "lucide-react-native";

import { VStack } from "@/components/ui/vstack";
import { CloseIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";

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

import { LessonContent } from "@/lib/supabase/database.types";
import { useLessonStore } from "@/stores/lessonAction";
import { contentLayoutTransition } from "@/components/animation/presets";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  createNewLesson,
  updateLesson,
  getLessonDetails,
  getChangedLessonFields,
  LessonFields,
} from "@/services/teacher/lessons";
import { NavigationAction, useNavigation } from "@/hooks/useNavigation";
import { Alert } from "react-native";
import { Stack } from "expo-router";

type LessonForm = LessonFields;

const createEmptyBlock = (index: number): LessonContent => ({
  // Date.now() alone can collide if two blocks are added in the same
  // millisecond (e.g. double-tap); pad with a random suffix.
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: `Konten Baru #${index}`,
  explanation: "",
});

export default function EditLessonScreen() {
  const { goBack, setupRemoveListener, dispatch } = useNavigation();

  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Lesson mode
  const lesson = useLessonStore((state) => state.lesson);
  const isEdit = lesson.mode === "edit";

  // FORM STATE — generic form-field state, not tied to navigation
  // or submit logic. Candidate to extract into a `useLessonFormState`
  // hook if another screen ever needs the same shape; left inline
  // for now since it's single-use.
  const [form, setForm] = useState<LessonForm>({
    title: "",
    description: "",
    contents: [],
  });
  const [photoUri, setPhotoUri] = useState<string | null | undefined>(
    undefined,
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editingBlock =
    form.contents.find((content) => content.id === editingId) ?? null;

  const deletingBlock =
    form.contents.find((content) => content.id === deletingId) ?? null;

  const updateForm = <K extends keyof LessonForm>(
    key: K,
    value: LessonForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateField = (key: "title" | "description") => (value: string) => {
    updateForm(key, value);
  };

  const updateEditingBlock =
    (key: keyof Pick<LessonContent, "title" | "explanation">) =>
    (value: string) => {
      if (!editingId) return;

      setForm((prev) => ({
        ...prev,
        contents: prev.contents.map((content) =>
          content.id === editingId ? { ...content, [key]: value } : content,
        ),
      }));
    };

  const addContentBlock = () => {
    const block = createEmptyBlock(form.contents.length + 1);

    setForm((prev) => ({ ...prev, contents: [...prev.contents, block] }));
    setEditingId(block.id);
  };

  const deleteContentBlock = () => {
    if (!deletingId) return;

    setForm((prev) => ({
      ...prev,
      contents: prev.contents.filter((content) => content.id !== deletingId),
    }));

    if (editingId === deletingId) {
      setEditingId(null);
    }

    setDeletingId(null);
  };

  const reorderContents = ({ indexToKey }: OrderChangeParams) => {
    setForm((prev) => {
      const contentsById = new Map(
        prev.contents.map((content) => [content.id, content]),
      );

      return {
        ...prev,
        contents: indexToKey
          .map((id) => contentsById.get(id))
          .filter((content): content is LessonContent => content !== undefined),
      };
    });
  };

  // DATA FETCH (edit mode only) — pure fetch + no screen-specific
  // concerns. Extract to e.g. `useLessonDetails(id)` if reused.
  const {
    data: fetchedLesson,
    isLoading: isLoadingLesson,
    isError: isLessonError,
  } = useAsyncData(
    () => (isEdit ? getLessonDetails(lesson.id) : Promise.resolve(null)),
    [isEdit, isEdit ? lesson.id : null],
  );

  // HYDRATION — screen-specific glue: takes the fetch result and
  // seeds both the editable form AND a frozen snapshot of the
  // original values. The snapshot is what submit diffs against, so
  // we only ever send the fields the user actually changed.
  const originalRef = useRef<{
    fields: LessonFields;
    photoUrl: string | null;
  } | null>(null);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (!fetchedLesson || hasHydratedRef.current) return;

    const fields: LessonFields = {
      title: fetchedLesson.title,
      description: fetchedLesson.description,
      contents: fetchedLesson.contents,
    };

    setForm(fields);
    setPhotoUri(fetchedLesson.photoUrl);

    originalRef.current = { fields, photoUrl: fetchedLesson.photoUrl };
    hasHydratedRef.current = true;
  }, [fetchedLesson]);

  // SUBMIT — screen-specific orchestration (diffing + navigation +
  // submitting state). Not a good extraction candidate on its own
  // since it's glueing several concerns together for this one screen.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolvePhotoUriForSubmit = (): string | null | undefined => {
    if (!isEdit) return photoUri; // create mode: send whatever was picked

    const original = originalRef.current;
    if (!original) return undefined; // baseline not loaded yet, don't touch
    if (photoUri === original.photoUrl) return undefined; // unchanged

    return photoUri; // new local uri, or null if removed
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (isEdit) {
        const original = originalRef.current;
        const changedFields = original
          ? getChangedLessonFields(original.fields, form)
          : form; // fallback: baseline somehow not ready, send everything

        await updateLesson({
          id: lesson.id,
          ...changedFields,
          photoUri: resolvePhotoUriForSubmit(),
        });
      } else {
        await createNewLesson({ ...form, photoUri });
      }

      // TODO: navigate back to the lesson list here (e.g. router.back()).
      // Left unwired since I don't know which navigation lib this project uses.
      goBack("/(teacher)/(tabs)/home");
    } catch (error) {
      console.error(error);
      // TODO: surface this to the user once there's a toast/snackbar
      // primitive in the shared component kit — silently failing isn't great.
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSaveDisabled =
    !form.title ||
    !form.description ||
    form.contents.length === 0 ||
    isSubmitting ||
    (isEdit && (isLoadingLesson || isLessonError));

  // ───────────────────────────────────────────────────────────────
  // UNSAVED CHANGES GUARD — screen-specific: reuses the same diff
  // utility the submit flow already uses, so "is there anything to
  // lose" and "what do I send to the server" never disagree with
  // each other.
  //
  // usePreventRemove intercepts ANY action that would remove this
  // screen from the stack — Android hardware back, the Android/iOS
  // edge-swipe gesture, and the header back button all funnel through
  // the same navigation event, so one hook covers all three. It does
  // NOT catch the user backgrounding/closing the whole app; that's a
  // separate (and much rarer) case, usually solved by autosaving
  // drafts rather than a dialog.
  // ───────────────────────────────────────────────────────────────
  const hasUnsavedChanges = isEdit
    ? originalRef.current !== null &&
      (Object.keys(getChangedLessonFields(originalRef.current.fields, form))
        .length > 0 ||
        resolvePhotoUriForSubmit() !== undefined)
    : form.title !== "" || form.description !== "" || form.contents.length > 0;

  const pendingActionRef = useRef<NavigationAction | null>(null);

  useEffect(() => {
    if (!hasUnsavedChanges) return; // nothing to lose, don't intercept back at all

    return setupRemoveListener((action) => {
      pendingActionRef.current = action;
      setShowUnsavedModal(true);
    });
  }, [hasUnsavedChanges]);

  const handleDiscard = () => {
    setShowUnsavedModal(false);

    if (pendingActionRef.current) {
      // Resume the exact action that was blocked (swipe, hardware back,
      // or the header back button — they all flow through the same
      // beforeRemove listener now, see BackButton below). This does
      // NOT re-trigger the listener; it completes the original action.
      dispatch(pendingActionRef.current);
      pendingActionRef.current = null;
    }
  };

  // ───────────────────────────────────────────────────────────────
  // RENDER — screen-specific JSX, stays here.
  // ───────────────────────────────────────────────────────────────
  return (
    <Stack.Screen options={{ gestureEnabled: !hasUnsavedChanges }}>
      <Screen
        scrollable
        isLoading={isLoadingLesson}
        headerComponent={
          <ScreenHeader
            title={isEdit ? "Edit Materi" : "Buat Materi"}
            leftComponent={<BackButton />}
          />
        }
        contentComponent={
          <>
            <ListSection title="Judul" size="md">
              <TextField
                placeholder="Pengertian Sampah"
                value={form.title}
                onChangeText={updateField("title")}
              />
            </ListSection>

            <ListSection title="Deskripsi" size="md">
              <TextAreaField
                placeholder="Deskripsi untuk materi ini..."
                value={form.description}
                onChangeText={updateField("description")}
              />
            </ListSection>

            <ListSection title="Gambar sampul" size="md">
              <PhotoPicker value={photoUri} onChange={setPhotoUri} />
            </ListSection>

            <ListSection title="Konten" size="md">
              <Sortable.Grid
                columns={1}
                data={form.contents}
                keyExtractor={(item) => item.id}
                dropAnimationDuration={200}
                activationAnimationDuration={140}
                rowGap={10}
                columnGap={10}
                renderItem={({ item }) => (
                  <SortableCard
                    title={item.title}
                    description={item.explanation || "Tidak ada deskripsi."}
                    onPress={() => setEditingId(item.id)}
                    onDelete={() => setDeletingId(item.id)}
                  />
                )}
                hapticsEnabled
                onOrderChange={reorderContents}
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
                  onPress={handleSubmit}
                  isDisabled={isSaveDisabled}
                  isLoading={isSubmitting}
                />
              </HStack>
            </BottomPanel>

            <Modal
              isOpen={showUnsavedModal}
              onClose={() => setShowUnsavedModal(false)}
              title="Buang perubahan?"
              description="Perubahan yang belum disimpan akan hilang."
              contentComponent={
                <>
                  <Button
                    label="Batal"
                    variant="outline"
                    onPress={() => setShowUnsavedModal(false)}
                  />

                  <Button
                    label="Buang"
                    variant="destructive"
                    onPress={handleDiscard}
                  />
                </>
              }
            />

            <Modal
              isOpen={deletingBlock !== null}
              onClose={() => setDeletingId(null)}
              title="Hapus konten?"
              description={
                deletingBlock
                  ? `"${deletingBlock.title}" akan dihapus dari materi ini.`
                  : "Konten ini akan dihapus dari materi ini."
              }
              contentComponent={
                <>
                  <Button
                    label="Batal"
                    variant="outline"
                    onPress={() => setDeletingId(null)}
                  />

                  <Button
                    label="Ya"
                    variant="destructive"
                    onPress={deleteContentBlock}
                  />
                </>
              }
            />

            <Drawer
              avoidKeyboard
              isOpen={editingBlock !== null}
              size="lg"
              anchor="bottom"
              onClose={() => setEditingId(null)}
              headerComponenent={
                <ScreenHeader
                  title="Edit Konten"
                  rightComponent={
                    <IconButton
                      icon={CloseIcon}
                      onPress={() => setEditingId(null)}
                    />
                  }
                />
              }
              contentComponent={
                <VStack space="lg">
                  <ListSection title="Judul" size="md">
                    <TextField
                      placeholder="Pengertian Sampah"
                      value={editingBlock?.title ?? ""}
                      onChangeText={updateEditingBlock("title")}
                    />
                  </ListSection>

                  <ListSection title="Deskripsi" size="md">
                    <TextAreaField
                      placeholder="Deskripsi untuk materi ini..."
                      value={editingBlock?.explanation ?? ""}
                      onChangeText={updateEditingBlock("explanation")}
                    />
                  </ListSection>
                </VStack>
              }
              footerComponent={
                <Button
                  isDisabled={editingBlock?.title === ""}
                  size="cta"
                  label="Simpan"
                  onPress={() => setEditingId(null)}
                />
              }
            />
          </>
        }
      />
    </Stack.Screen>
  );
}
