"use client";

import { useMemo } from "react";
import { BoundDiary } from "./index.binding.hook";

export interface SearchHookProps {
  diaries: BoundDiary[];
  searchValue: string;
}

export interface SearchHookReturn {
  filteredDiaries: BoundDiary[];
  hasSearchResults: boolean;
}

/**
 * 일기 검색 기능을 제공하는 hook
 * - 검색어가 title에 포함되는 일기를 필터링
 * - 대소문자 구분 없이 검색
 * - 빈 검색어일 경우 모든 일기 반환
 */
export const useDiariesSearch = ({
  diaries,
  searchValue,
}: SearchHookProps): SearchHookReturn => {
  const filteredDiaries = useMemo(() => {
    if (!searchValue.trim()) {
      return diaries;
    }

    const searchTerm = searchValue.trim().toLowerCase();

    return diaries.filter((diary) =>
      diary.title.toLowerCase().includes(searchTerm)
    );
  }, [diaries, searchValue]);

  const hasSearchResults = filteredDiaries.length > 0;

  return {
    filteredDiaries,
    hasSearchResults,
  };
};
