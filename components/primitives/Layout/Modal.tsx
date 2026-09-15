import type { ReactNode } from "react";
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

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	contentComponent?: ReactNode;
};

export const Modal = ({
	isOpen,
	onClose,
	title,
	description,
	contentComponent,
}: ModalProps) => {
	return (
		<GSModal isOpen={isOpen} onClose={onClose} size="lg">
			<ModalBackdrop />

			<ModalContent entering={DialogPopIn} exiting={DialogPopOut}>
				<ModalHeader>
					<Heading size="lg">{title}</Heading>

					<ModalCloseButton>
						<Icon as={CloseIcon} />
					</ModalCloseButton>
				</ModalHeader>

				{description && (
					<ModalBody>
						<Text>{description}</Text>
					</ModalBody>
				)}

				<ModalFooter>{contentComponent}</ModalFooter>
			</ModalContent>
		</GSModal>
	);
};
