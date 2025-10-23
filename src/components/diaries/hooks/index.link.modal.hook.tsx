"use client";

import { useModal } from "../../../commons/providers/modal/modal.provider";
import { useAuthGuard } from "../../../commons/providers/auth/auth.guard.hook";
import DiariesNew from "../../diaries-new";

export const useDiaryModal = () => {
  const { openModal, closeModal } = useModal();
  const { checkPermission } = useAuthGuard();

  const openDiaryModal = () => {
    // 권한 검증 후 모달 열기
    if (checkPermission()) {
      openModal(<DiariesNew />);
    }
  };

  const closeDiaryModal = () => {
    closeModal();
  };

  return {
    openDiaryModal,
    closeDiaryModal,
  };
};
