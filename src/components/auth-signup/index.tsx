"use client";

import React, { useState } from "react";
import { Input } from "../../commons/components/input";
import { Button } from "../../commons/components/button";
import styles from "./styles.module.css";

export interface AuthSignupProps {
  /**
   * 회원가입 성공 시 호출되는 콜백
   */
  onSignup?: (data: SignupData) => void;

  /**
   * 로그인 페이지로 이동하는 콜백
   */
  onNavigateToLogin?: () => void;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

/**
 * AuthSignup 컴포넌트
 *
 * 회원가입 폼을 제공하는 컴포넌트입니다.
 * Input과 Button 공통 컴포넌트를 활용하여 구현되었습니다.
 *
 * @example
 * ```tsx
 * <AuthSignup
 *   onSignup={(data) => console.log('Signup data:', data)}
 *   onNavigateToLogin={() => router.push('/auth/login')}
 * />
 * ```
 */
export const AuthSignup: React.FC<AuthSignupProps> = ({
  onSignup,
  onNavigateToLogin,
}) => {
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [errors, setErrors] = useState<Partial<SignupData>>({});

  const handleInputChange =
    (field: keyof SignupData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

      // 에러 상태 초기화
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupData> = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호를 다시 입력해주세요";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = "이름을 입력해주세요";
    } else if (formData.name.length < 2) {
      newErrors.name = "이름은 2자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      onSignup?.(formData);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>회원가입</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
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
              value={formData.email}
              onChange={handleInputChange("email")}
              error={!!errors.email}
              className={styles.input}
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
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
              value={formData.password}
              onChange={handleInputChange("password")}
              error={!!errors.password}
              className={styles.input}
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              비밀번호 확인
            </label>
            <Input
              id="confirmPassword"
              type="password"
              variant="primary"
              size="medium"
              theme="light"
              placeholder="비밀번호를 다시 입력해주세요"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              error={!!errors.confirmPassword}
              className={styles.input}
            />
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>
                {errors.confirmPassword}
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
              value={formData.name}
              onChange={handleInputChange("name")}
              error={!!errors.name}
              className={styles.input}
            />
            {errors.name && (
              <span className={styles.errorMessage}>{errors.name}</span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="medium"
            theme="light"
            className={styles.submitButton}
          >
            회원가입
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
