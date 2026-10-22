import type { ComponentProps, ReactNode } from "react";
import { View } from "react-native";
import { DialogPopIn, DialogPopOut } from "@/components/animation/presets";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import {
	Modal as GSModal,
	ModalBackdrop,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { IconButton } from "../Button/IconButton";

type ModalProps = {
	isOpen: boolean;
	icon?: ComponentProps<typeof Icon>["as"];
	onClose: () => void;
	title: string;
	description?: string;
	contentComponent?: ReactNode;
};

export const Modal = ({
	isOpen,
	onClose,
	icon,
	title,
	description,
	contentComponent,
}: ModalProps) => {
	return (
		<GSModal isOpen={isOpen} onClose={onClose} size="lg">
			<ModalBackdrop />

			<ModalContent
				className="max-w-100!"
				entering={DialogPopIn}
				exiting={DialogPopOut}
			>
				<View className="absolute right-6 top-6">
					<IconButton icon={CloseIcon} onPress={onClose} />
				</View>

				{icon && (
					<ModalHeader className="items-start max-w-[90%]">
						<Icon as={icon} className="w-18 h-18 mb-2 text-foreground/60" />
					</ModalHeader>
				)}

				{description && (
					<ModalBody className="max-w-[80%]">
						<Heading size="2xl" className="mb-3">
							{title}
						</Heading>

						<Text className="opacity-70">{description}</Text>
					</ModalBody>
				)}

				<ModalFooter>
					<VStack className="flex-1 mt-2" space="md">
						{contentComponent}
					</VStack>
				</ModalFooter>
			</ModalContent>
		</GSModal>
	);
};
