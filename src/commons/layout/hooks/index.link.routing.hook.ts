"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { URLS } from "@/commons/constants/url";

/**
 * Layout 컴포넌트의 링크 라우팅 기능을 제공하는 훅
 * 헤더 로고와 네비게이션 탭의 클릭 이벤트를 처리하고 활성 상태를 관리
 */
export const useLinkRouting = () => {
  const router = useRouter();
  const pathname = usePathname();

  // 하이드레이션 불일치 방지를 위한 상태 관리
  const [isDiariesActive, setIsDiariesActive] = useState(false);
  const [isPicturesActive, setIsPicturesActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 활성 상태 계산
  useEffect(() => {
    setIsMounted(true);
    setIsDiariesActive(pathname === URLS.DIARIES.LIST);
    setIsPicturesActive(pathname === URLS.PICTURES.LIST);
  }, [pathname]);

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

  return {
    handleLogoClick,
    handleDiariesClick,
    handlePicturesClick,
    isDiariesActive: isMounted ? isDiariesActive : false,
    isPicturesActive: isMounted ? isPicturesActive : false,
  };
};
