"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Emotion } from "../../../commons/constants/enum";
import { URLS } from "../../../commons/constants/url";
import { useModal } from "../../../commons/providers/modal/modal.provider";
import { Modal } from "../../../commons/components/modal";

// Zod schema for form validation
const diaryFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  emotion: z.nativeEnum(Emotion),
});

export type DiaryFormData = z.infer<typeof diaryFormSchema>;

// Diary data type for local storage
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

/**
 * 일기쓰기 폼 기능을 처리하는 훅
 *
 * react-hook-form과 zod를 사용한 폼 검증,
 * 로컬스토리지에 일기 데이터 저장,
 * 등록 완료 모달 표시 기능을 제공합니다.
 */
export const useDiariesNewForm = () => {
  const { closeModal, addToStack, removeFromStack } = useModal();
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredDiaryId, setRegisteredDiaryId] = useState<number | null>(
    null
  );

  // react-hook-form 설정
  const form = useForm<DiaryFormData>({
    resolver: zodResolver(diaryFormSchema),
    defaultValues: {
      title: "",
      content: "",
      emotion: undefined,
    },
  });

  const { handleSubmit, watch, setValue, formState } = form;

  // 폼 필드 값들 감시
  const watchedValues = watch();
  const isFormValid =
    formState.isValid &&
    watchedValues.title?.trim() &&
    watchedValues.content?.trim() &&
    watchedValues.emotion;

  /**
   * 감정 선택 핸들러
   */
  const handleEmotionChange = useCallback(
    (emotion: Emotion): void => {
      setValue("emotion", emotion, { shouldValidate: true });
    },
    [setValue]
  );

  /**
   * 제목 변경 핸들러
   */
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setValue("title", e.target.value, { shouldValidate: true });
    },
    [setValue]
  );

  /**
   * 내용 변경 핸들러
   */
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      setValue("content", e.target.value, { shouldValidate: true });
    },
    [setValue]
  );

  /**
   * 로컬스토리지에서 기존 일기 데이터를 가져오는 함수
   */
  const getExistingDiaries = useCallback((): DiaryData[] => {
    try {
      const stored = localStorage.getItem("diaries");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to parse diaries from localStorage:", error);
      return [];
    }
  }, []);

  /**
   * 로컬스토리지에 일기 데이터를 저장하는 함수
   */
  const saveDiaryToStorage = useCallback(
    (diaryData: DiaryData): void => {
      try {
        const existingDiaries = getExistingDiaries();
        const newDiaries = [...existingDiaries, diaryData];
        localStorage.setItem("diaries", JSON.stringify(newDiaries));
      } catch (error) {
        console.error("Failed to save diary to localStorage:", error);
      }
    },
    [getExistingDiaries]
  );

  /**
   * 새로운 일기 ID를 생성하는 함수
   */
  const generateNewDiaryId = useCallback((): number => {
    const existingDiaries = getExistingDiaries();
    if (existingDiaries.length === 0) {
      return 1;
    }
    const maxId = Math.max(...existingDiaries.map((diary) => diary.id));
    return maxId + 1;
  }, [getExistingDiaries]);

  /**
   * 일기 등록 핸들러
   */
  const handleRegister = useCallback(
    (data: DiaryFormData): void => {
      try {
        const newDiaryId = generateNewDiaryId();
        const newDiary: DiaryData = {
          id: newDiaryId,
          title: data.title.trim(),
          content: data.content.trim(),
          emotion: data.emotion,
          createdAt: new Date().toISOString(),
        };

        saveDiaryToStorage(newDiary);
        setRegisteredDiaryId(newDiaryId);
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Failed to register diary:", error);
      }
    },
    [generateNewDiaryId, saveDiaryToStorage]
  );

  /**
   * 등록 완료 모달의 확인 버튼 핸들러
   * 상세 페이지로 이동하고 모든 모달을 닫습니다.
   */
  const handleSuccessConfirm = useCallback((): void => {
    setShowSuccessModal(false);
    removeFromStack();
    closeModal(); // 일기쓰기폼모달 종료

    // 등록된 일기의 상세 페이지로 이동
    if (registeredDiaryId) {
      const detailUrl = URLS.DIARIES.DETAIL(registeredDiaryId);
      router.push(detailUrl);
    }
  }, [removeFromStack, closeModal, router, registeredDiaryId]);

  // 등록 완료 모달을 스택에 추가
  React.useEffect(() => {
    if (showSuccessModal) {
      const successModalComponent = (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Modal
            variant="info"
            actions="single"
            title="등록 완료"
            content="일기가 성공적으로 등록되었습니다."
            singleActionText="확인"
            onSingleAction={handleSuccessConfirm}
          />
        </div>
      );
      addToStack(successModalComponent);
    }
  }, [showSuccessModal, addToStack, handleSuccessConfirm]);

  // 등록 완료 모달 컴포넌트 (스택에서 관리됨)
  const SuccessModal = (): JSX.Element | null => {
    return null; // 스택에서 관리되므로 여기서는 null 반환
  };

  return {
    form,
    handleEmotionChange,
    handleTitleChange,
    handleContentChange,
    handleRegister: handleSubmit(handleRegister),
    isFormValid,
    SuccessModal,
  };
};
