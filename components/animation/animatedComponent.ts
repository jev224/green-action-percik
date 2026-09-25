import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { SelectContent, SelectTrigger } from "../ui/select";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AnimatedSelectTrigger =
	Animated.createAnimatedComponent(SelectTrigger);

export const AnimatedSelectContent =
	Animated.createAnimatedComponent(SelectContent);
