"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Emotion } from "../../../commons/constants/enum";

/**
 * 일기 수정 폼 스키마 정의
 */
const diaryUpdateFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  emotion: z.nativeEnum(Emotion, {
    message: "감정을 선택해주세요.",
  }),
});

export type DiaryUpdateFormData = z.infer<typeof diaryUpdateFormSchema>;

export interface DiaryUpdateData {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

/**
 * 일기 수정 기능을 위한 훅
 * - 수정 모드 상태 관리
 * - 폼 검증 및 제출
 * - 로컬스토리지 데이터 업데이트
 */
export const useDiaryUpdate = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DiaryUpdateFormData>({
    resolver: zodResolver(diaryUpdateFormSchema),
    defaultValues: {
      title: "",
      content: "",
      emotion: Emotion.Happy,
    },
  });

  const { watch, reset, setValue } = form;
  const watchedValues = watch();
  const isFormValid =
    watchedValues.title.trim().length > 0 &&
    watchedValues.content.trim().length > 0 &&
    watchedValues.emotion;

  /**
   * 수정 모드 진입
   */
  const enterEditMode = (diaryData: DiaryUpdateData) => {
    setValue("title", diaryData.title);
    setValue("content", diaryData.content);
    setValue("emotion", diaryData.emotion);
    setIsEditMode(true);
  };

  /**
   * 수정 모드 종료
   */
  const exitEditMode = () => {
    setIsEditMode(false);
    reset();
  };

  /**
   * 일기 수정 제출
   */
  const onSubmit = async (data: DiaryUpdateFormData, diaryId: number) => {
    if (isSubmitting) return;

    console.log("폼 제출 데이터:", data);
    console.log("일기 ID:", diaryId);

    setIsSubmitting(true);

    try {
      console.log("try 블록 시작");

      // 기존 일기 데이터 가져오기
      const existingDiaries = localStorage.getItem("diaries");
      console.log("로컬스토리지 원본 데이터:", existingDiaries);

      const diaries: DiaryUpdateData[] = existingDiaries
        ? JSON.parse(existingDiaries)
        : [];
      console.log("파싱된 일기 배열:", diaries);

      // 해당 일기 찾기
      const diaryIndex = diaries.findIndex((d) => d.id === diaryId);
      console.log("전체 일기 목록:", diaries);
      console.log("찾는 일기 ID:", diaryId);
      console.log("찾은 인덱스:", diaryIndex);

      if (diaryIndex === -1) {
        console.error("일기를 찾을 수 없습니다. ID:", diaryId);
        throw new Error("일기를 찾을 수 없습니다.");
      }

      // 일기 데이터 업데이트
      const updatedDiary: DiaryUpdateData = {
        ...diaries[diaryIndex],
        title: data.title.trim(),
        content: data.content.trim(),
        emotion: data.emotion,
      };

      console.log("업데이트 전 일기:", diaries[diaryIndex]);
      console.log("업데이트 후 일기:", updatedDiary);

      // 배열 업데이트
      const updatedDiaries = [...diaries];
      updatedDiaries[diaryIndex] = updatedDiary;

      console.log("업데이트된 배열:", updatedDiaries);

      // 로컬스토리지에 저장
      localStorage.setItem("diaries", JSON.stringify(updatedDiaries));

      console.log("로컬스토리지 저장 완료");

      // 수정 모드 종료
      exitEditMode();

      // 커스텀 이벤트 발생 (페이지 새로고침 없이)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("diaryUpdated"));
      }

      return true;
    } catch (error) {
      console.error("일기 수정 중 오류가 발생했습니다:", error);
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
      console.error("에러 상세:", errorMessage);
      alert(`수정 실패: ${errorMessage}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditMode,
    isSubmitting,
    isFormValid,
    form,
    enterEditMode,
    exitEditMode,
    onSubmit,
  } as const;
};
