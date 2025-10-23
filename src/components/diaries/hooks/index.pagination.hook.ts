"use client";

import { useMemo } from "react";
import { BoundDiary } from "./index.binding.hook";

export interface PaginationHookProps {
  diaries: BoundDiary[];
  currentPage: number;
  itemsPerPage?: number;
}

export interface PaginationHookReturn {
  paginatedDiaries: BoundDiary[];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export function useDiariesPagination({
  diaries,
  currentPage,
  itemsPerPage = 12,
}: PaginationHookProps): PaginationHookReturn {
  const paginationData = useMemo(() => {
    const totalItems = diaries.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const paginatedDiaries = diaries.slice(startIndex, endIndex);

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
      paginatedDiaries,
      totalPages: Math.max(1, totalPages), // Ensure at least 1 page
      hasNextPage,
      hasPrevPage,
      startIndex,
      endIndex,
      totalItems,
    };
  }, [diaries, currentPage, itemsPerPage]);

  return paginationData;
}
