import { useEffect, useState } from "react";

import {
  ActivitySubmittedScreen,
  BackButton,
  StudentMultiSelect,
} from "@/components/domain";
import {
  BottomPanel,
  Button,
  ListSection,
  PhotoPicker,
  Screen,
  ScreenHeader,
  SelectField,
  Spacer,
} from "@/components/primitives";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useResultScreen } from "@/hooks/useResultScreen";
import { useShowToast } from "@/hooks/useShowToast";
import { useUserProfile } from "@/hooks/useUser";
import {
  deleteSubmittedCompostActivity,
  isCompostActivitySubmitted,
  submitCompostActivity,
} from "@/services/fetcher/shared/compost";
import { fetchStudentByClass } from "@/services/fetcher/shared/student";
import { ServerError } from "@/services/ServerError";

export default function CompostSubmissionScreen() {
  const [activityLocation, setActivityLocation] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<
    { user_id: string }[]
  >([]);
  const [activityPhotoUri, setActivityPhotoUri] = useState<string | null>(null);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [submittedInfo, setSubmittedInfo] = useState<Awaited<
    ReturnType<typeof isCompostActivitySubmitted>
  > | null>(null);

  const showToast = useShowToast();
  const userProfile = useUserProfile("student");
  const { showResult } = useResultScreen();

  const {
    data,
    errorMessage,
    isLoading: isFetchLaoding,
    refresh,
  } = useAsyncData(
    async (profile) =>
      profile && {
        profile,
        students: await fetchStudentByClass(profile.class_id),
      },
    userProfile,
  );

  const isFulfilled = !!activityPhotoUri && !!activityLocation;

  const handleSubmit = async () => {
    if (!isFulfilled) {
      showToast({
        title: "Yuk lengkapi semua kolom yang wajib diisi",
      });
      return;
    }

    setLoading(true);

    try {
      if (!data) return;

      await submitCompostActivity(
        "student",
        data.profile.user_id,
        data.profile.class_id,
        data.profile.class,
        activityPhotoUri,
        data.students.map(({ user_id }) => user_id),
        selectedStudents.map(({ user_id }) => user_id),
      );

      showResult({
        type: "success",
        title: "Kegiatan kompos berhasil dikirim",
        subtitle: "Kegiatan kompos kamu sudah tercatat untuk hari ini",
      });
    } catch (e) {
      if (e instanceof ServerError) {
        showToast({ title: e.ui_message });
        console.log(
          "Compost activity Submission",
          `[${e.status}]: `,
          e.message,
        );
      } else {
        showToast({ title: "Terjadi kesalahan. Coba lagi" });
        console.log("Compost activity Submission", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!userProfile.profile) return;
      setLoading(true);

      await deleteSubmittedCompostActivity(userProfile.profile.class_id);
      setSubmittedInfo(null);
    } catch (e) {
      if (e instanceof ServerError) {
        showToast({ title: e.ui_message });
      } else {
        showToast({ title: "Terjadi kesalahan. Coba lagi" });
      }

      console.log("Compost activity Deletion", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function run() {
      setInitialLoading(true);

      try {
        if (!userProfile.profile) return;
        const result = await isCompostActivitySubmitted(
          userProfile.profile.class_id,
        );

        setSubmittedInfo(result);
      } catch (e) {
        if (e instanceof ServerError) {
          showToast({ title: e.ui_message });
        }

        console.log("Compost activity Checker", e);
      } finally {
        setInitialLoading(false);
      }
    }

    run();
  }, [userProfile.profile]);

  const isByMe =
    submittedInfo &&
    userProfile.profile &&
    submittedInfo.submittedBy === userProfile.profile.user_id;

  return submittedInfo?.submitted ? (
    <ActivitySubmittedScreen
      initialLoading={initialLoading}
      isLoading={isLoading}
      onDelete={isByMe ? handleDelete : undefined}
      message={
        isByMe
          ? "Kamu sudah mengirim kegiatan kompos bulan ini. Hapus pengiriman jika ingin mengubahnya, atau kembali ke halaman utama."
          : `Kegiatan kompos sudah kirim oleh ${submittedInfo.submittedAuthor} pada bulan ini. Minta ${submittedInfo.submittedAuthor} jika ingin mengubah pengiriman, atau kembali ke halaman utama.`
      }
    />
  ) : (
    <Screen
      scrollable
      requiredInternet
      headerComponent={
        <ScreenHeader title="Laporan Kompos" leftComponent={<BackButton />} />
      }
      overlayComponent={
        <BottomPanel variant="ghost">
          <Button
            size="cta"
            label="Kirim"
            isLoading={isLoading}
            onPress={handleSubmit}
            isDisabled={initialLoading}
          />
        </BottomPanel>
      }
      contentComponent={
        <>
          <ListSection title="Lokasi Kegiatan">
            <SelectField
              placeholder="Pilih Lokasi"
              options={[
                { label: "Pendopo", value: "pendopo" },
                { label: "Lapangan", value: "lapangan" },
              ]}
              value={activityLocation}
              onValueChange={setActivityLocation}
            />
          </ListSection>

          <ListSection title="Siswa Hadir">
            <StudentMultiSelect
              onRefresh={refresh}
              errorMessage={errorMessage}
              isLoading={isFetchLaoding}
              studentsRes={data?.students}
              onSelectionChange={setSelectedStudents}
            />
          </ListSection>

          <ListSection title="Foto Kegiatan">
            <PhotoPicker
              value={activityPhotoUri}
              onChange={setActivityPhotoUri}
            />
          </ListSection>

          <Spacer height={108} />
        </>
      }
    />
  );
}
