import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
	ActivityIndicator,
	Animated,
	type ColorValue,
	type ImageStyle,
	PanResponder,
	type StyleProp,
	Text,
	View,
	type ViewStyle,
} from "react-native";
import { Spinner } from "../Feedback/Spinner";

type ScrollContentElement = React.ReactElement<{
	style?: StyleProp<ViewStyle>;
	[key: string]: unknown;
}>;

type ScrollViewElement = React.ReactElement<{
	children: ScrollContentElement;
}>;

export interface RefreshControlProps {
	refreshing: boolean;
	colors?: ColorValue[];
	enabled?: boolean;
	onRefresh?: () => void;
	progressBackgroundColor?: ColorValue;
	progressViewOffset?: number;
	size?: "small" | "large";
	tintColor?: ColorValue;
	title?: string;
	titleColor?: ColorValue;
	style?: StyleProp<ViewStyle>;
	children?: ScrollViewElement;
}

export function NativeRefreshControl({
	refreshing,
	tintColor,
	colors,
	style,
	progressViewOffset,
	children = <View></View>,
	size,
	title,
	titleColor,
	onRefresh,
	enabled,
}: RefreshControlProps) {
	const onRefreshRef = useRef(onRefresh);
	useEffect(() => {
		onRefreshRef.current = onRefresh;
	}, [onRefresh]);
	const enabledRef = useRef(enabled);
	useEffect(() => {
		enabledRef.current = enabled;
	}, [enabled]);

	const containerRef = useRef<View>(null);
	const pullPosReachedState = useRef(0);
	const pullPosReachedAnimated = useRef(new Animated.Value(0));
	const pullDownSwipeMargin = useRef(new Animated.Value(0));

	useEffect(() => {
		Animated.timing(pullDownSwipeMargin.current, {
			toValue: refreshing ? 50 : 0,
			duration: 350,
			useNativeDriver: false,
		}).start();
		if (refreshing) {
			pullPosReachedState.current = 0;
			pullPosReachedAnimated.current.setValue(0);
		}
	}, [refreshing]);

	const onPanResponderFinish = useCallback(() => {
		if (pullPosReachedState.current && onRefreshRef.current) {
			onRefreshRef.current();
		}
		if (!pullPosReachedState.current) {
			Animated.timing(pullDownSwipeMargin.current, {
				toValue: 0,
				duration: 350,
				useNativeDriver: false,
			}).start();
		}
	}, []);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => false,
			onStartShouldSetPanResponderCapture: () => false,
			onMoveShouldSetPanResponder: (_, gestureState) => {
				if (!containerRef.current) return false;
				// On react-native-web, a View's ref is the DOM element itself
				const containerDOM =
					containerRef.current as unknown as HTMLElement | null;
				if (!containerDOM) return false;
				return (
					containerDOM.children[0].scrollTop === 0 &&
					Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 2 &&
					Math.abs(gestureState.vy) > Math.abs(gestureState.vx) * 2.5
				);
			},
			onMoveShouldSetPanResponderCapture: () => false,
			onPanResponderMove: (_, gestureState) => {
				if (enabledRef.current !== undefined && !enabledRef.current) return;

				const adjustedDy =
					gestureState.dy <= 0
						? 0
						: (gestureState.dy * 150) / (gestureState.dy + 120); // Diminishing returns function
				pullDownSwipeMargin.current.setValue(adjustedDy);
				const newValue = adjustedDy > 45 ? 1 : 0;
				if (newValue !== pullPosReachedState.current) {
					pullPosReachedState.current = newValue;
					Animated.timing(pullPosReachedAnimated.current, {
						toValue: newValue,
						duration: 150,
						useNativeDriver: false,
					}).start();
				}
			},
			onPanResponderTerminationRequest: () => true,
			onPanResponderRelease: onPanResponderFinish,
			onPanResponderTerminate: onPanResponderFinish,
		}),
	);

	const refreshIndicatorColor = useMemo<ColorValue | null>(
		() => (tintColor ? tintColor : colors?.length ? colors[0] : null),
		[colors, tintColor],
	);

	const pullDownIconStyle = useMemo<Animated.WithAnimatedValue<ImageStyle>>(
		() => ({
			width: 22,
			height: 22,
			marginBottom: 18,
			transform: [
				{
					rotate: pullPosReachedAnimated.current.interpolate({
						inputRange: [0, 1],
						outputRange: ["90deg", "270deg"],
					}),
				},
			],
		}),
		[],
	);

	const containerStyle = useMemo<StyleProp<ViewStyle>>(
		() => [
			style,
			// overflowY is web-only, so it's not part of ViewStyle
			{
				overflowY: "hidden",
				overflow: "hidden",
				paddingTop: progressViewOffset,
			} as ViewStyle,
		],
		[progressViewOffset, style],
	);

	const indicatorTransformStyle = useMemo<
		Animated.WithAnimatedValue<ViewStyle>
	>(
		() => ({
			alignSelf: "center",
			marginTop: -40,
			height: 40,
			transform: [{ translateY: pullDownSwipeMargin.current }],
		}),
		[],
	);

	// This is messing with react-native-web's internal implementation
	// Will probably break if anything changes on their end
	const AnimatedContentContainer = useMemo(
		() =>
			withAnimated<ScrollContentElement["props"]>((childProps) => {
				const Inner = children.props.children.type as React.ElementType;
				return <Inner {...childProps} />;
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const newContentContainerStyle = useMemo(
		() => [
			children.props.children.props.style,
			{ transform: [{ translateY: pullDownSwipeMargin.current }] },
		],
		[children.props.children.props.style],
	);

	const newChildren = React.cloneElement(
		children,
		undefined,
		<>
			<Animated.View style={indicatorTransformStyle}>
				{refreshing ? (
					<>
						<ActivityIndicator
							color={refreshIndicatorColor || undefined}
							size={size || undefined}
							style={{ marginVertical: 10 }}
						/>
						{title && (
							<Text
								style={{ color: titleColor, textAlign: "center", marginTop: 5 }}
							>
								{title}
							</Text>
						)}
					</>
				) : (
					<Animated.View style={pullDownIconStyle}>
						<Spinner />
					</Animated.View>
				)}
			</Animated.View>
			<AnimatedContentContainer
				{...children.props.children.props}
				style={newContentContainerStyle}
			/>
		</>,
	);

	return (
		<View
			ref={containerRef}
			style={containerStyle}
			{...panResponder.current.panHandlers}
		>
			{newChildren}
		</View>
	);
}

function withAnimated<P extends object>(
	WrappedComponent: React.ComponentType<P>,
) {
	const displayName =
		WrappedComponent.displayName || WrappedComponent.name || "Component";

	class WithAnimated extends React.Component<P> {
		static displayName = `WithAnimated(${displayName})`;

		render() {
			return <WrappedComponent {...this.props} />;
		}
	}

	return Animated.createAnimatedComponent(WithAnimated);
}
