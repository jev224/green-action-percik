import { cn } from "@gluestack-ui/utils/nativewind-utils";
import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { type ComponentProps, useCallback, useEffect, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { EaseView } from "react-native-ease";
import Animated, {
	interpolate,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedPressable } from "@/components/animation/animatedComponent";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useTabBarHeightStore } from "@/stores/tabBarHeight";

const TAB_HEIGHT = 56;

export type TabConfig = {
	name: string;
	label: string;
	icon: ComponentProps<typeof Icon>["as"];
	activeIcon: ComponentProps<typeof Icon>["as"];
};

export function TabBar({
	tabConfigs,
	state,
	jumpTo,
}: MaterialTopTabBarProps & { tabConfigs: TabConfig[] }) {
	const insets = useSafeAreaInsets();
	const setTabBarHeight = useTabBarHeightStore((s) => s.setTabBarHeight);

	useEffect(() => {
		setTabBarHeight(Math.max(insets.bottom, 24) + TAB_HEIGHT + 24);
	}, [insets.bottom]);

	return (
		<View
			pointerEvents="box-none"
			className="absolute left-0 right-0 bottom-0 z-20 items-center"
			style={{
				paddingBottom: Math.max(insets.bottom, 24),
			}}
		>
			<EaseView
				initialAnimate={{ translateY: 100, opacity: 0 }}
				animate={{ translateY: 0, opacity: 1 }}
				transition={{
					transform: { type: "spring" },
					opacity: { type: "timing" },
				}}
			>
				<View className="flex-row items-center justify-center p-3 gap-2 bg-card rounded-full shadow-2xl">
					{state.routes.map((route, index) => (
						<TabBarButton
							key={route.key}
							onPress={() => jumpTo(route.key)}
							isFocused={state.index === index}
							tab={tabConfigs[index]}
						/>
					))}
				</View>
			</EaseView>
		</View>
	);
}

interface TabBarButtonProps {
	onPress: () => void;
	isFocused: boolean;
	tab: TabConfig;
}

export function TabBarButton({ onPress, isFocused, tab }: TabBarButtonProps) {
	const { colors } = useThemeColors();

	const [expandedWidth, setExpandedWidth] = useState<number>(TAB_HEIGHT);
	const progress = useSharedValue(isFocused ? 1 : 0);

	useEffect(() => {
		progress.value = withSpring(isFocused ? 1 : 0, { damping: 80 });
	}, [isFocused]);

	const handleLayout = useCallback((e: LayoutChangeEvent) => {
		const { width } = e.nativeEvent.layout;
		setExpandedWidth((prev) =>
			prev !== width && width >= TAB_HEIGHT ? width : prev,
		);
	}, []);

	const buttonAnimatedStyle = useAnimatedStyle(() => {
		const width = expandedWidth
			? interpolate(progress.value, [0, 1], [TAB_HEIGHT, expandedWidth])
			: TAB_HEIGHT;

		return {
			width,
			backgroundColor: interpolateColor(
				progress.value,
				[0, 1],
				["transparent", colors.primary],
			),
		};
	});

	const labelAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(progress.value, [0, 0.4, 1], [0, 0, 1]),
		transform: [{ translateX: interpolate(progress.value, [0, 1], [12, 0]) }],
	}));

	return (
		<AnimatedPressable
			onPress={onPress}
			className="h-14 rounded-2xl overflow-hidden"
			style={buttonAnimatedStyle}
		>
			<View
				className="h-full flex-row items-center self-start pr-6"
				onLayout={handleLayout}
			>
				<View className="h-full aspect-square items-center justify-center">
					<Icon
						as={isFocused ? tab.activeIcon : tab.icon}
						className={cn(
							"h-6 w-6",
							isFocused ? "text-primary-foreground" : "text-muted-foreground",
						)}
					/>
				</View>

				<Animated.View style={labelAnimatedStyle}>
					<Text
						size="md"
						className="truncate text-primary-foreground font-semibold -ml-1"
					>
						{tab.label}
					</Text>
				</Animated.View>
			</View>
		</AnimatedPressable>
	);
}
