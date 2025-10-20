"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

type DogApiResponse = {
  message: string[];
  status: string;
};

const PAGE_SIZE = 6;

async function fetchDogImages(): Promise<string[]> {
  const res = await fetch(
    "https://dog.ceo/api/breeds/image/random/" + PAGE_SIZE,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch dog images");
  }
  const json = (await res.json()) as DogApiResponse;
  if (!Array.isArray(json.message)) {
    throw new Error("Invalid response shape");
  }
  return json.message;
}

export interface UsePicturesBindingResult {
  images: string[];
  isInitialLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  sentinelRef: React.RefObject<HTMLDivElement>;
  refetch: () => void;
}

export function usePicturesBinding(): UsePicturesBindingResult {
  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<{ page: number; items: string[] }, Error>({
    queryKey: ["pictures", "dogs"],
    queryFn: async ({ pageParam }) => {
      const items = await fetchDogImages();
      return { page: (pageParam as number) ?? 0, items };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.page + 1,
    staleTime: 0,
  });

  const images = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.items),
    [data]
  );

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      if (isFetchingNextPage) return;
      // We allow infinite since API returns randoms each time
      if (hasNextPage ?? true) {
        void fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px 0px 800px 0px", // Trigger when 2 items (2 * 640px + gap) remaining
      threshold: 0.1,
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleIntersect]);

  useEffect(() => {
    // If list grows/shrinks, ensure observer still targets the sentinel
    if (!sentinelRef.current) return;
  }, [images.length]);

  return {
    images,
    isInitialLoading: isLoading,
    isError,
    errorMessage: isError ? error?.message ?? "Unknown error" : null,
    sentinelRef,
    refetch,
  };
}

export default usePicturesBinding;
