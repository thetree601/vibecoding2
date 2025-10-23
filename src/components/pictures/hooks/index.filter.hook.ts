"use client";

import { useCallback, useMemo, useState } from "react";

export type FilterOption = "default" | "landscape" | "portrait";

export interface FilterSize {
  width: number;
  height: number;
}

export interface UseFilterResult {
  selectedFilter: FilterOption;
  setSelectedFilter: (filter: FilterOption) => void;
  filterSize: FilterSize;
  filterOptions: Array<{
    label: string;
    value: FilterOption;
  }>;
}

const FILTER_SIZES: Record<FilterOption, FilterSize> = {
  default: { width: 640, height: 640 },
  landscape: { width: 640, height: 480 },
  portrait: { width: 480, height: 640 },
};

export function useFilter(): UseFilterResult {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("default");

  const filterSize = useMemo(() => {
    return FILTER_SIZES[selectedFilter];
  }, [selectedFilter]);

  const filterOptions = useMemo(
    () => [
      { label: "기본", value: "default" as FilterOption },
      { label: "가로형", value: "landscape" as FilterOption },
      { label: "세로형", value: "portrait" as FilterOption },
    ],
    []
  );

  const handleSetSelectedFilter = useCallback((filter: FilterOption) => {
    setSelectedFilter(filter);
  }, []);

  return {
    selectedFilter,
    setSelectedFilter: handleSetSelectedFilter,
    filterSize,
    filterOptions,
  };
}

export default useFilter;
