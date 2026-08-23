import { FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";

import {
  ActionTile,
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

import { useLessonStore } from "@/stores/lessonAction";

import { useNavigation } from "@/hooks/useNavigation";
import { useLessons } from "@/hooks/useLessons";

import { LeafyGreen } from "lucide-react-native";

export default function LearningScreen() {
  const { navigateTo } = useNavigation();

  const viewLesson = useLessonStore((state) => state.viewLesson);

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

  const handleView = (id: number) => {
    viewLesson(id);
    navigateTo("/learn/overview");
  };

  return (
    <Screen
      isLoading={isLoading}
      isError={isError}
      onRefresh={refresh}
      isRefreshing={isRefreshing}
      headerComponent={
        <>
          <ScreenHeader title="Belajar" />

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
                  onPress={() => handleView(item.id)}
                  className="mb-4"
                  size="md"
                  title={item.title}
                  description={item.description}
                  contentPosition="top"
                  imageSource={
                    item.photoUrl ? { uri: item.photoUrl } : undefined
                  }
                  icon={!item.photoUrl ? LeafyGreen : undefined}
                />
              </Animated.View>
            )}
            keyExtractor={(lesson) => String(lesson.id)}
          />
        ) : (
          <EmptyState message="Tidak ada materi pembalajaran." />
        )
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
