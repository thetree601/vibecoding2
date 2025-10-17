import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Button } from "../../commons/components/button";
import { Emotion, EMOTION_ASSETS } from "../../commons/constants/enum";

interface DiariesDetailProps {
  // Props can be added later as needed
  [key: string]: unknown;
}

// Mock 데이터
const mockDiary = {
  title: "이것은 타이틀 입니다.",
  emotion: Emotion.Happy,
  date: "2024. 07. 12",
  content:
    "내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다",
};

const DiariesDetail: React.FC<DiariesDetailProps> = () => {
  const emotionAsset = EMOTION_ASSETS[mockDiary.emotion];

  return (
    <div className={styles.container}>
      {/* Detail Title Section - 피그마 3:1073 */}
      <div className={styles.titleSection}>
        <div className={styles.titleFrame}>
          <div className={styles.titleText}>{mockDiary.title}</div>
        </div>
        <div className={styles.emotionAndDateFrame}>
          <div className={styles.emotionContainer}>
            <Image
              src={emotionAsset.icon.s}
              alt={emotionAsset.label}
              width={32}
              height={32}
              className={styles.emotionIcon}
            />
            <span className={styles.emotionText}>{emotionAsset.label}</span>
          </div>
          <div className={styles.dateContainer}>
            <span className={styles.dateText}>{mockDiary.date}</span>
            <span className={styles.dateLabel}>작성</span>
          </div>
        </div>
      </div>

      {/* Detail Content Section - 피그마 3:1083 */}
      <div className={styles.contentSection}>
        <div className={styles.contentArea}>
          <div className={styles.contentLabel}>내용</div>
          <div className={styles.contentText}>{mockDiary.content}</div>
        </div>
        <div className={styles.copyFrame}>
          <div className={styles.copyContainer}>
            <div className={styles.copyIcon}></div>
            <span className={styles.copyText}>내용 복사</span>
          </div>
        </div>
      </div>

      {/* Detail Footer Section - 피그마 3:1092 */}
      <div className={styles.footerSection}>
        <Button
          variant="secondary"
          theme="light"
          size="medium"
          className="w-[51px]"
        >
          수정
        </Button>
        <Button
          variant="secondary"
          theme="light"
          size="medium"
          className="w-[51px]"
        >
          삭제
        </Button>
      </div>
    </div>
  );
};

export default DiariesDetail;
