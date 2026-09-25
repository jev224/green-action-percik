import { useEffect, useState } from "react";
import { View } from "react-native";
import { EaseView } from "react-native-ease";
import { Text } from "@/components/ui/text";
import { shiftToast } from "./toastStack";

const MAX_STACK_SIZE = 3;

export function StackedToast({
	index,
	total,
	title,
	description,
	duration = 5000,
}: {
	index: number;
	total: number;
	title: string;
	description?: string;
	duration?: number;
}) {
	const [shouldHide, setShouldHide] = useState(false);
	const [shouldUnmount, setShouldUnmount] = useState(false);

	const depth = total - 1 - index;
	const direction = -1;

	useEffect(() => {
		const id = setTimeout(() => {
			setShouldHide(true);
		}, duration);

		return () => clearTimeout(id);
	}, [duration]);
	// Don't render toasts that are too deep in the stack.
	if (depth >= MAX_STACK_SIZE * 2 || shouldUnmount) {
		return null;
	}

	return (
		<EaseView
			pointerEvents="none"
			style={{ position: "absolute", top: 0, width: "100%" }}
			initialAnimate={{ scale: 1.05, translateY: 100 }}
			animate={{
				opacity: shouldHide ? 0 : depth >= MAX_STACK_SIZE ? 0.8 : 1,
				translateY: direction * (depth * 16 - depth ** 2.5),
				scale: 1 - depth * 0.1,
			}}
			onTransitionEnd={(e) => {
				if (e.finished && shouldHide) {
					setShouldUnmount(true);
					shiftToast();
				}
			}}
			transition={{ type: "spring" }}
		>
			<View className="self-center mb-12 mx-4 bg-card py-3 px-5 border border-border rounded-md">
				{description ? (
					<>
						<Text className="font-medium" size="lg">
							{title}
						</Text>
						<Text className="opacity-80 mb-1" size="sm">
							{description}
						</Text>
					</>
				) : (
					<Text className="font-medium">{title}</Text>
				)}
			</View>
		</EaseView>
	);
}
