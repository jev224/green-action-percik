import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Frown, WifiOff } from "lucide-react-native";
import { type ReactNode, useEffect, useState } from "react";
import { Platform, RefreshControl, ScrollView } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { checkConnection, sleepAsync } from "@/utils";
import ErrorState from "../Feedback/ErrorState";

type ContentComponent<T> = ReactNode | ((data: NonNullable<T>) => ReactNode);

interface ScreenProps<T = undefined> {
	isLoading?: boolean;
	isError?: boolean;
	data?: T;
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
	isRefreshing?: boolean;
	onRefresh?: () => void;
}

export function Screen<T = undefined>({
	isLoading,
	isError,
	data,
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
	isRefreshing,
	onRefresh,
}: ScreenProps<T>) {
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
		(!effectiveIsError && (isLoading || isDataMissing)) || internetLoading;

	// Do not show refreshing when there is an internet error
	// unless the internet is currently loading.
	const effectiveIsRefreshing =
		!!isRefreshing && (!internetError || internetLoading);

	const isUsingDefaultLoading = effectiveIsLoading && !loadingComponent;

	// Pull-to-refresh needs a ScrollView regardless of the `scrollable` flag,
	// since the gesture requires a scroll container to attach to.
	const hasRefresh = !!onRefresh;
	const shouldScroll = (scrollable || hasRefresh) && !isUsingDefaultLoading;

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

	const contentStyle = {
		flex: shouldScroll ? undefined : 1,
	};

	const checkInternet = async () => {
		try {
			const isOnline = await checkConnection();
			setInternet(isOnline);
		} finally {
			setInternetLoading(false);
		}
	};

	const refreshInternet = async () => {
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

	const content = (
		<SafeAreaView
			edges={headerComponent ? ["left", "right", "bottom"] : undefined}
			style={contentStyle}
		>
			<VStack className="px-8 py-6" style={contentStyle} space={space}>
				{canRenderContent && renderedContent}
				{effectiveIsLoading && renderedLoading}
				{footerComponent}
			</VStack>
		</SafeAreaView>
	);

	return (
		<Box className="flex-1 w-full bg-background items-center">
			<Box className="flex-1 w-full max-w-200">
				{headerComponent && (
					<Box className="z-10 -mb-4 pb-4 pt-6">
						<SafeAreaView edges={["top", "left", "right"]}>
							<VStack className="px-8" space={space}>
								{headerComponent}
							</VStack>
						</SafeAreaView>

						<Box className="absolute inset-0 bg-background -z-1" />
					</Box>
				)}

				{shouldScroll ? (
					<ScrollView
						showsVerticalScrollIndicator={false}
						// Only real "scrollable" screens should stretch/scroll content freely.
						// Refresh-only screens (scrollable=false, hasRefresh=true) still need
						// the container to grow to fill height so layout doesn't break.
						contentContainerStyle={!scrollable ? { flexGrow: 1 } : undefined}
						refreshControl={
							hasRefresh ? (
								<RefreshControl
									refreshing={effectiveIsRefreshing}
									onRefresh={async () => {
										if (requiredInternet) await refreshInternet();
										onRefresh?.();
									}}
									progressViewOffset={
										Platform.OS === "android"
											? headerComponent
												? 24
												: insets.top + 8
											: 100
									} // nudge below status bar on Android
								/>
							) : undefined
						}
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
									if (isError) onTryAgain?.();
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
