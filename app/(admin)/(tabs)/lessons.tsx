import { FlatList } from "react-native";

import { useLessons } from "@/hooks/useLessons";

import { HStack } from "@/components/ui/hstack";

import {
  ActionTile,
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
import { router } from "expo-router";

const LIST_LAYOUT = LinearTransition.springify()
  .damping(25)
  .stiffness(280)
  .mass(0.8);

const ITEM_ENTER = FadeInDown.easing(Easing.out(Easing.ease))
  .duration(260)
  .delay(100);

const ITEM_EXIT = FadeOutUp.easing(Easing.in(Easing.ease)).duration(220);

export default function LessonsScreen() {
  const { searchQuery, setSearchQuery, sortOptions, sort, setSort, results } =
    useLessons();
  return (
    <Screen
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
                onPress={() => {
                  router.navigate("/lesson/edit-lesson");
                }}
                className="mb-4"
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            </Animated.View>
          )}
          keyExtractor={(lesson) => lesson.id}
        />
      }
    />
  );
}
