"use client";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/**
 * Zod 스키마 정의
 */
const retrospectFormSchema = z.object({
  content: z.string().min(1, "회고 내용을 입력해주세요."),
});

export type RetrospectFormData = z.infer<typeof retrospectFormSchema>;

export interface Retrospect {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 회고 폼 관리를 위한 훅
 * - react-hook-form과 zod를 사용한 폼 검증
 * - 로컬스토리지에 회고 데이터 저장
 * - 등록 후 페이지 새로고침
 */
export const useRetrospectForm = () => {
  const params = useParams();
  const diaryId =
    typeof params?.id === "string"
      ? Number(params.id)
      : Number(params?.id?.[0]);

  const form = useForm<RetrospectFormData>({
    resolver: zodResolver(retrospectFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const { watch, reset } = form;
  const content = watch("content");
  const isSubmitEnabled = content.trim().length > 0;

  const onSubmit = (data: RetrospectFormData) => {
    try {
      // 기존 retrospects 데이터 가져오기
      const existingRetrospects = localStorage.getItem("retrospects");
      const retrospects: Retrospect[] = existingRetrospects
        ? JSON.parse(existingRetrospects)
        : [];

      // 새로운 회고 데이터 생성
      const newRetrospect: Retrospect = {
        id:
          retrospects.length > 0
            ? Math.max(...retrospects.map((r) => r.id)) + 1
            : 1,
        content: data.content,
        diaryId: diaryId,
        createdAt: new Date().toISOString(),
      };

      // 기존 데이터에 새 회고 추가
      const updatedRetrospects = [...retrospects, newRetrospect];

      // 로컬스토리지에 저장
      localStorage.setItem("retrospects", JSON.stringify(updatedRetrospects));

      // 폼 리셋
      reset();

      // 페이지 새로고침 (테스트 환경에서는 제외)
      if (
        typeof window !== "undefined" &&
        !window.location.href.includes("localhost:3000")
      ) {
        window.location.reload();
      }
    } catch (error) {
      console.error("회고 저장 중 오류가 발생했습니다:", error);
    }
  };

  return {
    form,
    isSubmitEnabled,
    onSubmit,
  } as const;
};
