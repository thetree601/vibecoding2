"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Emotion, EMOTION_ASSETS } from "../../../commons/constants/enum";

export interface BoundDiaryDetail {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

/**
 * 다이나믹 라우팅된 [id]를 이용하여 로컬스토리지의 실제 데이터를 바인딩합니다.
 * - 저장소 key: "diaries"
 * - 타입: BoundDiaryDetail[]
 */
export const useDiariesDetailBinding = () => {
  const params = useParams();
  const [diary, setDiary] = useState<BoundDiaryDetail | null>(null);
  const [loaded, setLoaded] = useState(false);

  const loadDiary = useCallback(() => {
    const idParam = params?.id;
    const id =
      typeof idParam === "string" ? Number(idParam) : Number(idParam?.[0]);
    if (!Number.isFinite(id)) {
      setDiary(null);
      setLoaded(true);
      return;
    }

    try {
      const stored = localStorage.getItem("diaries");
      const diaries: BoundDiaryDetail[] = stored ? JSON.parse(stored) : [];
      const found = diaries.find((d) => d.id === id) ?? null;
      setDiary(found);
    } catch {
      setDiary(null);
    } finally {
      setLoaded(true);
    }
  }, [params]);

  useEffect(() => {
    loadDiary();
  }, [params, loadDiary]);

  // diaryUpdated 이벤트 리스너 추가
  useEffect(() => {
    const handleDiaryUpdate = () => {
      console.log("diaryUpdated 이벤트 수신, 데이터 다시 로드");
      loadDiary();
    };

    window.addEventListener("diaryUpdated", handleDiaryUpdate);
    return () => window.removeEventListener("diaryUpdated", handleDiaryUpdate);
  }, [params, loadDiary]);

  const emotionAsset = useMemo(() => {
    if (!diary) return null;
    return EMOTION_ASSETS[diary.emotion];
  }, [diary]);

  return {
    loaded,
    diary,
    emotionAsset,
  } as const;
};
