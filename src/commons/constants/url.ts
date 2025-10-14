import { AccessLevel } from './enum';

/**
 * URL 경로 및 페이지 설정 관리
 * 다이나믹 라우팅을 지원하며, Link 컴포넌트에서 사용 가능하도록 설계됨
 */

// 페이지 구성 요소 표시 여부
export interface PageLayout {
  header: {
    visible: boolean;
    logo: boolean;
    darkModeToggle: boolean;
  };
  banner: boolean;
  navigation: boolean;
  footer: boolean;
}

// 페이지 정보 인터페이스
export interface PageInfo {
  path: string;
  accessLevel: AccessLevel;
  layout: PageLayout;
}

// URL 경로 상수
export const URLS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  
  // 일기 관련
  DIARIES: {
    LIST: '/diaries',
    DETAIL: (id: string | number) => `/diaries/${id}`,
    DETAIL_TEMPLATE: '/diaries/[id]', // 템플릿 경로
  },
  
  // 사진 관련
  PICTURES: {
    LIST: '/pictures',
  },
} as const;

// 페이지별 설정 정보
export const PAGE_CONFIGS: Record<string, PageInfo> = {
  // 로그인 페이지
  [URLS.AUTH.LOGIN]: {
    path: URLS.AUTH.LOGIN,
    accessLevel: AccessLevel.Anyone,
    layout: {
      header: {
        visible: false,
        logo: false,
        darkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: false,
    },
  },
  
  // 회원가입 페이지
  [URLS.AUTH.SIGNUP]: {
    path: URLS.AUTH.SIGNUP,
    accessLevel: AccessLevel.Anyone,
    layout: {
      header: {
        visible: false,
        logo: false,
        darkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: false,
    },
  },
  
  // 일기 목록 페이지
  [URLS.DIARIES.LIST]: {
    path: URLS.DIARIES.LIST,
    accessLevel: AccessLevel.Anyone,
    layout: {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: true,
      navigation: true,
      footer: true,
    },
  },
  
  // 일기 상세 페이지 (템플릿)
  [URLS.DIARIES.DETAIL_TEMPLATE]: {
    path: URLS.DIARIES.DETAIL_TEMPLATE,
    accessLevel: AccessLevel.Member,
    layout: {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: true,
    },
  },
  
  // 사진 목록 페이지
  [URLS.PICTURES.LIST]: {
    path: URLS.PICTURES.LIST,
    accessLevel: AccessLevel.Anyone,
    layout: {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: true,
      navigation: true,
      footer: true,
    },
  },
};

// 유틸리티 함수들
export const urlUtils = {
  /**
   * 경로에 해당하는 페이지 설정을 가져옴
   */
  getPageConfig: (path: string): PageInfo | null => {
    // 정확한 경로 매치 시도
    if (PAGE_CONFIGS[path]) {
      return PAGE_CONFIGS[path];
    }
    
    // 다이나믹 라우팅 경로 매치 시도
    if (path.startsWith('/diaries/') && path !== '/diaries') {
      return PAGE_CONFIGS[URLS.DIARIES.DETAIL_TEMPLATE];
    }
    
    return null;
  },
  
  /**
   * 접근 권한 확인
   */
  checkAccess: (path: string, isLoggedIn: boolean): boolean => {
    const config = urlUtils.getPageConfig(path);
    if (!config) return false;
    
    return config.accessLevel === AccessLevel.Anyone || 
           (config.accessLevel === AccessLevel.Member && isLoggedIn);
  },
  
  /**
   * 경로가 인증이 필요한지 확인
   */
  requiresAuth: (path: string): boolean => {
    const config = urlUtils.getPageConfig(path);
    return config?.accessLevel === AccessLevel.Member || false;
  },
  
  /**
   * 일기 상세 페이지 URL 생성
   */
  createDiaryDetailUrl: (id: string | number): string => {
    return URLS.DIARIES.DETAIL(id);
  },
};

// 네비게이션용 메뉴 항목들
export const NAVIGATION_ITEMS = [
  {
    label: '일기 목록',
    path: URLS.DIARIES.LIST,
    requiresAuth: false,
  },
  {
    label: '사진 목록',
    path: URLS.PICTURES.LIST,
    requiresAuth: false,
  },
] as const;

// 인증 관련 리다이렉트 경로
export const REDIRECT_URLS = {
  AFTER_LOGIN: URLS.DIARIES.LIST,
  AFTER_LOGOUT: URLS.DIARIES.LIST,
  UNAUTHORIZED: URLS.AUTH.LOGIN,
} as const;
