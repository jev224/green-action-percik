import { LinearGradient } from "expo-linear-gradient";
import { Quote } from "lucide-react-native";
import { type ReactNode, useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import { EaseView } from "react-native-ease";
import { SurfaceCard } from "@/components/primitives";
import type {
	SemanticColor,
	SurfaceVariant,
} from "@/components/styles/buildColorsVariants";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useThemeColors } from "@/hooks/useThemeColors";

// --- Static fallback data -----------------------------------------------
// Temporary local quote bank. Once quotes come from the DB/API, fetch them
// into the same shape (QuoteData[]) and pass via `quotesData` — this const
// is only used as the default when no prop is given.
export interface QuoteData {
	quote: string;
	author: string;
}

interface QuoteCardProps {
	/** Optional list of quotes (e.g. from DB/API). Falls back to the local default bank when omitted. */
	quotesData?: QuoteData[];
	/** Seconds between auto quote changes. Default: 5 */
	intervalSeconds?: number;
	color?: SemanticColor;
	variant?: SurfaceVariant;
	innerDecoration?: ReactNode;
	outerDecoration?: ReactNode;
}

export function QuoteCard({
	quotesData,
	intervalSeconds = 10,
	color = "success",
	innerDecoration,
	outerDecoration,
}: QuoteCardProps) {
	const { colors } = useThemeColors();
	const isDarkmode = useColorScheme() === "dark";

	const data = quotesData && quotesData.length > 0 ? quotesData : [];

	const [index, setIndex] = useState(() =>
		Math.floor(Math.random() * data.length),
	);

	useEffect(() => {
		// Reset if the data source changes (e.g. swapped from default -> fetched)
		setIndex(0);
	}, [data]);

	useEffect(() => {
		if (data.length <= 1) return;

		const id = setInterval(() => {
			setIndex((prev) => (prev + 1) % data.length);
		}, intervalSeconds * 1000);

		return () => clearInterval(id);
	}, [data, intervalSeconds]);

	const { quote, author } = data[index];

	return (
		<View className="flex-1">
			<SurfaceCard
				color={color}
				variant={isDarkmode ? "outline" : "solid"}
				className="p-6 flex-row overflow-hidden relative flex-1 items-center shadow-lg shadow-accent-foreground/20"
			>
				{(styles) => (
					<>
						{innerDecoration && (
							<View className="absolute inset-0">{innerDecoration}</View>
						)}

						{/* Decorative masked-gradient watermark icon */}
						<LinearGradient
							colors={[colors.primary, "transparent"]}
							start={{ x: 1, y: 0 }}
							end={{ x: 0, y: 1 }}
							style={{
								width: "150%",
								height: "150%",
								position: "absolute",
								top: 0,
								right: 0,
								opacity: 0.5,
							}}
						/>

						<Icon
							className={styles.icon({
								className: "absolute -top-5 -right-5 opacity-70",
							})}
							width={140}
							height={140}
							as={Quote}
						/>

						{/* key={index} forces a remount on each quote change, replaying initialAnimate -> animate */}
						<EaseView
							key={index}
							initialAnimate={{ opacity: 0, translateY: 24 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{
								type: "spring",
								damping: 15,
								stiffness: 120,
								mass: 1,
							}}
						>
							<VStack space="md">
								<EaseView
									initialAnimate={{ opacity: 0, scale: 0.6 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										type: "spring",
										damping: 12,
										stiffness: 200,
										delay: 80,
									}}
								>
									<Icon className={styles.text()} size="lg" as={Quote} />
								</EaseView>

								<EaseView
									initialAnimate={{ opacity: 0, translateY: 16 }}
									animate={{ opacity: 1, translateY: 0 }}
									transition={{
										type: "timing",
										duration: 400,
										easing: "easeOut",
										delay: 140,
									}}
								>
									<Heading
										className={styles.text({
											className: "max-w-98",
										})}
										size="xl"
										numberOfLines={4}
										ellipsizeMode="tail"
									>
										{quote}
									</Heading>
								</EaseView>

								{author && (
									<EaseView
										initialAnimate={{ opacity: 0, translateY: 16 }}
										animate={{ opacity: 1, translateY: 0 }}
										transition={{
											type: "timing",
											duration: 400,
											easing: "easeOut",
											delay: 220,
										}}
									>
										<Text
											className={styles.text({ className: "w-[70%]" })}
											size="lg"
										>
											~ {author}
										</Text>
									</EaseView>
								)}
							</VStack>
						</EaseView>
					</>
				)}
			</SurfaceCard>

			{outerDecoration}
		</View>
	);
}
