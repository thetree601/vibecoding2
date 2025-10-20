"use client";

import React from "react";
import styles from "./styles.module.css";

export default function PicturesWireframe(): JSX.Element {
  return (
    <section className={styles.container}>
      <div className={styles.gapTop} aria-hidden>
        <div className={styles.gapTopInner} />
      </div>
      <div className={styles.filter}>
        <div className={styles.filterInner}>
          <div className={styles.filterPlaceholder} />
        </div>
      </div>
      <div className={styles.gapMiddle} aria-hidden>
        <div className={styles.gapMiddleInner} />
      </div>
      <main className={styles.main}>
        <div className={styles.mainInner}>
          <div className={styles.mainPlaceholder} />
        </div>
      </main>
    </section>
  );
}
