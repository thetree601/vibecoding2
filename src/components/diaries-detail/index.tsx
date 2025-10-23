"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Button } from "../../commons/components/button";
import { Input } from "../../commons/components/input";
import { useDiariesDetailBinding } from "./hooks/index.binding.hook";
import { useRetrospectForm, Retrospect } from "./hooks/index.retrospect.form.hook";

interface DiariesDetailProps {
  // Props can be added later as needed
  [key: string]: unknown;
}

// 실제 데이터 바인딩 훅 사용

const DiariesDetail: React.FC<DiariesDetailProps> = () => {
  const { loaded, diary, emotionAsset } = useDiariesDetailBinding();
  const { form, isSubmitEnabled, onSubmit } = useRetrospectForm();
  const [retrospects, setRetrospects] = useState<Retrospect[]>([]);

  // 로컬스토리지에서 회고 데이터 로드
  useEffect(() => {
    if (diary) {
      try {
        const stored = localStorage.getItem("retrospects");
        const allRetrospects: Retrospect[] = stored ? JSON.parse(stored) : [];
        const diaryRetrospects = allRetrospects.filter(r => r.diaryId === diary.id);
        setRetrospects(diaryRetrospects);
      } catch (error) {
        console.error("회고 데이터 로드 중 오류:", error);
        setRetrospects([]);
      }
    }
  }, [diary]);

  return (
    <div className={styles.container} data-testid="diaries-detail-page-loaded">
      {!loaded && <div data-testid="diaries-detail-loading">Loading...</div>}
      {loaded && !diary && (
        <div data-testid="diaries-detail-not-found">
          일기를 찾을 수 없습니다.
        </div>
      )}
      {loaded && diary && emotionAsset && (
        <>
          {/* Detail Title Section - 피그마 3:1073 */}
          <div className={styles.titleSection}>
            <div className={styles.titleFrame}>
              <div className={styles.titleText} data-testid="diary-title">
                {diary.title}
              </div>
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
                <span
                  className={styles.emotionText}
                  data-testid="diary-emotion"
                >
                  {emotionAsset.label}
                </span>
              </div>
              <div className={styles.dateContainer}>
                <span className={styles.dateText} data-testid="diary-createdAt">
                  {new Date(diary.createdAt)
                    .toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    .replace(/\./g, ".")
                    .replace(/\.$/, "")}
                </span>
                <span className={styles.dateLabel}>작성</span>
              </div>
            </div>
          </div>

          {/* Detail Content Section - 피그마 3:1083 */}
          <div className={styles.contentSection}>
            <div className={styles.contentArea}>
              <div className={styles.contentLabel}>내용</div>
              <div className={styles.contentText} data-testid="diary-content">
                {diary.content}
              </div>
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
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const content = formData.get('content') as string;
                if (content && content.trim()) {
                  onSubmit({ content: content.trim() });
                }
              }} className={styles.retrospectInputFrame}>
                <Input
                  variant="primary"
                  theme="light"
                  size="medium"
                  placeholder="회고를 남겨보세요."
                  {...form.register("content")}
                  className={styles.retrospectInputField}
                />
                <Button
                  type="submit"
                  variant="primary"
                  theme="light"
                  size="medium"
                  className={styles.retrospectSubmitButton}
                  disabled={!isSubmitEnabled}
                >
                  입력
                </Button>
              </form>
            </div>

            {/* Retrospect List - 피그마 3:1105 */}
            <div className={styles.retrospectList}>
              {retrospects.map((retrospect, index) => (
                <div key={retrospect.id}>
                  <div className={styles.retrospectItem}>
                    <div className={styles.retrospectText}>
                      {retrospect.content}
                    </div>
                    <div className={styles.retrospectDate}>
                      [{new Date(retrospect.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }).replace(/\./g, ".").replace(/\.$/, "")}]
                    </div>
                  </div>
                  {index < retrospects.length - 1 && (
                    <div className={styles.retrospectDivider}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiariesDetail;
