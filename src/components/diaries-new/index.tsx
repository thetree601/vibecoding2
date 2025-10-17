import styles from "./styles.module.css";

export default function DiariesNew() {
  return (
    <div className={styles.wrapper}>
      {/* Header section */}
      <div className={styles.header}>Header</div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Emotion box section */}
      <div className={styles.emotionBox}>Emotion Box</div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Input title section */}
      <div className={styles.inputTitle}>Input Title</div>

      {/* Gap */}
      <div className={styles.gapSmall}></div>

      {/* Input content section */}
      <div className={styles.inputContent}>Input Content</div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Footer section */}
      <div className={styles.footer}>Footer</div>

      {/* Bottom space (remaining 48px) */}
      <div className={styles.bottomSpace}></div>
    </div>
  );
}
