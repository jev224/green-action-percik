import { BackButton } from "@/components/domain";
import {
  BottomPanel,
  Button,
  ListSection,
  PhotoPicker,
  Screen,
  ScreenHeader,
  SegmentedControl,
  SelectField,
  Spacer,
  TextField,
} from "@/components/primitives";
import { Leaf, Recycle } from "lucide-react-native";
import { useState } from "react";

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
        <BottomPanel>
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
