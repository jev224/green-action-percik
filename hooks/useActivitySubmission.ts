import { useCallback, useEffect, useState } from "react";
import { useResultScreen } from "@/hooks/useResultScreen";
import { useShowToast } from "@/hooks/useShowToast";
import { normalizeError } from "@/utils";
import { refreshOnNextNavigate } from "./useRefreshOnNavigate";

type BaseSubmittedInfo = { submitted: boolean };

type Options<T extends BaseSubmittedInfo> = {
	checkEnabled: boolean;
	checkSubmitted: () => Promise<T>;
	submit: () => Promise<void>;
	deleteSubmission: () => Promise<void>;
	isFulfilled: boolean;
	incompleteMessage?: string;
	successMessage: { title: string; subtitle: string };
	logLabel: string;
};

export function useActivitySubmission<T extends BaseSubmittedInfo>(
	{
		checkEnabled,
		checkSubmitted,
		submit,
		deleteSubmission,
		isFulfilled,
		incompleteMessage = "Yuk lengkapi semua kolom yang wajib diisi",
		successMessage,
		logLabel,
	}: Options<T>,
	deps: React.DependencyList,
) {
	const [isLoading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(false);
	const [submittedInfo, setSubmittedInfo] = useState<T | null>(null);

	const showToast = useShowToast();
	const { showResult } = useResultScreen();

	const reportError = useCallback(
		(e: unknown, action: string) => {
			const { uiMessage } = normalizeError(e, `${logLabel} ${action}`);
			showToast({ title: uiMessage });
		},
		[logLabel, showToast],
	);

	const handleSubmit = useCallback(async () => {
		if (!isFulfilled) {
			showToast({ title: incompleteMessage });
			return;
		}

		setLoading(true);

		try {
			await submit();
			showResult({ type: "success", ...successMessage });

			refreshOnNextNavigate();
		} catch (e) {
			reportError(e, "Submission");
		} finally {
			setLoading(false);
		}
	}, [
		isFulfilled,
		submit,
		showResult,
		successMessage,
		incompleteMessage,
		showToast,
		reportError,
	]);

	const handleDelete = useCallback(async () => {
		setLoading(true);

		try {
			await deleteSubmission();
			setSubmittedInfo(null);

			refreshOnNextNavigate();
		} catch (e) {
			reportError(e, "Deletion");
		} finally {
			setLoading(false);
		}
	}, [deleteSubmission, reportError]);

	useEffect(() => {
		if (!checkEnabled) return;
		(async () => {
			setInitialLoading(true);

			try {
				setSubmittedInfo(await checkSubmitted());
			} catch (e) {
				reportError(e, "Checker");
			} finally {
				setInitialLoading(false);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkEnabled, ...deps]);

	return {
		isLoading,
		initialLoading,
		submittedInfo,
		handleSubmit,
		handleDelete,
		setSubmittedInfo,
	};
}
