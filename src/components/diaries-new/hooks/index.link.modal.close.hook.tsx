"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useModal } from "../../../commons/providers/modal/modal.provider";
import { Modal } from "../../../commons/components/modal";

/**
 * 일기쓰기 모달의 닫기 기능을 처리하는 훅
 *
 * 닫기 버튼 클릭 시 등록취소 모달을 2중 모달로 표시하고,
 * 등록취소 모달 내부의 버튼들을 통해 모달 상태를 관리합니다.
 */
export const useDiariesNewModalClose = () => {
  const { closeModal, addToStack, removeFromStack } = useModal();
  const [showCancelModal, setShowCancelModal] = useState(false);

  /**
   * 닫기 버튼 클릭 핸들러
   * 등록취소 모달을 2중 모달로 표시합니다.
   */
  const handleCloseClick = useCallback((): void => {
    setShowCancelModal(true);
  }, []);

  /**
   * 계속 작성 버튼 클릭 핸들러
   * 등록취소 모달(자식)만 종료합니다.
   */
  const handleContinueWriting = useCallback((): void => {
    setShowCancelModal(false);
    removeFromStack();
  }, [removeFromStack]);

  /**
   * 등록 취소 버튼 클릭 핸들러
   * 등록취소 모달(자식)과 일기쓰기폼모달(부모)를 모두 종료합니다.
   */
  const handleCancelRegistration = useCallback((): void => {
    setShowCancelModal(false);
    removeFromStack();
    closeModal(); // 일기쓰기폼모달(부모) 종료
  }, [removeFromStack, closeModal]);

  // 중첩 모달을 스택에 추가/제거
  useEffect(() => {
    if (showCancelModal) {
      const cancelModalComponent = (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Modal
            variant="info"
            actions="dual"
            title="일기등록 취소"
            content="작성 중인 일기가 있습니다. 정말 취소하시겠습니까?"
            dualActionFirstText="계속 작성"
            dualActionSecondText="등록 취소"
            onDualActionFirst={handleContinueWriting}
            onDualActionSecond={handleCancelRegistration}
          />
        </div>
      );
      addToStack(cancelModalComponent);
    }
  }, [
    showCancelModal,
    addToStack,
    handleContinueWriting,
    handleCancelRegistration,
  ]);

  // 등록취소 모달 컴포넌트 (이제 스택에서 관리됨)
  const CancelModal = (): JSX.Element | null => {
    return null; // 스택에서 관리되므로 여기서는 null 반환
  };

  return {
    handleCloseClick,
    CancelModal,
  };
};
