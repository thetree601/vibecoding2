"use client";

import React from "react";
import { AuthSignup } from "../../../components/auth-signup";

/**
 * 회원가입 페이지
 *
 * AuthSignup 컴포넌트를 사용하여 회원가입 폼을 제공합니다.
 */
export default function SignupPage() {
  const handleSignup = (data: { email: string; password: string; confirmPassword: string; name: string }) => {
    console.log("회원가입 데이터:", data);
    // TODO: 실제 회원가입 로직 구현
  };

  const handleNavigateToLogin = () => {
    console.log("로그인 페이지로 이동");
    // TODO: 실제 라우팅 로직 구현
  };

  return (
    <AuthSignup
      onSignup={handleSignup}
      onNavigateToLogin={handleNavigateToLogin}
    />
  );
}
