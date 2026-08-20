import { BackButton } from "@/components/domain";
import {
  BottomPanel,
  Button,
  ListSection,
  Screen,
  ScreenHeader,
  Spacer,
} from "@/components/primitives";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";

import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { getLessonDetails } from "@/services/teacher/lessons";
import { useLessonStore } from "@/stores/lessonAction";
import { formatDate } from "@/utils";
import { Redirect } from "expo-router";

import { Image as ImageIcon } from "lucide-react-native";

export default function LessonOverviewScreen() {
  const { navigateTo } = useNavigation();

  const lesson = useLessonStore((state) => state.lesson);
  const setLessonContentData = useLessonStore(
    (state) => state.setLessonContentData,
  );

  if (lesson.mode !== "view") {
    return <Redirect href={"/(student)/(tabs)/home"} />;
  }

  const { data, isLoading, isError } = useAsyncData(
    () => getLessonDetails(lesson.id),
    [],
  );

  const handleReadLesson = () => {
    if (!data) return;

    setLessonContentData(data.title, data.contents);
    navigateTo("/(student)/learn/content");
  };
  return (
    <Screen
      scrollable
      isLoading={isLoading}
      isError={isError}
      data={data}
      headerComponent={
        <ScreenHeader title="Detail Materi" leftComponent={<BackButton />} />
      }
      overlayComponent={
        <BottomPanel>
          <Button
            size="cta"
            label="Baca Materi"
            onPress={handleReadLesson}
            isDisabled={isLoading}
          />
        </BottomPanel>
      }
      contentComponent={({
        title,
        description,
        author,
        photoUrl,
        created_at,
      }) => (
        <>
          <Box className="w-full h-52 bg-accent-foreground/20 rounded-md">
            {photoUrl ? (
              <Image source={photoUrl} />
            ) : (
              <Center className="flex-1 gap-2 opacity-50">
                <Icon as={ImageIcon} width={52} height={52} />
                <Text>Tidak ada gambar</Text>
              </Center>
            )}
          </Box>

          <VStack>
            <Heading size="xl">{title}</Heading>

            <Text size="sm" className="opacity-70">
              Dibuat oleh{" "}
              <Text className="font-bold" size="sm">
                {author}
              </Text>{" "}
              · {formatDate(created_at)}
            </Text>
          </VStack>

          <ListSection size="sm" space="xs" title="Deskripsi">
            <Text size="md" className="leading-6">
              {description}
            </Text>
          </ListSection>

          <Spacer height={108} />
        </>
      )}
    />
  );
}
