import Animated from "react-native-reanimated";

import { Card } from "../ui/card";
import { Box } from "../ui/box";
import { SelectContent, SelectTrigger } from "../ui/select";
import { Pressable } from "react-native";
import { SurfaceCard } from "../primitives";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CardAnimatedCard = Animated.createAnimatedComponent(Card);
export const AnimatedBox = Animated.createAnimatedComponent(Box);

export const AnimatedSelectTrigger =
  Animated.createAnimatedComponent(SelectTrigger);

export const AnimatedSelectContent =
  Animated.createAnimatedComponent(SelectContent);

export const AnimatedSurfaceCard =
  Animated.createAnimatedComponent(SurfaceCard);
