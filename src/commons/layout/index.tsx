import React from "react";
import styles from "./styles.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>민지의 다이어리</div>
        </div>
      </header>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <img
            src="/images/banner.png"
            alt="Banner"
            className={styles.bannerImage}
          />
        </div>
      </section>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.navigationContent}>
          <div className={styles.navTab}>
            <span className={styles.navTabText}>일기보관함</span>
          </div>
          <div className={styles.navTab}>
            <span className={styles.navTabTextSecondary}>사진보관함</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainContent}>{children}</div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>민지의 다이어리</div>
          <div className={styles.footerInfo}>
            <div className={styles.footerRepresentative}>대표 : 민지</div>
            <div className={styles.footerCopyright}>
              Copyright © 2024. 민지 Co., Ltd.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
