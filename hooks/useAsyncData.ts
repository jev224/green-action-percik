import { useCallback, useEffect, useRef, useState } from "react";
import type {
	ProfileByRole,
	UserRole,
} from "@/services/fetcher/account/profile";
import { normalizeError } from "@/utils";
import type { useUserProfile } from "./useUser";

interface UseAsyncDataResult<T> {
	data: T | null;
	isLoading: boolean;
	isError: boolean;
	error: unknown;
	errorMessage: string;
	refetch: () => void;
	isRefreshing: boolean;
	refresh: () => Promise<void>;
}

type UserProfileReturn<R extends UserRole> = ReturnType<
	typeof useUserProfile<R>
>;

export function useAsyncData<T, R extends UserRole = UserRole>(
	fetcher: (profile?: ProfileByRole<R> | null) => Promise<T>,
	userProfileHook?: UserProfileReturn<R>,
	deps: React.DependencyList = [],
): UseAsyncDataResult<T> {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<unknown>(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [reloadIndex, setReloadIndex] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const profile = userProfileHook?.profile;
	const profileError = !!userProfileHook?.isError;
	const profileLoading = !!userProfileHook?.isLoading;

	const userProfileRef = useRef(userProfileHook);
	useEffect(() => {
		userProfileRef.current = userProfileHook;
	});

	// Tracks overall mount state for the standalone `refresh()` below,
	// which runs outside the main effect's own isMounted closure.
	const isMountedRef = useRef(true);
	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	// Keep the latest fetcher in a ref so `refresh` stays a stable callback
	// even if `fetcher` is an inline arrow function that changes every render.
	const fetcherRef = useRef(fetcher);
	useEffect(() => {
		fetcherRef.current = fetcher;
	});

	useEffect(() => {
		let isMounted = true;

		const run = async () => {
			try {
				if (userProfileRef.current?.isError) {
					throw new Error();
				}

				setIsLoading(true);
				setIsError(false);
				setError(null);

				if (userProfileRef.current?.isLoading) return;
				if (userProfileRef.current && !userProfileRef.current.profile) return;

				const result = await fetcher(userProfileRef.current?.profile);
				if (isMounted) {
					setData(result);
				}
			} catch (err) {
				if (isMounted) {
					const { uiMessage } = normalizeError(err, "Data Fetcher");
					setErrorMessage(uiMessage);
					setIsError(true);
					setError(err);
					setData(null);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		run();

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, reloadIndex, profile, profileError, profileLoading]);

	const refetch = useCallback(() => {
		setReloadIndex((i) => i + 1);
	}, []);

	// For pull-to-refresh: re-fetches in the background without touching
	// `isLoading`, so existing `data` stays rendered under the native
	// RefreshControl spinner instead of being swapped for a loading state.
	const refresh = useCallback(async () => {
		setIsRefreshing(true);
		setIsError(false);
		setError(null);

		try {
			if (userProfileRef.current?.isError) {
				await userProfileRef.current?.revalidate?.();
				return;
			}

			const result = await fetcherRef.current(userProfileRef.current?.profile);
			if (userProfileRef.current && !userProfileRef.current.profile) return;

			if (isMountedRef.current) {
				setData(result);
			}
		} catch (err) {
			if (isMountedRef.current) {
				setIsError(true);
				setError(err);
			}
		} finally {
			if (isMountedRef.current) {
				setIsRefreshing(false);
			}
		}
	}, []);

	return {
		data,
		isLoading,
		isError,
		error,
		errorMessage,
		refetch,
		isRefreshing,
		refresh,
	};
}
