"use client";

import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { useLinkRouting } from "./hooks/index.link.routing.hook";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { handleLogoClick, handleDiariesClick, handlePicturesClick } =
    useLinkRouting();

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerContent}>
            <div
              className={styles.logo}
              onClick={handleLogoClick}
              data-testid="header-logo"
            >
              민지의 다이어리
            </div>
          </div>
        </div>
      </header>

      {/* Gap */}
      <div className={styles.gap}>
        <div className={styles.gapInner}></div>
      </div>

      {/* Banner */}
      <section className={styles.banner}>
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

      {/* Gap */}
      <div className={styles.gap}>
        <div className={styles.gapInner}></div>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.navigationInner}>
          <div className={styles.navigationContent}>
            <div
              className={styles.navTab}
              onClick={handleDiariesClick}
              data-testid="nav-diaries"
            >
              <span className={styles.navTabText}>일기보관함</span>
            </div>
            <div
              className={styles.navTab}
              onClick={handlePicturesClick}
              data-testid="nav-pictures"
            >
              <span className={styles.navTabTextSecondary}>사진보관함</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainInner}>
          <div className={styles.mainContent}>{children}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>민지의 다이어리</div>
          <div className={styles.footerRepresentative}>대표 : 민지</div>
          <div className={styles.footerCopyright}>
            Copyright © 2024. 민지 Co., Ltd.
          </div>
        </div>
      </footer>
    </div>
  );
}
