"use client";

import { useAuth } from "@/commons/providers/auth/auth.provider";
import { useRouter } from "next/navigation";
import { URLS } from "@/commons/constants/url";

/**
 * Layout에서 사용하는 인증 관련 훅
 * 로그인 상태에 따른 UI 분기 로직을 담당
 */
export function useAuthLayout() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  // 디버깅을 위한 로그
  console.log("useAuthLayout - isLoggedIn:", isLoggedIn);
  console.log("useAuthLayout - user:", user);

  /**
   * 로그인 버튼 클릭 핸들러
   * 로그인 페이지로 이동
   */
  const handleLoginClick = () => {
    router.push(URLS.AUTH.LOGIN);
  };

  /**
   * 로그아웃 버튼 클릭 핸들러
   * 인증 프로바이더의 logout 함수 호출
   */
  const handleLogoutClick = () => {
    logout();
  };

  /**
   * 로그인 상태에 따른 UI 표시 여부
   */
  const showLoginButton = !isLoggedIn;
  const showUserInfo = isLoggedIn && user;

  // 디버깅을 위한 로그
  console.log("useAuthLayout - showLoginButton:", showLoginButton);
  console.log("useAuthLayout - showUserInfo:", showUserInfo);

  return {
    // 인증 상태
    isLoggedIn,
    user,

    // UI 표시 여부
    showLoginButton,
    showUserInfo,

    // 이벤트 핸들러
    handleLoginClick,
    handleLogoutClick,
  };
}
