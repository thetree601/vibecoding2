"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export interface Retrospect {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 다이나믹 라우팅된 [id]를 이용하여 로컬스토리지의 회고 데이터를 바인딩합니다.
 * - 저장소 key: "retrospects"
 * - 타입: Retrospect[]
 * - 필터링: diaryId가 [id]와 일치하는 객체들만 반환
 */
export const useRetrospectBinding = () => {
  const params = useParams();
  const [retrospects, setRetrospects] = useState<Retrospect[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const idParam = params?.id;
    const diaryId =
      typeof idParam === "string" ? Number(idParam) : Number(idParam?.[0]);

    if (!Number.isFinite(diaryId)) {
      setRetrospects([]);
      setLoaded(true);
      return;
    }

    const loadRetrospects = () => {
      try {
        const stored = localStorage.getItem("retrospects");
        const allRetrospects: Retrospect[] = stored ? JSON.parse(stored) : [];

        // diaryId가 일치하는 회고만 필터링
        const diaryRetrospects = allRetrospects.filter(
          (r) => r.diaryId === diaryId
        );
        setRetrospects(diaryRetrospects);
      } catch (error) {
        console.error("회고 데이터 로드 중 오류:", error);
        setRetrospects([]);
      } finally {
        setLoaded(true);
      }
    };

    // 초기 로드
    loadRetrospects();

    // 커스텀 이벤트로 회고 업데이트 감지
    const handleRetrospectsUpdate = () => {
      loadRetrospects();
    };

    window.addEventListener("retrospectsUpdated", handleRetrospectsUpdate);

    return () => {
      window.removeEventListener("retrospectsUpdated", handleRetrospectsUpdate);
    };
  }, [params]);

  return {
    retrospects,
    loaded,
  } as const;
};
