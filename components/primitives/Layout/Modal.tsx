import type { ComponentProps, ReactNode } from "react";
import { View } from "react-native";
import { DialogPopIn, DialogPopOut } from "@/components/animation/presets";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import {
	Modal as GSModal,
	ModalBackdrop,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

type ModalProps = {
	vertical?: boolean;
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
	vertical,
}: ModalProps) => {
	return (
		<GSModal isOpen={isOpen} onClose={onClose} size="lg">
			<ModalBackdrop />

			<ModalContent
				entering={DialogPopIn}
				exiting={DialogPopOut}
				className={vertical ? "max-w-98!" : undefined}
			>
				<ModalHeader className="items-start">
					{icon && (
						<Icon as={icon} className="w-18 h-18 mb-2 text-foreground/60" />
					)}

					{!vertical ? (
						<Heading size="lg">{title}</Heading>
					) : (
						<View className="flex-1" />
					)}

					<ModalCloseButton>
						<Icon as={CloseIcon} />
					</ModalCloseButton>
				</ModalHeader>

				{description && (
					<ModalBody>
						{vertical && (
							<Heading size="2xl" className="mb-3">
								{title}
							</Heading>
						)}

						<Text className="opacity-70">{description}</Text>
					</ModalBody>
				)}

				<ModalFooter>
					{vertical ? (
						<VStack className="flex-1 mt-2" space="md">
							{contentComponent}
						</VStack>
					) : (
						contentComponent
					)}
				</ModalFooter>
			</ModalContent>
		</GSModal>
	);
};
