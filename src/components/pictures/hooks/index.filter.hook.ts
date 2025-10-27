"use client";

import { useCallback, useMemo, useState, useEffect } from "react";

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

const FILTER_SIZES_DESKTOP: Record<FilterOption, FilterSize> = {
  default: { width: 640, height: 640 },
  landscape: { width: 640, height: 480 },
  portrait: { width: 480, height: 640 },
};

const FILTER_SIZES_MOBILE: Record<FilterOption, FilterSize> = {
  default: { width: 280, height: 280 },
  landscape: { width: 280, height: 210 },
  portrait: { width: 280, height: 372 },
};

export function usePicturesFilter(): UseFilterResult {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("default");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const filterSize = useMemo(() => {
    const sizes = isMobile ? FILTER_SIZES_MOBILE : FILTER_SIZES_DESKTOP;
    return sizes[selectedFilter];
  }, [selectedFilter, isMobile]);

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

export default usePicturesFilter;
