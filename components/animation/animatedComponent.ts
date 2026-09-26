import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { SelectTrigger } from "../ui/select";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AnimatedSelectTrigger =
	Animated.createAnimatedComponent(SelectTrigger);
