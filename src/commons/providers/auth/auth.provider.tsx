"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { URLS } from "@/commons/constants/url";

// 사용자 정보 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: string | number | boolean | null | undefined;
}

// AuthContext 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User, accessToken: string) => void;
  logout: () => void;
  checkAuthStatus: () => boolean;
  getUserInfo: () => User | null;
}

// AuthContext 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Props 타입
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider 컴포넌트
export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // 로그인 상태 검증 함수
  const checkAuthStatus = (): boolean => {
    if (typeof window === "undefined") return false;

    const accessToken = localStorage.getItem("accessToken");
    const hasToken = !!accessToken;

    setIsLoggedIn(hasToken);
    return hasToken;
  };

  // 사용자 정보 조회 함수
  const getUserInfo = (): User | null => {
    if (typeof window === "undefined") return null;

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser;
      } catch (error) {
        console.error("사용자 정보 파싱 오류:", error);
        return null;
      }
    }
    return null;
  };

  // 로그인 함수
  const login = (userData: User, accessToken: string): void => {
    if (typeof window === "undefined") return;

    // 로컬스토리지에 토큰과 사용자 정보 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // 상태 업데이트
    setIsLoggedIn(true);
    setUser(userData);

    // 로그인 성공 후 메인 페이지로 이동 (일기 목록 페이지)
    router.push(URLS.DIARIES.LIST);
  };

  // 로그아웃 함수
  const logout = (): void => {
    if (typeof window === "undefined") return;

    // 로컬스토리지에서 토큰과 사용자 정보 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // 상태 초기화
    setIsLoggedIn(false);
    setUser(null);

    // 로그인 페이지로 이동
    router.push(URLS.AUTH.LOGIN);
  };

  // 컴포넌트 마운트 시 초기 상태 설정
  useEffect(() => {
    console.log("AuthProvider - 마운트 시 초기 상태 설정");
    const hasToken = checkAuthStatus();
    console.log("AuthProvider - hasToken:", hasToken);
    if (hasToken) {
      const userInfo = getUserInfo();
      console.log("AuthProvider - userInfo:", userInfo);
    }
  }, []);

  // 로컬스토리지 변경 감지를 위한 이벤트 리스너
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
      getUserInfo();
    };

    // storage 이벤트 리스너 등록 (다른 탭에서의 변경 감지)
    window.addEventListener("storage", handleStorageChange);

    // 커스텀 이벤트 리스너 등록 (같은 탭에서의 변경 감지)
    window.addEventListener("authStateChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChange", handleStorageChange);
    };
  }, []);

  // Context 값
  const contextValue: AuthContextType = {
    isLoggedIn,
    user,
    login,
    logout,
    checkAuthStatus,
    getUserInfo,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// useAuth 훅
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// AuthProvider를 기본 export로 설정
export default AuthProvider;
