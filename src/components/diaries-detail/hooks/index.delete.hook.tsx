"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "../../../commons/providers/modal/modal.provider";
import { Modal } from "../../../commons/components/modal";
import { Emotion } from "../../../commons/constants/enum";

export interface Diary {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

export const useDiaryDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const deleteDiary = async (diaryId: number) => {
    try {
      setIsDeleting(true);

      // 로컬스토리지에서 일기 데이터 가져오기
      const diariesData = localStorage.getItem("diaries");
      if (!diariesData) {
        throw new Error("일기 데이터를 찾을 수 없습니다.");
      }

      const diaries: Diary[] = JSON.parse(diariesData);

      // 해당 일기 제거
      const updatedDiaries = diaries.filter((diary) => diary.id !== diaryId);

      // 로컬스토리지에 업데이트된 데이터 저장
      localStorage.setItem("diaries", JSON.stringify(updatedDiaries));

      // 모달 닫기
      closeModal();

      // /diaries 페이지로 이동
      router.push("/diaries");
    } catch (error) {
      console.error("일기 삭제 중 오류가 발생했습니다:", error);
      alert("일기 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (diaryId: number) => {
    const modalContent = (
      <Modal
        variant="danger"
        actions="dual"
        title="일기 삭제"
        content="일기를 삭제 하시겠어요?"
        dualActionFirstText="취소"
        dualActionSecondText="삭제"
        onDualActionFirst={closeModal}
        onDualActionSecond={() => deleteDiary(diaryId)}
      />
    );
    openModal(modalContent);
  };

  return {
    isDeleting,
    openDeleteModal,
    deleteDiary,
  };
};
