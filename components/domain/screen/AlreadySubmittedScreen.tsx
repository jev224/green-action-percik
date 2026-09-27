import { Check } from "lucide-react-native";
import { useState } from "react";
import { EaseView } from "react-native-ease";
import { Button, Modal, Screen } from "@/components/primitives";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "@/hooks/useNavigation";
import { randomBetween } from "@/utils";

interface ActivitySubmittedScreenProps {
	initialLoading?: boolean;
	isLoading?: boolean;
	onDelete?: () => void;
	message: string;
}

export const ActivitySubmittedScreen = ({
	initialLoading,
	isLoading,
	onDelete,
	message,
}: ActivitySubmittedScreenProps) => {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { goBack } = useNavigation();

	return (
		<Screen
			requiredInternet
			isLoading={initialLoading}
			overlayComponent={
				onDelete && (
					<Modal
						isOpen={showDeleteModal}
						onClose={() => setShowDeleteModal(false)}
						title="Hapus kegiatan ini?"
						description="Kegiatan yang sudah dihapus tidak dapat dikembalikan. Kamu yakin ingin melanjutkan?"
						contentComponent={
							<>
								<Button
									label="Batal"
									variant="outline"
									onPress={() => setShowDeleteModal(false)}
								/>

								<Button
									isLoading={isLoading}
									label="Ya, Hapus"
									variant="destructive"
									onPress={onDelete}
								/>
							</>
						}
					/>
				)
			}
			contentComponent={
				<>
					<VStack className="flex-1 items-stretch justify-center gap-12">
						<EaseView
							initialAnimate={{
								scale: 0.2,
								opacity: 0,
								rotate: randomBetween(-100, 100),
							}}
							animate={{
								scale: 1,
								opacity: 1,
								rotate: 0,
							}}
							transition={{
								transform: { type: "spring" },
							}}
						>
							<Center className="w-full flex-row">
								<Center className="w-[50%] max-w-38 aspect-square rounded-full bg-success ring-8 ring-success/50">
									<Icon
										as={Check}
										className="w-[70%] h-[70%] text-success-foreground"
									/>
								</Center>
							</Center>
						</EaseView>

						<VStack space="md">
							<Heading size="3xl" className="text-center tracking-tight" bold>
								Kegiatan sudah dikirim
							</Heading>

							<Text size="lg" className="text-center opacity-70">
								{message}
							</Text>
						</VStack>
					</VStack>

					{onDelete && (
						<Button
							size="cta"
							variant="destructive"
							label="Hapus kegiatan"
							isLoading={isLoading}
							onPress={() => setShowDeleteModal(true)}
						/>
					)}

					<Button
						size="cta"
						label="Kembali ke halaman utama"
						onPress={() => goBack()}
					/>
				</>
			}
		/>
	);
};
