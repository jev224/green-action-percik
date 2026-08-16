import { useMemo } from "react";
import Fuse, { type IFuseOptions } from "fuse.js";

export function useFuzzySearch<T>(
  data: T[],
  keys: string[],
  query: string,
  options?: IFuseOptions<T>,
) {
  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys,
        threshold: 0.35,
        ignoreLocation: true,
        ...options,
      }),
    [data, keys, options],
  );

  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return data;
    return fuse.search(trimmed).map((result) => result.item);
  }, [fuse, query, data]);
}
