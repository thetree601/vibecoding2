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
        <div className={styles.headerContent}>Header Content</div>
      </header>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>Banner Content</div>
      </section>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.navigationContent}>Navigation Content</div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainContent}>{children}</div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>Footer Content</div>
      </footer>
    </div>
  );
}
