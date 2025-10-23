"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "./auth.provider";
import { useModal } from "../modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { urlUtils, URLS } from "@/commons/constants/url";

/**
 * 권한 검증을 위한 훅
 *
 * 함수 요청 시점에 권한을 검증하고, 권한이 없는 경우 로그인 모달을 표시합니다.
 * 테스트 환경과 실제 환경을 구분하여 권한 검증을 수행합니다.
 *
 * @example
 * ```tsx
 * const { checkPermission } = useAuthGuard();
 *
 * const handleProtectedAction = () => {
 *   if (checkPermission()) {
 *     // 권한이 있는 경우 실행할 로직
 *   }
 * };
 * ```
 */
export const useAuthGuard = () => {
  const [hasShownLoginModal, setHasShownLoginModal] = useState(false);
  const router = useRouter();
  const { isLoggedIn, checkAuthStatus } = useAuth();
  const { openModal, closeModal } = useModal();

  // 테스트 환경 변수 확인
  const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === "test";

  // 테스트 환경에서는 기본적으로 로그인 검사 패스
  // 비회원 가드테스트가 필요한 경우에만 __TEST_BYPASS__를 false로 설정
  const shouldBypassAuth =
    isTestEnv &&
    (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ !==
      false;

  /**
   * 로그인 모달 확인 버튼 클릭 핸들러
   * 모든 모달을 닫고 로그인 페이지로 이동합니다.
   */
  const handleLoginModalConfirm = useCallback(() => {
    closeModal();
    setHasShownLoginModal(false);
    router.push(URLS.AUTH.LOGIN);
  }, [closeModal, router]);

  /**
   * 로그인 모달 취소 버튼 클릭 핸들러
   * 모든 모달을 닫습니다.
   */
  const handleLoginModalCancel = useCallback(() => {
    closeModal();
    setHasShownLoginModal(false);
  }, [closeModal]);

  /**
   * 로그인하시겠습니까 모달 표시
   * 권한이 없는 사용자에게 로그인을 요구하는 모달을 표시합니다.
   */
  const showLoginRequiredModal = useCallback(() => {
    openModal(
      <Modal
        variant="info"
        actions="dual"
        title="로그인하시겠습니까?"
        content="이 기능을 사용하려면 로그인이 필요합니다."
        dualActionFirstText="로그인하러가기"
        dualActionSecondText="취소"
        onDualActionFirst={handleLoginModalConfirm}
        onDualActionSecond={handleLoginModalCancel}
      />
    );
  }, [openModal, handleLoginModalConfirm, handleLoginModalCancel]);

  /**
   * 권한 검증 함수
   *
   * @param requireAuth - 인증이 필요한지 여부 (기본값: true)
   * @returns 권한이 있는 경우 true, 없는 경우 false
   */
  const checkPermission = useCallback(
    (requireAuth: boolean = true): boolean => {
      // 인증이 필요하지 않은 경우 항상 통과
      if (!requireAuth) {
        return true;
      }

      // 테스트 환경에서 패스 설정이 되어있으면 항상 통과
      if (shouldBypassAuth) {
        return true;
      }

      // 실제 환경에서는 로그인 상태 확인
      const currentAuthStatus = checkAuthStatus();

      if (currentAuthStatus) {
        return true;
      }

      // 권한이 없는 경우 모달 표시 (한 번만)
      if (!hasShownLoginModal) {
        setHasShownLoginModal(true);
        showLoginRequiredModal();
      }

      return false;
    },
    [
      shouldBypassAuth,
      checkAuthStatus,
      hasShownLoginModal,
      showLoginRequiredModal,
    ]
  );

  /**
   * 특정 경로에 대한 접근 권한 검증
   *
   * @param path - 검증할 경로
   * @returns 접근 가능한 경우 true, 불가능한 경우 false
   */
  const checkPathAccess = useCallback(
    (path: string): boolean => {
      // 테스트 환경에서 패스 설정이 되어있으면 항상 통과
      if (shouldBypassAuth) {
        return true;
      }

      // 실제 환경에서는 로그인 상태와 경로별 권한 확인
      const currentAuthStatus = checkAuthStatus();
      const hasAccess = urlUtils.checkAccess(path, currentAuthStatus);

      if (!hasAccess && !hasShownLoginModal) {
        setHasShownLoginModal(true);
        showLoginRequiredModal();
      }

      return hasAccess;
    },
    [
      shouldBypassAuth,
      checkAuthStatus,
      hasShownLoginModal,
      showLoginRequiredModal,
    ]
  );

  /**
   * 모달 상태 리셋
   * 새로운 권한 검증을 위해 모달 상태를 초기화합니다.
   */
  const resetModalState = useCallback(() => {
    setHasShownLoginModal(false);
  }, []);

  // 컴포넌트 언마운트 시 모달 상태 리셋
  useEffect(() => {
    return () => {
      setHasShownLoginModal(false);
    };
  }, []);

  return {
    checkPermission,
    checkPathAccess,
    resetModalState,
    isLoggedIn,
    shouldBypassAuth,
  };
};

export default useAuthGuard;
