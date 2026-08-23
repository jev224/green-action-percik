import { useEffect, useRef, useState, useCallback } from "react";

interface UseAsyncDataResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [reloadIndex, setReloadIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const result = await fetcher();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setIsError(true);
          setError(err);
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
  }, [...deps, reloadIndex]);

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
      const result = await fetcherRef.current();
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

  return { data, isLoading, isError, error, refetch, isRefreshing, refresh };
}
