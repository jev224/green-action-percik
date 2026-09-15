import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { SurfaceCard } from "../primitives/Card/SurfaceCard";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { SelectContent, SelectTrigger } from "../ui/select";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CardAnimatedCard = Animated.createAnimatedComponent(Card);
export const AnimatedBox = Animated.createAnimatedComponent(Box);

export const AnimatedSelectTrigger =
	Animated.createAnimatedComponent(SelectTrigger);

export const AnimatedSelectContent =
	Animated.createAnimatedComponent(SelectContent);

export const AnimatedSurfaceCard =
	Animated.createAnimatedComponent(SurfaceCard);
