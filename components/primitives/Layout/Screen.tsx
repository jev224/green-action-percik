import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Frown, WifiOff } from "lucide-react-native";
import { type ReactNode, useEffect, useState } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";
import { EaseView } from "react-native-ease";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { useAvoidingViewStore } from "@/stores/avoidingView";
import { useTabBarHeightStore } from "@/stores/tabBarHeight";
import { checkConnection, sleepAsync } from "@/utils";
import ErrorState from "../Feedback/ErrorState";
import { Spinner } from "../Feedback/Spinner";

type ContentComponent<T> = ReactNode | ((data: NonNullable<T>) => ReactNode);

interface ScreenProps<T = undefined> {
	isLoading?: boolean;
	isError?: boolean;
	data?: T;
	tabBarPadding?: boolean;
	avoidKeyboard?: boolean;
	relativeErrorPos?: boolean;
	overlayComponent?: ReactNode;
	portalComponent?: ReactNode;
	headerComponent?: ReactNode;
	contentComponent: ContentComponent<T>;
	errorComponent?: ReactNode;
	loadingComponent?: ReactNode;
	footerComponent?: ReactNode;
	errorMessage?: string;
	onTryAgain?: () => void;
	requiredInternet?: boolean;
	space?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
	scrollable?: boolean;
	refreshControl?: ScrollViewProps["refreshControl"];
}

export function Screen<T = undefined>({
	isLoading,
	isError,
	data,
	tabBarPadding,
	avoidKeyboard,
	relativeErrorPos,
	space = "2xl",
	headerComponent,
	overlayComponent,
	contentComponent,
	errorComponent,
	loadingComponent,
	footerComponent,
	errorMessage,
	onTryAgain,
	requiredInternet,
	scrollable,
	refreshControl,
}: ScreenProps<T>) {
	const offset = useAvoidingViewStore((s) => s.offset);
	const tabBarHeight = useTabBarHeightStore((s) => s.height);

	const [hasInternet, setInternet] = useState(true);
	const [internetLoading, setInternetLoading] = useState(true);

	const insets = useSafeAreaInsets();
	const isContentFn = typeof contentComponent === "function";

	const isDataMissing = isContentFn && (data === null || data === undefined);

	// Return false if requiredInternet is not provided.
	const internetError = requiredInternet && !hasInternet;

	// Combine errors from props and internet connection.
	const effectiveIsError = isError || internetError;

	// Prioritize internetLoading.
	// When error occurs, hide the loading state from props
	// so the error dialog can be displayed.
	const effectiveIsLoading =
		(!effectiveIsError && (isLoading || isDataMissing)) ||
		(internetLoading && requiredInternet);

	const canRenderContent = !effectiveIsLoading && !effectiveIsError;

	const renderedContent = canRenderContent
		? isContentFn
			? (contentComponent as (data: T) => ReactNode)(data as T)
			: contentComponent
		: null;

	const renderedLoading = loadingComponent ? (
		loadingComponent
	) : (
		<Center className="flex-1">
			<Spinner />
		</Center>
	);

	const content = (
		<EaseView
			animate={{
				translateY: avoidKeyboard ? -offset : 0,
			}}
			transition={{
				type: "spring",
				damping: 32,
				stiffness: 320,
				mass: 1,
			}}
			style={{
				flex: 1,

				paddingBottom: tabBarPadding
					? Math.max(tabBarHeight, 24)
					: Math.max(insets.bottom, 24),
			}}
		>
			<VStack className="flex-1 px-8 py-6" space={space}>
				{canRenderContent && renderedContent}

				{effectiveIsLoading && (
					<EaseView
						initialAnimate={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ type: "timing", duration: 200 }}
						style={{ flex: 1 }}
					>
						<VStack space={space} className="flex-1">
							{renderedLoading}
						</VStack>
					</EaseView>
				)}
				{footerComponent}
			</VStack>
		</EaseView>
	);

	const checkInternet = async () => {
		if (!requiredInternet) return;

		try {
			const isOnline = await checkConnection();
			setInternet(isOnline);
		} finally {
			setInternetLoading(false);
		}
	};

	const refreshInternet = async () => {
		if (!requiredInternet) return;

		setInternetLoading(true);
		await sleepAsync(1000);
		await checkInternet();
	};

	useEffect(() => {
		if (!requiredInternet) {
			setInternetLoading(false);
			setInternet(true);
			return;
		}

		if (requiredInternet) checkInternet();
	}, [requiredInternet]);

	return (
		<Box className="flex-1 w-full bg-background items-center">
			<Box className="flex-1 w-full max-w-200">
				{headerComponent && (
					<VStack
						className="z-10 -mb-4 pb-4 pt-6 px-8 shrink-0 bg-background"
						style={{ paddingTop: insets.top }}
						space={space}
					>
						{headerComponent}
					</VStack>
				)}

				{scrollable ? (
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							flexGrow: 1,
							paddingTop: headerComponent ? 0 : insets.top,
						}}
						refreshControl={refreshControl}
					>
						{content}
					</ScrollView>
				) : (
					content
				)}

				{effectiveIsError && !effectiveIsLoading && (
					<Center
						className={cn(
							"px-12 py-8  absolute inset-0",
							relativeErrorPos && "-translate-y-24 relative",
						)}
					>
						{internetError ? (
							<ErrorState
								message="Tidak ada koneksi internet. Coba periksa koneksi kamu"
								onRetry={async () => {
									await refreshInternet();
									onTryAgain?.();
								}}
								icon={WifiOff}
							/>
						) : (
							errorComponent || (
								<ErrorState
									message={errorMessage}
									onRetry={onTryAgain}
									icon={Frown}
								/>
							)
						)}
					</Center>
				)}

				{!effectiveIsError && overlayComponent}
			</Box>
		</Box>
	);
}
