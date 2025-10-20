"use client";

import { useEffect, useMemo, useState } from "react";
import { Emotion, EMOTION_ASSETS } from "../../../commons/constants/enum";

export interface BoundDiary {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

export interface DiaryCardData {
  id: number;
  emotion: Emotion;
  date: string;
  title: string;
  image: string;
}

/**
 * 로컬스토리지의 실제 일기 데이터를 바인딩하여 일기 목록을 제공합니다.
 * - 저장소 key: "diaries"
 * - 타입: BoundDiary[]
 */
export const useDiariesBinding = () => {
  const [diaries, setDiaries] = useState<BoundDiary[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("diaries");
      const parsedDiaries: BoundDiary[] = stored ? JSON.parse(stored) : [];
      setDiaries(parsedDiaries);
    } catch (error) {
      console.error("Failed to load diaries from localStorage:", error);
      setDiaries([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  /**
   * 일기 데이터를 카드 형태로 변환합니다.
   * - 감정에 따른 이미지 매핑
   * - 날짜 포맷팅
   * - 제목 길이 제한 (카드 크기 초과시 "..." 처리)
   */
  const diaryCards = useMemo((): DiaryCardData[] => {
    return diaries.map((diary) => {
      const emotionAsset = EMOTION_ASSETS[diary.emotion];
      const createdDate = new Date(diary.createdAt);
      const formattedDate = createdDate
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\./g, ". ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\.$/, "");

      // 제목이 길 경우 "..." 처리 (카드 크기에 맞게 조정)
      const truncatedTitle =
        diary.title.length > 20
          ? diary.title.substring(0, 20) + "..."
          : diary.title;

      return {
        id: diary.id,
        emotion: diary.emotion,
        date: formattedDate,
        title: truncatedTitle,
        image: emotionAsset.icon.m,
      };
    });
  }, [diaries]);

  return {
    loaded,
    diaries,
    diaryCards,
  } as const;
};
