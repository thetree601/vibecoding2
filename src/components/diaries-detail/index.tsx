"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Button } from "../../commons/components/button";
import { Input } from "../../commons/components/input";
import { useDiariesDetailBinding } from "./hooks/index.binding.hook";
import { useRetrospectForm } from "./hooks/index.retrospect.form.hook";
import { useRetrospectBinding } from "./hooks/index.retrospect.binding.hook";
import { useDiaryUpdate } from "./hooks/index.update.hook";
import { useDiaryDelete } from "./hooks/index.delete.hook";
import { Emotion, EMOTION_ASSETS } from "../../commons/constants/enum";

interface DiariesDetailProps {
  // Props can be added later as needed
  [key: string]: unknown;
}

// 실제 데이터 바인딩 훅 사용

const DiariesDetail: React.FC<DiariesDetailProps> = () => {
  const { loaded, diary, emotionAsset } = useDiariesDetailBinding();
  const { form, isSubmitEnabled, onSubmit } = useRetrospectForm();
  const { retrospects } = useRetrospectBinding();
  const {
    isEditMode,
    isSubmitting,
    isFormValid,
    form: editForm,
    enterEditMode,
    exitEditMode,
    onSubmit: onEditSubmit,
  } = useDiaryUpdate();

  const { openDeleteModal } = useDiaryDelete();

  // 회고 데이터를 최신 순으로 정렬
  const sortedRetrospects = [...retrospects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // 일기 업데이트 이벤트 리스너 (페이지 새로고침 없이)
  useEffect(() => {
    const handleDiaryUpdate = () => {
      // 데이터가 이미 업데이트되었으므로 추가 작업 불필요
    };

    window.addEventListener("diaryUpdated", handleDiaryUpdate);
    return () => window.removeEventListener("diaryUpdated", handleDiaryUpdate);
  }, []);

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
          {!isEditMode ? (
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
                    <span
                      className={styles.dateText}
                      data-testid="diary-createdAt"
                    >
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
                  <div
                    className={styles.contentText}
                    data-testid="diary-content"
                  >
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
                  data-testid="edit-button"
                  onClick={() => enterEditMode(diary)}
                >
                  수정
                </Button>
                <Button
                  variant="tertiary"
                  theme="light"
                  size="medium"
                  className={styles.deleteButton}
                  data-testid="delete-button"
                  onClick={() => diary && openDeleteModal(diary.id)}
                >
                  삭제
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode - 피그마 3:1224 */}
              <div className={styles.editMode} data-testid="edit-mode">
                <form
                  onSubmit={editForm.handleSubmit((data) =>
                    onEditSubmit(data, diary.id)
                  )}
                  className={styles.editForm}
                >
                  {/* 기분 선택 영역 - 피그마 3:1225 */}
                  <div className={styles.editEmotionSection}>
                    <div className={styles.editEmotionTitle}>
                      오늘 기분은 어땟나요?
                    </div>
                    <div className={styles.editEmotionOptions}>
                      {Object.values(Emotion).map((emotion) => (
                        <label
                          key={emotion}
                          className={styles.editEmotionOption}
                        >
                          <input
                            type="radio"
                            {...editForm.register("emotion")}
                            value={emotion}
                            data-testid={`edit-emotion-${emotion.toLowerCase()}`}
                            className={styles.editEmotionRadio}
                          />
                          <span className={styles.editEmotionLabel}>
                            {EMOTION_ASSETS[emotion].label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 제목 입력 - 피그마 3:1233 */}
                  <div className={styles.editTitleSection}>
                    <div className={styles.editTitleLabel}>제목</div>
                    <div className={styles.editTitleInputWrapper}>
                      <input
                        {...editForm.register("title")}
                        data-testid="edit-title-input"
                        className={styles.editTitleInput}
                        placeholder="제목을 입력하세요"
                      />
                    </div>
                  </div>

                  {/* 내용 입력 - 피그마 3:1237 */}
                  <div className={styles.editContentSection}>
                    <div className={styles.editContentLabel}>내용</div>
                    <div className={styles.editContentInputWrapper}>
                      <textarea
                        {...editForm.register("content")}
                        data-testid="edit-content-input"
                        className={styles.editContentTextarea}
                        placeholder="내용을 입력하세요"
                        rows={5}
                      />
                    </div>
                  </div>

                  {/* 버튼 영역 - 피그마 3:1241 */}
                  <div className={styles.editFooterSection}>
                    <button
                      type="button"
                      onClick={exitEditMode}
                      data-testid="cancel-edit-button"
                      className={styles.editCancelButton}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      data-testid="submit-edit-button"
                      className={styles.editSubmitButton}
                    >
                      {isSubmitting ? "수정 중..." : "수정 하기"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* Retrospect Section - 피그마 3:1098, 3:1105, 3:1247 */}
          <div className={styles.retrospectSection}>
            {/* Retrospect Input - 피그마 3:1098, 3:1247 */}
            <div className={styles.retrospectInput}>
              <div className={styles.retrospectLabel}>회고</div>
              {isEditMode ? (
                /* 수정중일땐 회고를 작성할 수 없어요 - 피그마 3:1247 */
                <div className={styles.retrospectDisabledFrame}>
                  <div className={styles.retrospectDisabledInput}>
                    <span
                      className={styles.retrospectDisabledText}
                      data-testid="retrospect-disabled-text"
                    >
                      수정중일땐 회고를 작성할 수 없어요.
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled
                    className={styles.retrospectDisabledButton}
                    data-testid="retrospect-disabled-button"
                  >
                    입력
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const content = formData.get("content") as string;
                    if (content && content.trim()) {
                      onSubmit({ content: content.trim() });
                    }
                  }}
                  className={styles.retrospectInputFrame}
                >
                  <Input
                    variant="primary"
                    theme="light"
                    size="medium"
                    placeholder="회고를 남겨보세요."
                    {...form.register("content")}
                    className={styles.retrospectInputField}
                    data-testid="retrospect-input"
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
              )}
            </div>

            {/* Retrospect List - 피그마 3:1105 */}
            <div className={styles.retrospectList}>
              {sortedRetrospects.map((retrospect, index) => (
                <div key={retrospect.id}>
                  <div className={styles.retrospectItem}>
                    <div className={styles.retrospectText}>
                      {retrospect.content}
                    </div>
                    <div className={styles.retrospectDate}>
                      [
                      {new Date(retrospect.createdAt)
                        .toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(/\./g, ".")
                        .replace(/\.$/, "")}
                      ]
                    </div>
                  </div>
                  {index < sortedRetrospects.length - 1 && (
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
