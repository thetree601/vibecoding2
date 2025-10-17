"use client";

import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { useLinkRouting } from "./hooks/index.link.routing.hook";
import { useArea } from "./hooks/index.area.hook";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const {
    handleLogoClick,
    handleDiariesClick,
    handlePicturesClick,
    isDiariesActive,
    isPicturesActive,
  } = useLinkRouting();
  const {
    headerVisible,
    headerLogoVisible,
    bannerVisible,
    navigationVisible,
    footerVisible,
  } = useArea();

  return (
    <div className={styles.container}>
      {/* Header */}
      {headerVisible && (
        <header className={styles.header} data-testid="area-header">
          <div className={styles.headerInner}>
            <div className={styles.headerContent}>
              {headerLogoVisible && (
                <div
                  className={styles.logo}
                  onClick={handleLogoClick}
                  data-testid="header-logo"
                >
                  민지의 다이어리
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Gap */}
      <div className={styles.gap}>
        <div className={styles.gapInner}></div>
      </div>

      {/* Banner */}
      {bannerVisible && (
        <section className={styles.banner} data-testid="area-banner">
          <div className={styles.bannerInner}>
            <div className={styles.bannerContent}>
              <Image
                src="/images/banner.png"
                alt="Banner"
                width={1168}
                height={200}
                className={styles.bannerImage}
              />
            </div>
          </div>
        </section>
      )}

      {/* Gap */}
      <div className={styles.gap}>
        <div className={styles.gapInner}></div>
      </div>

      {/* Navigation */}
      {navigationVisible && (
        <nav className={styles.navigation} data-testid="area-navigation">
          <div className={styles.navigationInner}>
            <div className={styles.navigationContent}>
              <div
                className={isDiariesActive ? styles.activeTab : styles.navTab}
                onClick={handleDiariesClick}
                data-testid="nav-diaries"
              >
                <span
                  className={
                    isDiariesActive
                      ? styles.tabTextActive
                      : styles.navTabTextSecondary
                  }
                >
                  일기보관함
                </span>
              </div>
              <div
                className={isPicturesActive ? styles.activeTab : styles.navTab}
                onClick={handlePicturesClick}
                data-testid="nav-pictures"
              >
                <span
                  className={
                    isPicturesActive
                      ? styles.tabTextActive
                      : styles.navTabTextSecondary
                  }
                >
                  사진보관함
                </span>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainInner}>
          <div className={styles.mainContent}>{children}</div>
        </div>
      </main>

      {/* Footer */}
      {footerVisible && (
        <footer className={styles.footer} data-testid="area-footer">
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>민지의 다이어리</div>
            <div className={styles.footerRepresentative}>대표 : 민지</div>
            <div className={styles.footerCopyright}>
              Copyright © 2024. 민지 Co., Ltd.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
