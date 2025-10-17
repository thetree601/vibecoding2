"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Button } from "../../commons/components/button";
import { Input } from "../../commons/components/input";
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

// Mock retrospect 데이터
const mockRetrospects = [
  {
    id: 1,
    text: "3년이 지나고 다시 보니 이때가 그립다.",
    date: "2024. 09. 24",
  },
  {
    id: 2,
    text: "그때는 정말 힘들었는데 지금 생각해보니 좋은 추억이 되었어요.",
    date: "2024. 09. 25",
  },
];

const DiariesDetail: React.FC<DiariesDetailProps> = () => {
  const emotionAsset = EMOTION_ASSETS[mockDiary.emotion];
  const [retrospectInput, setRetrospectInput] = useState("");

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
          variant="tertiary"
          theme="light"
          size="medium"
          className={styles.editButton}
        >
          수정
        </Button>
        <Button
          variant="tertiary"
          theme="light"
          size="medium"
          className={styles.deleteButton}
        >
          삭제
        </Button>
      </div>

      {/* Retrospect Section - 피그마 3:1098, 3:1105 */}
      <div className={styles.retrospectSection}>
        {/* Retrospect Input - 피그마 3:1098 */}
        <div className={styles.retrospectInput}>
          <div className={styles.retrospectLabel}>회고</div>
          <div className={styles.retrospectInputFrame}>
            <Input
              variant="primary"
              theme="light"
              size="medium"
              placeholder="회고를 남겨보세요."
              value={retrospectInput}
              onChange={(e) => setRetrospectInput(e.target.value)}
              className={styles.retrospectInputField}
            />
            <Button
              variant="primary"
              theme="light"
              size="medium"
              className={styles.retrospectSubmitButton}
            >
              입력
            </Button>
          </div>
        </div>

        {/* Retrospect List - 피그마 3:1105 */}
        <div className={styles.retrospectList}>
          {mockRetrospects.map((retrospect, index) => (
            <div key={retrospect.id}>
              <div className={styles.retrospectItem}>
                <div className={styles.retrospectText}>{retrospect.text}</div>
                <div className={styles.retrospectDate}>[{retrospect.date}]</div>
              </div>
              {index < mockRetrospects.length - 1 && (
                <div className={styles.retrospectDivider}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiariesDetail;
