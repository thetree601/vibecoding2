"use client";

import React from "react";
import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { useAuthLoginForm } from "./hooks/index.form.hook";
import styles from "./styles.module.css";

export interface AuthLoginProps {
  /**
   * 회원가입 링크 클릭 핸들러
   */
  onSignup?: () => void;
}

/**
 * AuthLogin 컴포넌트
 *
 * 로그인 폼을 제공하는 컴포넌트입니다.
 * react-hook-form, zod, @tanstack/react-query를 사용하여
 * 폼 상태 관리, 검증, API 호출을 처리합니다.
 *
 * @example
 * ```tsx
 * <AuthLogin onSignup={handleSignup} />
 * ```
 */
export const AuthLogin: React.FC<AuthLoginProps> = ({
  onSignup,
}) => {
  const { form, onSubmit, isSubmitEnabled, isLoading, errors } = useAuthLoginForm();
  const { register } = form;

  const handleSignup = () => {
    onSignup?.();
  };

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} data-testid="auth-login-form">
        <h1 className={styles.title}>로그인</h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>이메일</label>
          <Input
            variant="primary"
            size="medium"
            theme="light"
            type="email"
            placeholder="이메일을 입력해주세요"
            {...register("email")}
            className={styles.input}
            data-testid="email-input"
          />
          {errors.email && (
            <div className={styles.errorMessage} data-testid="email-error">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className={`${styles.inputGroup} ${styles.passwordGroup}`}>
          <label className={styles.label}>비밀번호</label>
          <Input
            variant="primary"
            size="medium"
            theme="light"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            {...register("password")}
            className={styles.input}
            data-testid="password-input"
          />
          {errors.password && (
            <div className={styles.errorMessage} data-testid="password-error">
              {errors.password.message}
            </div>
          )}
        </div>

        <Button
          variant="primary"
          size="medium"
          theme="light"
          type="submit"
          disabled={!isSubmitEnabled || isLoading}
          className={styles.loginButton}
          data-testid="login-button"
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>

        <div className={styles.signupLink}>
          <span className={styles.signupText}>계정이 없으신가요?</span>
          <button
            type="button"
            onClick={handleSignup}
            className={styles.signupButton}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthLogin;
