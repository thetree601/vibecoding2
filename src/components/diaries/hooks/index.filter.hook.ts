"use client";

import { useMemo } from "react";
import { BoundDiary } from "./index.binding.hook";
import { Emotion } from "../../../commons/constants/enum";

export interface FilterHookProps {
  diaries: BoundDiary[];
  filterValue: string;
}

export interface FilterHookReturn {
  filteredDiaries: BoundDiary[];
  hasFilterResults: boolean;
}

/**
 * 일기 감정 필터 기능을 제공하는 hook
 * - 선택된 감정에 따라 일기를 필터링
 * - "all" 선택시 모든 일기 반환
 * - 특정 감정 선택시 해당 감정의 일기만 반환
 */
export const useDiariesFilter = ({
  diaries,
  filterValue,
}: FilterHookProps): FilterHookReturn => {
  const filteredDiaries = useMemo(() => {
    if (filterValue === "all") {
      return diaries;
    }

    // filterValue가 유효한 Emotion enum 값인지 확인
    const validEmotions = Object.values(Emotion);
    if (!validEmotions.includes(filterValue as Emotion)) {
      return diaries;
    }

    return diaries.filter((diary) => diary.emotion === filterValue);
  }, [diaries, filterValue]);

  const hasFilterResults = filteredDiaries.length > 0;

  return {
    filteredDiaries,
    hasFilterResults,
  };
};
