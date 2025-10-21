"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { URLS } from "@/commons/constants/url";
import { Modal } from "@/commons/components/modal";

/**
 * 로그인 폼 스키마
 *
 * zod를 사용하여 폼 검증 규칙을 정의합니다.
 * - email: '@' 포함 필수
 * - password: 최소 1글자 이상
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * loginUser API 요청 함수
 *
 * GraphQL mutation을 통해 사용자 로그인을 처리합니다.
 *
 * @param input - 로그인에 필요한 데이터 (email, password)
 * @returns Promise<{ accessToken: string }> - 액세스 토큰
 */
const loginUser = async (input: {
  email: string;
  password: string;
}): Promise<{ accessToken: string }> => {
  const query = `
    mutation LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        accessToken
      }
    }
  `;

  const response = await fetch(
    "https://main-practice.codebootcamp.co.kr/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          email: input.email,
          password: input.password,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "로그인에 실패했습니다");
  }

  return result.data.loginUser;
};

/**
 * fetchUserLoggedIn API 요청 함수
 *
 * GraphQL query를 통해 로그인된 사용자 정보를 조회합니다.
 *
 * @param accessToken - 인증 토큰
 * @returns Promise<{ _id: string; name: string }> - 사용자 정보
 */
const fetchUserLoggedIn = async (
  accessToken: string
): Promise<{ _id: string; name: string; email: string }> => {
  const query = `
    query FetchUserLoggedIn {
      fetchUserLoggedIn {
        _id
        name
        email
      }
    }
  `;

  const response = await fetch(
    "https://main-practice.codebootcamp.co.kr/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(
      result.errors[0]?.message || "사용자 정보 조회에 실패했습니다"
    );
  }

  return result.data.fetchUserLoggedIn;
};

/**
 * 로그인 폼 커스텀 훅
 *
 * react-hook-form, zod, @tanstack/react-query를 활용하여
 * 로그인 폼의 상태 관리, 검증, API 호출을 처리합니다.
 *
 * @returns {Object} 폼 관련 상태와 함수들
 * @returns {UseFormReturn} form - react-hook-form 인스턴스
 * @returns {Function} onSubmit - 폼 제출 핸들러
 * @returns {boolean} isSubmitEnabled - 제출 버튼 활성화 상태
 * @returns {boolean} isLoading - API 호출 로딩 상태
 * @returns {Object} errors - 폼 검증 에러 객체
 *
 * @example
 * ```tsx
 * const { form, onSubmit, isSubmitEnabled, isLoading } = useAuthLoginForm();
 * const { register, formState } = form;
 *
 * return (
 *   <form onSubmit={onSubmit}>
 *     <input {...register("email")} />
 *     <input {...register("password")} />
 *     <button type="submit" disabled={!isSubmitEnabled || isLoading}>
 *       로그인
 *     </button>
 *   </form>
 * );
 * ```
 */
export const useAuthLoginForm = () => {
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { watch, formState } = form;
  const { errors, isValid } = formState;

  // 폼 필드 값들을 실시간으로 감시
  const email = watch("email");
  const password = watch("password");

  // 모든 필드가 입력되었는지 확인
  const isSubmitEnabled = email.length > 0 && password.length > 0 && isValid;

  // 로그인 API 호출 mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      try {
        console.log("로그인 성공:", data);

        // 액세스 토큰을 로컬스토리지에 저장
        localStorage.setItem("accessToken", data.accessToken);

        // 사용자 정보 조회 시도
        console.log("fetchUserLoggedIn API 호출 시작");
        const userInfo = await fetchUserLoggedIn(data.accessToken);
        console.log("사용자 정보 조회 성공:", userInfo);

        // 사용자 정보를 로컬스토리지에 저장
        localStorage.setItem("user", JSON.stringify(userInfo));

        // 로그인 성공 모달 표시
        console.log("로그인 성공 모달 표시 시도");
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="로그인 완료"
            content="로그인에 성공했습니다."
            onSingleAction={() => {
              console.log("로그인 성공 모달 확인 클릭");
              closeModal();
              router.push(URLS.DIARIES.LIST);
            }}
          />
        );
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        console.log("fetchUserLoggedIn 실패, 임시 사용자 정보로 처리");

        // 임시 사용자 정보 저장
        const tempUserInfo = {
          _id: "temp_id",
          name: "사용자",
          email: "user@example.com",
        };
        localStorage.setItem("user", JSON.stringify(tempUserInfo));

        // 로그인 성공 모달 표시 (사용자 정보 조회 실패해도 로그인은 성공)
        console.log("로그인 성공 모달 표시 시도 (임시 사용자 정보)");
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="로그인 완료"
            content="로그인에 성공했습니다."
            onSingleAction={() => {
              console.log("로그인 성공 모달 확인 클릭");
              closeModal();
              router.push(URLS.DIARIES.LIST);
            }}
          />
        );
      }
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
      // 로그인 실패 모달 표시
      console.log("로그인 실패 모달 표시 시도");
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="로그인 실패"
          content={error.message || "로그인에 실패했습니다."}
          onSingleAction={() => closeModal()}
        />
      );
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return {
    form,
    onSubmit,
    isSubmitEnabled,
    isLoading: loginMutation.isPending,
    errors,
  };
};
