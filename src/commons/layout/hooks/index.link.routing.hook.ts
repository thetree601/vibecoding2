"use client";

import { usePathname, useRouter } from "next/navigation";
import { URLS } from "@/commons/constants/url";

/**
 * Layout 컴포넌트의 링크 라우팅 기능을 제공하는 훅
 * 헤더 로고와 네비게이션 탭의 클릭 이벤트를 처리하고 활성 상태를 관리
 */
export const useLinkRouting = () => {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * 헤더 로고 클릭 시 일기 목록 페이지로 이동
   */
  const handleLogoClick = () => {
    router.push(URLS.DIARIES.LIST);
  };

  /**
   * 일기보관함 탭 클릭 시 일기 목록 페이지로 이동
   */
  const handleDiariesClick = () => {
    router.push(URLS.DIARIES.LIST);
  };

  /**
   * 사진보관함 탭 클릭 시 사진 목록 페이지로 이동
   */
  const handlePicturesClick = () => {
    router.push(URLS.PICTURES.LIST);
  };

  /**
   * 현재 경로가 일기보관함 탭과 일치하는지 확인
   */
  const isDiariesActive = pathname === URLS.DIARIES.LIST;

  /**
   * 현재 경로가 사진보관함 탭과 일치하는지 확인
   */
  const isPicturesActive = pathname === URLS.PICTURES.LIST;

  return {
    handleLogoClick,
    handleDiariesClick,
    handlePicturesClick,
    isDiariesActive,
    isPicturesActive,
  };
};
