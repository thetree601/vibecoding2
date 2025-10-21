"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AuthSignup } from "../../../components/auth-signup";
import { URLS } from "../../../commons/constants/url";

/**
 * 회원가입 페이지 컴포넌트
 *
 * AuthSignup 컴포넌트를 사용하여 회원가입 폼을 제공합니다.
 * 성공적인 회원가입 후 로그인 페이지로 이동합니다.
 * 
 * @returns {JSX.Element} 회원가입 페이지 JSX
 */
export default function SignupPage() {
  const router = useRouter();

  const handleNavigateToLogin = () => {
    router.push(URLS.AUTH.LOGIN);
  };

  return <AuthSignup onNavigateToLogin={handleNavigateToLogin} />;
}
