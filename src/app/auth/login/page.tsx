"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AuthLogin } from "@/components/auth-login";
import { URLS } from "@/commons/constants/url";

export default function LoginPage() {
  const router = useRouter();

  const handleSignup = () => {
    router.push(URLS.AUTH.SIGNUP);
  };

  return <AuthLogin onSignup={handleSignup} />;
}
