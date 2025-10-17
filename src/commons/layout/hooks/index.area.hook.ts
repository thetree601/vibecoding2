"use client";

import { usePathname } from "next/navigation";
import { urlUtils } from "@/commons/constants/url";

export interface AreaVisibility {
  headerVisible: boolean;
  headerLogoVisible: boolean;
  bannerVisible: boolean;
  navigationVisible: boolean;
  footerVisible: boolean;
}

/**
 * URL 페이지 설정에 따라 레이아웃 영역 노출 여부를 제공하는 훅
 */
export const useArea = (): AreaVisibility => {
  const pathname = usePathname();
  const config = urlUtils.getPageConfig(pathname);

  if (!config) {
    // 기본값: 모든 영역 표시
    return {
      headerVisible: true,
      headerLogoVisible: true,
      bannerVisible: true,
      navigationVisible: true,
      footerVisible: true,
    };
  }

  const { layout } = config;
  return {
    headerVisible: layout.header.visible,
    headerLogoVisible: layout.header.logo,
    bannerVisible: layout.banner,
    navigationVisible: layout.navigation,
    footerVisible: layout.footer,
  };
};
