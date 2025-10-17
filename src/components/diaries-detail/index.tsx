import React from "react";
import styles from "./styles.module.css";

interface DiariesDetailProps {
  // Props can be added later as needed
  [key: string]: unknown;
}

const DiariesDetail: React.FC<DiariesDetailProps> = () => {
  return (
    <div className={styles.container}>
      {/* Gap: 1168 * 64 */}
      <div className={styles.gap64}></div>

      {/* Detail Title: 1168 * 84 */}
      <div className={styles.detailTitle}>
        <h1>일기 제목</h1>
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Detail Content: 1168 * 169 */}
      <div className={styles.detailContent}>
        <p>일기 내용이 여기에 표시됩니다.</p>
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Detail Footer: 1168 * 56 */}
      <div className={styles.detailFooter}>
        <div className={styles.footerContent}>
          <span>작성일: 2024년 1월 1일</span>
        </div>
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Retrospect Input: 1168 * 85 */}
      <div className={styles.retrospectInput}>
        <textarea placeholder="회고 내용을 입력하세요..."></textarea>
      </div>

      {/* Gap: 1168 * 16 */}
      <div className={styles.gap16}></div>

      {/* Retrospect List: 1168 * 72 */}
      <div className={styles.retrospectList}>
        <div className={styles.retrospectItem}>
          <span>회고 항목 1</span>
        </div>
        <div className={styles.retrospectItem}>
          <span>회고 항목 2</span>
        </div>
      </div>
    </div>
  );
};

export default DiariesDetail;
