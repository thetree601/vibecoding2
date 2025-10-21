"use client";

import React from "react";
import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import styles from "./styles.module.css";

export interface AuthLoginProps {
  /**
   * 이메일 입력 값
   */
  email?: string;

  /**
   * 비밀번호 입력 값
   */
  password?: string;

  /**
   * 이메일 변경 핸들러
   */
  onEmailChange?: (value: string) => void;

  /**
   * 비밀번호 변경 핸들러
   */
  onPasswordChange?: (value: string) => void;

  /**
   * 로그인 버튼 클릭 핸들러
   */
  onLogin?: () => void;

  /**
   * 회원가입 링크 클릭 핸들러
   */
  onSignup?: () => void;

  /**
   * 로딩 상태
   */
  loading?: boolean;

  /**
   * 에러 상태
   */
  error?: string;
}

/**
 * AuthLogin 컴포넌트
 *
 * 로그인 폼을 제공하는 컴포넌트입니다.
 * 이메일, 비밀번호 입력 필드와 로그인 버튼, 회원가입 링크를 포함합니다.
 *
 * @example
 * ```tsx
 * <AuthLogin
 *   email={email}
 *   password={password}
 *   onEmailChange={setEmail}
 *   onPasswordChange={setPassword}
 *   onLogin={handleLogin}
 *   onSignup={handleSignup}
 * />
 * ```
 */
export const AuthLogin: React.FC<AuthLoginProps> = ({
  email = "",
  password = "",
  onEmailChange,
  onPasswordChange,
  onLogin,
  onSignup,
  loading = false,
  error,
}) => {
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onEmailChange?.(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPasswordChange?.(event.target.value);
  };

  const handleLogin = () => {
    onLogin?.();
  };

  const handleSignup = () => {
    onSignup?.();
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={styles.title}>로그인</h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>이메일</label>
          <Input
            variant="primary"
            size="medium"
            theme="light"
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={handleEmailChange}
            className={styles.input}
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.passwordGroup}`}>
          <label className={styles.label}>비밀번호</label>
          <Input
            variant="primary"
            size="medium"
            theme="light"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={handlePasswordChange}
            className={styles.input}
          />
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <Button
          variant="primary"
          size="medium"
          theme="light"
          type="submit"
          onClick={handleLogin}
          disabled={loading}
          className={styles.loginButton}
        >
          {loading ? "로그인 중..." : "로그인"}
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
      </div>
    </div>
  );
};

export default AuthLogin;
