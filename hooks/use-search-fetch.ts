/* eslint-disable react-hooks/refs */
"use client";

import { useEffect, useRef } from "react";

function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function useSearchFetch<T>({
  search,
  fetchDefault,
  fetchSearch,
  onSuccess,
  startTransition,
  trigger,
}: {
  search: string;
  fetchDefault: () => Promise<T>;
  fetchSearch: (search: string) => Promise<T>;
  onSuccess: (data: T) => void;
  startTransition: React.TransitionStartFunction;
  trigger?: unknown;
}) {
  const prevSearch = usePrevious(search);

  useEffect(() => {
    if (prevSearch === search && !trigger) return;

    startTransition(async () => {
      const result = search ? await fetchSearch(search) : await fetchDefault();
      onSuccess(result);
    });
  }, [search, prevSearch, startTransition, fetchSearch, fetchDefault, onSuccess, trigger]);
}
