import { FlatList, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated from "react-native-reanimated";

import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";

import {
  ActionTile,
  Button,
  EmptyState,
  Screen,
  ScreenHeader,
  SearchField,
  SortSelect,
} from "@/components/primitives";

import {
  contentEnterTransition,
  contentExitTransition,
  contentLayoutTransition,
} from "@/components/animation/presets";

import { BookImage, Plus } from "lucide-react-native";

import { useLessonStore } from "@/stores/lessonAction";

import { useLessons } from "@/hooks/useLessons";
import { useNavigation } from "@/hooks/useNavigation";

export default function LessonsScreen() {
  const insets = useSafeAreaInsets();

  const { navigateTo } = useNavigation();
  const createLesson = useLessonStore((state) => state.createLesson);
  const editLesson = useLessonStore((state) => state.editLesson);

  const {
    searchQuery,
    setSearchQuery,
    sortOptions,
    sort,
    setSort,
    isLoading,
    isError,
    results,
    refresh,
    isRefreshing,
  } = useLessons();

  const handleEdit = (id: number) => {
    editLesson(id);
    navigateTo("/lesson/manage-lesson");
  };

  const handleCreate = () => {
    createLesson();
    navigateTo("/lesson/manage-lesson");
  };

  return (
    <Screen
      isLoading={isLoading}
      isError={isError}
      onRefresh={refresh}
      isRefreshing={isRefreshing}
      headerComponent={
        <>
          <ScreenHeader title="Kelola Materi" />

          <HStack space="sm">
            <SearchField value={searchQuery} onChangeText={setSearchQuery} />
            <SortSelect options={sortOptions} value={sort} onChange={setSort} />
          </HStack>
        </>
      }
      contentComponent={
        results.length > 0 ? (
          <FlatList
            data={results}
            showsVerticalScrollIndicator={false}
            className="overflow-visible"
            renderItem={({ item }) => (
              <Animated.View
                layout={contentLayoutTransition}
                entering={contentEnterTransition}
                exiting={contentExitTransition}
              >
                <ActionTile
                  onPress={() => handleEdit(item.id)}
                  className="mb-4"
                  size="md"
                  variant="solid"
                  title={item.title}
                  description={item.description}
                  imageSource={
                    item.photoUrl ? { uri: item.photoUrl } : undefined
                  }
                  icon={!item.photoUrl ? BookImage : undefined}
                />
              </Animated.View>
            )}
            keyExtractor={(lesson) => String(lesson.id)}
          />
        ) : (
          <EmptyState message="Tidak ada materi pembalajaran." />
        )
      }
      overlayComponent={
        <Fab
          className="p-0 background-transparent"
          style={{ marginBottom: insets.bottom }}
          size="sm"
          placement="bottom right"
        >
          <Button
            label="Materi Baru"
            icon={Plus}
            className="px-5 py-4 gap-0 rounded-full"
            onPress={handleCreate}
          />
        </Fab>
      }
      loadingComponent={
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="overflow-visible"
        >
          <VStack space="md">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </VStack>
        </ScrollView>
      }
    />
  );
}
