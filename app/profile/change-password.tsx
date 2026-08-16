import { BackButton } from "@/components/domain";
import {
  Button,
  ListSection,
  Screen,
  ScreenHeader,
  BottomPanel,
  TextField,
} from "@/components/primitives";

import { HStack } from "@/components/ui/hstack";

export default function ChangePasswordScreen() {
  return (
    <Screen
      headerComponent={
        <ScreenHeader title="Ubah Kata Sandi" leftComponent={<BackButton />} />
      }
      overlayComponent={
        <BottomPanel variant="ghost">
          <HStack space="md">
            <Button label="Konfirmasi" fill />
          </HStack>
        </BottomPanel>
      }
      contentComponent={
        <>
          <ListSection title="Kata sandi lama">
            <TextField placeholder="Masukkan kata sandi lama" />
          </ListSection>

          <ListSection title="Kata sandi baru">
            <TextField placeholder="Masukkan kata sandi baru" />
            <TextField placeholder="Konfirmasi kata sandi baru" />
          </ListSection>
        </>
      }
    />
  );
}
