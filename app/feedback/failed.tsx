import { XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { EaseView } from "react-native-ease";
import { Button, Screen, Spacer } from "@/components/primitives";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "@/hooks/useNavigation";
import { useShowToast } from "@/hooks/useShowToast";
import { useResultStore } from "@/stores/result";

export default function FailedScreen() {
	const showToast = useShowToast();
	const { navigateToHome } = useNavigation();

	const [transitionFinished, setTransitionFinished] = useState(false);

	const { type, title, subtitle, icon } = useResultStore().result ?? {};

	useEffect(() => {
		if (type !== "failed") {
			if (title) showToast({ title });
			navigateToHome();
		}
	}, [type]);

	if (type !== "failed") return null;

	return (
		<Screen
			space="4xl"
			contentComponent={
				<>
					<Center className="w-full flex-row">
						<View className="w-[50%] max-w-38 aspect-square mt-18">
							<View className="absolute size-full aspect-square">
								{!transitionFinished &&
									Array.from({ length: 3 }).map((_, index, arr) => (
										<EaseView
											// biome-ignore lint/suspicious/noArrayIndexKey: Static decorative elements
											key={index}
											onTransitionEnd={(finished) => {
												if (finished && index === arr.length - 1)
													setTransitionFinished(true);
											}}
											initialAnimate={{
												scale: 0,
												opacity: 0.6,
											}}
											animate={{
												scale: 4,
												opacity: 0,
											}}
											transition={{
												transform: {
													type: "spring",
													damping: 20,
													stiffness: 60,
													mass: 1.2,
													delay: index * 400,
												},
												opacity: {
													type: "timing",
													duration: 1400,
													easing: "easeOut",
													delay: index * 400,
												},
											}}
											style={{ position: "absolute", inset: 0 }}
										>
											<View className="size-full rounded-full bg-destructive/20" />
										</EaseView>
									))}
							</View>

							<EaseView
								initialAnimate={{
									scale: 0.2,
									opacity: 0,
								}}
								animate={{
									scale: 1,
									opacity: 1,
								}}
								transition={{
									transform: { type: "spring" },
								}}
								style={{ position: "absolute", inset: 0 }}
							>
								<Center className="size-full rounded-full bg-destructive ring-8 ring-destructive/50">
									<Icon
										as={icon || XIcon}
										className="w-[70%] h-[70%] text-destructive-foreground"
									/>
								</Center>
							</EaseView>
						</View>
					</Center>

					<VStack space="sm" className="mt-8">
						<EaseView
							initialAnimate={{
								translateY: 50,
								opacity: 0,
							}}
							animate={{
								translateY: 0,
								opacity: 1,
							}}
							transition={{
								transform: {
									type: "spring",
									stiffness: 100,
								},
							}}
						>
							<Heading size="3xl" className="text-center tracking-tight" bold>
								{title}
							</Heading>
						</EaseView>

						<EaseView
							initialAnimate={{
								translateY: 50,
								opacity: 0,
							}}
							animate={{
								translateY: 0,
								opacity: 1,
							}}
							transition={{
								transform: {
									type: "spring",
									stiffness: 100,
									mass: 1.2,
								},
							}}
						>
							<Text size="lg" className="text-center font-mediumopacity-70">
								{" "}
								{subtitle}
							</Text>
						</EaseView>
					</VStack>

					<Spacer fill />

					<Button
						label="Kembail ke halaman utama"
						size="cta"
						variant="outline"
						className="bg-accent"
						onPress={() => navigateToHome()}
					/>
				</>
			}
		/>
	);
}
