"use client";

import React from "react";
import { Input } from "../../commons/components/input";
import { Button } from "../../commons/components/button";
import { useAuthSignupForm } from "./hooks/index.form.hook";
import styles from "./styles.module.css";

/**
 * AuthSignup 컴포넌트 Props 인터페이스
 */
export interface AuthSignupProps {
  /**
   * 로그인 페이지로 이동하는 콜백 함수
   */
  onNavigateToLogin?: () => void;
}

/**
 * 회원가입 데이터 인터페이스 (레거시)
 * 
 * @deprecated useAuthSignupForm의 SignupFormData 타입을 사용하세요
 */
export interface SignupData {
  /**
   * 이메일 주소
   */
  email: string;
  /**
   * 비밀번호
   */
  password: string;
  /**
   * 비밀번호 확인
   */
  confirmPassword: string;
  /**
   * 사용자 이름
   */
  name: string;
}

/**
 * AuthSignup 컴포넌트
 *
 * 회원가입 폼을 제공하는 컴포넌트입니다.
 * react-hook-form, zod, @tanstack/react-query를 활용하여 구현되었습니다.
 *
 * @example
 * ```tsx
 * <AuthSignup
 *   onNavigateToLogin={() => router.push('/auth/login')}
 * />
 * ```
 */
export const AuthSignup: React.FC<AuthSignupProps> = ({
  onNavigateToLogin,
}) => {
  const { form, onSubmit, isSubmitEnabled, isLoading } = useAuthSignupForm();
  const { register, formState } = form;

  return (
    <div className={styles.container} data-testid="auth-signup-container">
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>회원가입</h1>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              이메일
            </label>
            <Input
              id="email"
              type="email"
              variant="primary"
              size="medium"
              theme="light"
              placeholder="이메일을 입력해주세요"
              {...register("email")}
              error={!!formState.errors.email}
              className={styles.input}
              data-testid="email-input"
            />
            {formState.errors.email && (
              <span className={styles.errorMessage} data-testid="email-error">
                {formState.errors.email.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              variant="primary"
              size="medium"
              theme="light"
              placeholder="비밀번호를 입력해주세요"
              {...register("password")}
              error={!!formState.errors.password}
              className={styles.input}
              data-testid="password-input"
            />
            {formState.errors.password && (
              <span
                className={styles.errorMessage}
                data-testid="password-error"
              >
                {formState.errors.password.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="passwordConfirm" className={styles.label}>
              비밀번호 확인
            </label>
            <Input
              id="passwordConfirm"
              type="password"
              variant="primary"
              size="medium"
              theme="light"
              placeholder="비밀번호를 다시 입력해주세요"
              {...register("passwordConfirm")}
              error={!!formState.errors.passwordConfirm}
              className={styles.input}
              data-testid="password-confirm-input"
            />
            {formState.errors.passwordConfirm && (
              <span
                className={styles.errorMessage}
                data-testid="password-confirm-error"
              >
                {formState.errors.passwordConfirm.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              이름
            </label>
            <Input
              id="name"
              type="text"
              variant="primary"
              size="medium"
              theme="light"
              placeholder="이름을 입력해주세요"
              {...register("name")}
              error={!!formState.errors.name}
              className={styles.input}
              data-testid="name-input"
            />
            {formState.errors.name && (
              <span className={styles.errorMessage} data-testid="name-error">
                {formState.errors.name.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="medium"
            theme="light"
            className={styles.submitButton}
            disabled={!isSubmitEnabled || isLoading}
            data-testid="signup-submit-button"
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </Button>
        </form>

        <div className={styles.loginLink}>
          <span className={styles.loginText}>이미 계정이 있으신가요?</span>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className={styles.loginButton}
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthSignup;
