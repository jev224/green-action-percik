import { useState } from "react";

import { BackButton } from "@/components/domain";
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

export default function CompostSubmissionScreen() {
  const [activityLocation, setActivityLocation] = useState<string>("");
  const [activityPhotoUri, setActivityPhotoUri] = useState<string | null>(null);

  return (
    <Screen
      scrollable
      headerComponent={
        <ScreenHeader title="Laporan Kompos" leftComponent={<BackButton />} />
      }
      overlayComponent={
        <BottomPanel variant="ghost">
          <Button size="cta" label="Kirim" />
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
