"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useModal } from "../../../commons/providers/modal/modal.provider";
import { Modal } from "../../../commons/components/modal";
import { URLS } from "../../../commons/constants/url";

/**
 * 회원가입 폼 Zod 스키마 정의
 *
 * 이메일, 비밀번호, 비밀번호 확인, 이름 필드에 대한 검증 규칙을 정의합니다.
 */
const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .refine((email) => email.includes("@"), {
        message: "이메일에 '@'가 포함되어야 합니다",
      })
      .email("올바른 이메일 형식을 입력해주세요"),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "영문과 숫자를 포함해야 합니다"),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    name: z.string().min(1, "이름을 입력해주세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

/**
 * 회원가입 폼 데이터 타입
 *
 * Zod 스키마에서 추론된 타입입니다.
 */
export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * createUser API 요청 함수
 *
 * GraphQL mutation을 통해 새로운 사용자를 생성합니다.
 *
 * @param input - 사용자 생성에 필요한 데이터 (email, password, name)
 * @returns Promise<{ _id: string }> - 생성된 사용자의 ID
 */
const createUser = async (input: {
  email: string;
  password: string;
  name: string;
}): Promise<{ _id: string }> => {
  const query = `
    mutation CreateUser($createUserInput: CreateUserInput!) {
      createUser(createUserInput: $createUserInput) {
        _id
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
          createUserInput: input,
        },
      }),
    }
  );

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "회원가입에 실패했습니다");
  }

  return result.data.createUser;
};

/**
 * 회원가입 폼 커스텀 훅
 *
 * react-hook-form, zod, @tanstack/react-query를 활용하여
 * 회원가입 폼의 상태 관리, 검증, API 호출을 처리합니다.
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
 * const { form, onSubmit, isSubmitEnabled, isLoading } = useAuthSignupForm();
 * const { register, formState } = form;
 *
 * return (
 *   <form onSubmit={onSubmit}>
 *     <input {...register("email")} />
 *     <button type="submit" disabled={!isSubmitEnabled || isLoading}>
 *       회원가입
 *     </button>
 *   </form>
 * );
 * ```
 */
export const useAuthSignupForm = () => {
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
    },
    mode: "onChange",
  });

  const {
    watch,
    formState: { errors },
  } = form;

  // 개별 필드를 watch하여 성능 최적화
  const email = watch("email");
  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");
  const name = watch("name");

  // 모든 필드가 입력되었는지 확인
  const isAllFieldsFilled = Boolean(
    email &&
      password &&
      passwordConfirm &&
      name &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      passwordConfirm.trim() !== "" &&
      name.trim() !== ""
  );

  // 버튼 활성화 조건: 모든 필드 입력되면 활성화
  const isSubmitEnabled = isAllFieldsFilled;

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 성공 모달 표시
      openModal(
        <div data-testid="signup-success-modal">
          <Modal
            variant="info"
            actions="single"
            title="가입 완료"
            content="회원가입이 완료되었습니다."
            singleActionText="확인"
            onSingleAction={() => {
              closeModal();
              router.push(URLS.AUTH.LOGIN);
            }}
          />
        </div>
      );
    },
    onError: (error) => {
      // 실패 모달 표시
      openModal(
        <div data-testid="signup-error-modal">
          <Modal
            variant="danger"
            actions="single"
            title="가입 실패"
            content={error.message || "회원가입에 실패했습니다."}
            singleActionText="확인"
            onSingleAction={() => {
              closeModal();
            }}
          />
        </div>
      );
    },
  });

  const onSubmit = (data: SignupFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordConfirm, ...submitData } = data;
    createUserMutation.mutate(submitData);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitEnabled,
    isLoading: createUserMutation.isPending,
    errors,
  };
};
