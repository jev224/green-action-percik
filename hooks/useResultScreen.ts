import { type ResultData, useResultStore } from "@/stores/result";
import { useNavigation } from "./useNavigation";

export function useResultScreen() {
	const { navigateToFeedback } = useNavigation();
	const { setResult } = useResultStore();

	const showResult = ({ type, ...props }: ResultData) => {
		setResult({ type, ...props });

		if (type === "success") {
			navigateToFeedback("/feedback/success");
		}

		if (type === "failed") {
			navigateToFeedback("/feedback/failed");
		}
	};

	return { showResult };
}
