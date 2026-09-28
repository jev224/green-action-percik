import type { ReactNode } from "react";
import {
	BottomPanel,
	Button,
	Screen,
	ScreenHeader,
} from "@/components/primitives";
import { BackButton } from "../nav/BackButton";
import { ActivitySubmittedScreen } from "./AlreadySubmittedScreen";

type Props = {
	title: string;
	submitted: boolean;
	submittedMessage: string;
	onDelete?: () => void;
	isLoading: boolean;
	initialLoading: boolean;
	onSubmit: () => void;
	children: ReactNode;
};

export function ActivitySubmissionScreen({
	title,
	submitted,
	submittedMessage,
	onDelete,
	isLoading,
	initialLoading,
	onSubmit,
	children,
}: Props) {
	if (submitted) {
		return (
			<ActivitySubmittedScreen
				initialLoading={initialLoading}
				isLoading={isLoading}
				onDelete={onDelete}
				message={submittedMessage}
			/>
		);
	}

	return (
		<Screen
			scrollable
			requiredInternet
			isLoading={initialLoading}
			headerComponent={
				<ScreenHeader title={title} leftComponent={<BackButton />} />
			}
			overlayComponent={
				<BottomPanel variant="ghost">
					<Button
						size="cta"
						label="Kirim"
						isLoading={isLoading}
						onPress={onSubmit}
						isDisabled={initialLoading}
					/>
				</BottomPanel>
			}
			contentComponent={children}
		/>
	);
}
