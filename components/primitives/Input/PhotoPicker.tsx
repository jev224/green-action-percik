// components/primitives/Input/PhotoPicker.tsx
// Was inputs/PhotoPicker.tsx. This one was already well-built — controlled/
// uncontrolled state, single responsibility, no store/nav leakage. Moved
// as-is other than fixing the relative "../ui/button" import to match the
// "@/components/ui/..." convention every other file uses, and switching to
// a named export.
//
// ⚠️ FLAGGING, NOT CHANGING: MAX_FILE_SIZE_BYTES below is 5KB, which
// compresses down to roughly thumbnail quality — the original comment even
// warns about this. I'm leaving the actual number alone since I don't know
// your real target (avatar thumbnail vs. a photo students review), but you
// should decide this on purpose rather than inherit whatever it was set to.

import { File } from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon, RotateCcwIcon, XIcon } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Pressable } from "react-native";

import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

// Target upper bound for the final compressed photo.
// NOTE: 5kb is very aggressive — expect roughly thumbnail-level detail.
// Bump this up (e.g. 50 * 1024) if you actually need visible detail.
const MAX_FILE_SIZE_BYTES = 5 * 1024;
const MAX_COMPRESSION_ATTEMPTS = 8;

const photoPickerStyle = tva({
  base: "h-70 rounded-2xl overflow-hidden border-2 border-dashed border-border bg-background-50",
  variants: {
    hasPhoto: {
      true: "border-solid bg-background-0",
      false: "",
    },
    pressed: {
      true: "opacity-70",
      false: "",
    },
  },
});

/**
 * Iteratively resizes + re-compresses a JPEG until it's under MAX_FILE_SIZE_BYTES,
 * or gives up after MAX_COMPRESSION_ATTEMPTS and returns the smallest version found.
 * Quality alone rarely gets JPEGs down to a few KB, so width is stepped down too.
 */
async function compressToTargetSize(sourceUri: string): Promise<string> {
  let quality = 0.7;
  let width = 800;
  let bestUri = sourceUri;

  for (let attempt = 0; attempt < MAX_COMPRESSION_ATTEMPTS; attempt++) {
    const manipulated = await ImageManipulator.manipulateAsync(
      sourceUri,
      [{ resize: { width } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
    );

    const file = new File(manipulated.uri);
    const size = file.exists
      ? (file.size ?? Number.POSITIVE_INFINITY)
      : Number.POSITIVE_INFINITY;

    bestUri = manipulated.uri;

    if (size <= MAX_FILE_SIZE_BYTES) {
      return manipulated.uri;
    }

    quality = Math.max(0.1, quality - 0.15);
    width = Math.max(80, Math.floor(width * 0.75));
  }

  return bestUri;
}

type PhotoPickerProps = Omit<
  React.ComponentPropsWithoutRef<typeof Box>,
  "children"
> & {
  /** Controlled photo uri. Omit to let the component manage its own state. */
  value?: string | null;
  /** Called with the compressed photo uri, or null if cleared. */
  onChange?: (uri: string | null) => void;
  className?: string;
};

export const PhotoPicker = React.forwardRef<
  React.ElementRef<typeof Box>,
  PhotoPickerProps
>(({ value, onChange, className, ...props }, ref) => {
  const [internalUri, setInternalUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isControlled = value !== undefined;
  const uri = isControlled ? value : internalUri;

  const setUri = useCallback(
    (next: string | null) => {
      if (!isControlled) setInternalUri(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const openCamera = useCallback(async () => {
    if (isProcessing) return;

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (result.canceled || !result.assets?.[0]) return;

    setIsProcessing(true);
    try {
      const compressedUri = await compressToTargetSize(result.assets[0].uri);
      setUri(compressedUri);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, setUri]);

  const handleRemove = useCallback(
    (e: any) => {
      e.stopPropagation?.();
      setUri(null);
    },
    [setUri],
  );

  return (
    <Pressable
      onPress={openCamera}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={isProcessing}
    >
      <Box
        ref={ref}
        className={photoPickerStyle({
          hasPhoto: !!uri,
          pressed: isPressed && !uri,
          class: className,
        })}
        {...props}
      >
        {uri ? (
          <>
            <Image
              source={{ uri }}
              alt="Foto yang diambil"
              className="w-full h-full"
              resizeMode="cover"
            />

            {/* bottom action bar: retake / remove */}
            <HStack
              className="absolute bottom-0 left-0 right-0 bg-background-950/60 p-4"
              space="lg"
            >
              <Button
                className="flex-1 py-5 bg-card"
                variant="outline"
                size="lg"
                onPress={openCamera}
              >
                <ButtonIcon as={RotateCcwIcon} />
                <ButtonText>Ambil Ulang</ButtonText>
              </Button>

              <Button
                className="flex-1 py-5"
                variant="destructive"
                size="lg"
                onPress={handleRemove}
              >
                <ButtonIcon as={XIcon} />
                <ButtonText>Hapus</ButtonText>
              </Button>
            </HStack>
          </>
        ) : (
          <Center className="flex-1 h-full">
            <VStack space="md" className="items-center">
              <Center className="w-14 h-14 rounded-full bg-background-100">
                <Icon
                  as={CameraIcon}
                  className="text-foreground/70 w-16 h-16"
                />
              </Center>
              <Text className="font-medium" size="xl">
                Ambil Foto
              </Text>
            </VStack>
          </Center>
        )}

        {isProcessing && (
          <Center className="absolute inset-0 bg-background-950/40">
            <VStack space="sm" className="items-center">
              <Spinner size={"large"} />
              <Text className="font-medium">Memproses...</Text>
            </VStack>
          </Center>
        )}
      </Box>
    </Pressable>
  );
});

PhotoPicker.displayName = "PhotoPicker";
