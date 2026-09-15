import { type ResultData, useResultStore } from "@/stores/result";
import { useNavigation } from "./useNavigation";

export function useResultScreen() {
	const { navigateTo } = useNavigation();
	const { setResult } = useResultStore();

	const showResult = ({ type, ...props }: ResultData) => {
		setResult({ type, ...props });

		if (type === "success") {
			navigateTo("/feedback/success");
		}

		if (type === "failed") {
			navigateTo("/feedback/failed");
		}
	};

	return { showResult };
}
