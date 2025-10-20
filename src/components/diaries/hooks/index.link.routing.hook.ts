"use client";

import { useRouter } from "next/navigation";
import { URLS } from "../../../commons/constants/url";

/**
 * 일기 카드의 라우팅을 담당하는 훅
 * - 카드 클릭 시 상세 페이지로 이동
 * - 삭제 버튼 클릭 시 페이지 이동을 방지
 */
export const useDiariesLinkRouting = () => {
  const router = useRouter();

  const handleCardClick = (id: number | string) => {
    router.push(URLS.DIARIES.DETAIL(id));
  };

  const handleDeleteClick: React.MouseEventHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return {
    handleCardClick,
    handleDeleteClick,
  } as const;
};
