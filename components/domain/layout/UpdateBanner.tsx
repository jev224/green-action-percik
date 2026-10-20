import { View } from "react-native";
import { EaseView } from "react-native-ease";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

interface UpdateBannerProps {
	progress: number;
	visibile: boolean;
}

export function UpdateBanner({ progress, visibile }: UpdateBannerProps) {
	const insets = useSafeAreaInsets();
	return (
		<EaseView
			animate={{
				translateY: visibile ? 0 : -100,
				scale: visibile ? 1 : 0.9,
			}}
			style={{
				position: "absolute",
				top: Math.max(insets.top, 24),
				left: 0,
				right: 0,
				alignItems: "center",
				pointerEvents: "none",
			}}
		>
			<View className="rounded-md border border-border bg-card py-2 px-4 overflow-hidden flex-row gap-16 items-center pointer-events-none">
				<EaseView
					transformOrigin={{ x: 0 }}
					style={{ position: "absolute", inset: 0, zIndex: -1 }}
					animate={{ scaleX: progress }}
				>
					<View className="absolute inset-0 bg-primary/50" />
				</EaseView>

				<Text size="md" className="font-medium">
					Mengunduh Update
				</Text>

				<Text size="xl" className="font-medium">
					{`${progress * 100}%`}
				</Text>
			</View>
		</EaseView>
	);
}
