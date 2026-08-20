import { FlatList } from "react-native";

import { LessonData, useLessons } from "@/hooks/useLessons";

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

import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";

import { LeafyGreen, Plus } from "lucide-react-native";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "react-native-gesture-handler";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { useLessonStore } from "@/stores/lessonAction";
import { useNavigation } from "@/hooks/useNavigation";

const LIST_LAYOUT = LinearTransition.springify()
  .damping(25)
  .stiffness(280)
  .mass(0.8);

const ITEM_ENTER = FadeInDown.easing(Easing.out(Easing.ease))
  .duration(260)
  .delay(100);

const ITEM_EXIT = FadeOutUp.easing(Easing.in(Easing.ease)).duration(220);

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
  } = useLessons();

  const handleView = (id: number) => {
    viewLesson(id);
    navigateTo("/learn/overview");
  };

  return (
    <Screen
      isLoading={isLoading}
      isError={isError}
      headerComponent={
        <>
          <ScreenHeader title="Belajar" />

          <HStack space="sm">
            <SearchField value={searchQuery} onChangeText={setSearchQuery} />
            <SortSelect options={sortOptions} value={sort} onChange={setSort} />
          </HStack>
        </>
      }
      errorComponent={<></>}
      contentComponent={
        results.length > 0 ? (
          <FlatList
            data={results}
            showsVerticalScrollIndicator={false}
            className="overflow-visible"
            renderItem={({ item }) => (
              <Animated.View
                layout={LIST_LAYOUT}
                entering={ITEM_ENTER}
                exiting={ITEM_EXIT}
              >
                <ActionTile
                  onPress={() => handleView(item.id)}
                  className="mb-4"
                  title={item.title}
                  description={item.description}
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
          <EmptyState message="Belum ada materi pembalajaran." />
        )
      }
      loadingComponent={
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="overflow-visible"
        >
          <VStack space="md">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </VStack>
        </ScrollView>
      }
    />
  );
}
