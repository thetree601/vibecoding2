"use client";

import React, { useState } from "react";
import { useModal } from "../../../commons/providers/modal/modal.provider";
import { Modal } from "../../../commons/components/modal";

/**
 * 일기쓰기 모달의 닫기 기능을 처리하는 훅
 *
 * 닫기 버튼 클릭 시 등록취소 모달을 2중 모달로 표시하고,
 * 등록취소 모달 내부의 버튼들을 통해 모달 상태를 관리합니다.
 */
export const useDiariesNewModalClose = () => {
  const { closeModal } = useModal();
  const [showCancelModal, setShowCancelModal] = useState(false);

  /**
   * 닫기 버튼 클릭 핸들러
   * 등록취소 모달을 2중 모달로 표시합니다.
   */
  const handleCloseClick = (): void => {
    setShowCancelModal(true);
  };

  /**
   * 계속 작성 버튼 클릭 핸들러
   * 등록취소 모달(자식)만 종료합니다.
   */
  const handleContinueWriting = (): void => {
    setShowCancelModal(false);
  };

  /**
   * 등록 취소 버튼 클릭 핸들러
   * 등록취소 모달(자식)과 일기쓰기폼모달(부모)를 모두 종료합니다.
   */
  const handleCancelRegistration = (): void => {
    setShowCancelModal(false);
    closeModal(); // 일기쓰기폼모달(부모) 종료
  };

  // 등록취소 모달 컴포넌트 (진짜 중첩 모달)
  const CancelModal = (): JSX.Element | null => {
    if (!showCancelModal) return null;

    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
        <Modal
          variant="info"
          actions="dual"
          title="등록 취소"
          content="작성 중인 일기가 있습니다. 정말 취소하시겠습니까?"
          dualActionFirstText="계속 작성"
          dualActionSecondText="등록 취소"
          onDualActionFirst={handleContinueWriting}
          onDualActionSecond={handleCancelRegistration}
        />
      </div>
    );
  };

  return {
    handleCloseClick,
    CancelModal,
  };
};
