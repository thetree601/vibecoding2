"use client";

import React, { useEffect, useState, ReactNode, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "./auth.provider";
import { useModal } from "../modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { urlUtils, URLS } from "@/commons/constants/url";

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * AuthGuard 컴포넌트
 *
 * 페이지 접근 권한을 검증하는 가드 컴포넌트입니다.
 * 테스트 환경과 실제 환경을 구분하여 권한 검증을 수행합니다.
 *
 * @example
 * ```tsx
 * <AuthGuard>
 *   <ProtectedPage />
 * </AuthGuard>
 * ```
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const pathname = usePathname();

  // 루트 경로는 즉시 인증 완료 상태로 설정
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [hasShownLoginModal, setHasShownLoginModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const router = useRouter();
  const { isLoggedIn, checkAuthStatus } = useAuth();
  const { openModal, closeModal } = useModal();

  // 테스트 환경 변수 확인
  const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === "test";

  /**
   * 로그인 모달 확인 버튼 클릭 핸들러
   * 모든 모달을 닫고 로그인 페이지로 이동합니다.
   */
  const handleLoginModalConfirm = useCallback(() => {
    closeModal();
    router.push(URLS.AUTH.LOGIN);
  }, [closeModal, router]);

  /**
   * 로그인 필요 모달 표시
   * 권한이 없는 사용자에게 로그인을 요구하는 모달을 표시합니다.
   */
  const showLoginRequiredModal = useCallback(() => {
    openModal(
      <Modal
        variant="info"
        actions="single"
        title="로그인해주세요"
        content="이 페이지에 접근하려면 로그인이 필요합니다."
        singleActionText="확인"
        onSingleAction={handleLoginModalConfirm}
      />
    );
  }, [openModal, handleLoginModalConfirm]);

  /**
   * 페이지 접근 권한 검증
   * 테스트 환경과 실제 환경을 구분하여 권한을 검증합니다.
   */
  useEffect(() => {
    const authorize = async () => {
      try {
        // 루트 경로는 리다이렉트만 수행하므로 인증 검사 생략
        if (pathname === "/") {
          setIsAuthorizing(false);
          setIsAuthorized(true);
          return;
        }

        // AuthProvider 초기화 대기
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 테스트 환경에서는 모든 페이지에 접근 가능
        if (isTestEnv) {
          setIsAuthorizing(false);
          setIsAuthorized(true);
          return;
        }

        // 실제 환경에서는 로그인 상태 확인
        const currentAuthStatus = checkAuthStatus();
        const hasAccess = urlUtils.checkAccess(pathname, currentAuthStatus);

        if (hasAccess) {
          setIsAuthorizing(false);
          setIsAuthorized(true);
        } else {
          // 접근 권한이 없으면 빈 화면을 유지하고 로그인 모달 표시
          setIsAuthorizing(false);
          setIsAuthorized(false);
          if (!hasShownLoginModal) {
            setHasShownLoginModal(true);
            showLoginRequiredModal();
          }
        }
      } catch (error) {
        console.error("AuthGuard authorization error:", error);
        setIsAuthorizing(false);
        setIsAuthorized(false);
      }
    };

    authorize();
  }, [
    pathname,
    isLoggedIn,
    isTestEnv,
    hasShownLoginModal,
    checkAuthStatus,
    showLoginRequiredModal,
  ]);

  /**
   * 경로 변경 시 상태 리셋
   * 새로운 경로로 이동할 때 인증 상태를 초기화합니다.
   */
  useEffect(() => {
    // 루트 경로가 아닌 경우에만 인증 검사 시작
    if (pathname !== "/") {
      setIsAuthorizing(true);
      setIsAuthorized(false);
      setHasShownLoginModal(false);
    }
  }, [pathname]);

  // 인증 중이면 빈 화면 표시
  if (isAuthorizing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">인증 중...</p>
        </div>
      </div>
    );
  }

  // 인가 실패 시 빈 화면 유지
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-sm text-gray-600">접근 권한이 없습니다.</p>
        </div>
      </div>
    );
  }

  // 인증 완료 후 children 렌더링
  return <>{children}</>;
};

export default AuthGuard;
