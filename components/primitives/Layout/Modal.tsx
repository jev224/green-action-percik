import { ReactNode } from "react";

import {
  Modal as GSModal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { CloseIcon } from "@/components/ui/icon";
import { DialogPopIn, DialogPopOut } from "@/components/animation/presets";

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
