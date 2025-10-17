"use client";

import { useModal } from "../../../commons/providers/modal/modal.provider";
import DiariesNew from "../../diaries-new";

export const useDiaryModal = () => {
  const { openModal, closeModal } = useModal();

  const openDiaryModal = () => {
    openModal(<DiariesNew />);
  };

  const closeDiaryModal = () => {
    closeModal();
  };

  return {
    openDiaryModal,
    closeDiaryModal,
  };
};
