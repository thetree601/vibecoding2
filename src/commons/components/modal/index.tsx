"use client";

import React from "react";
import { Button } from "../button";
import styles from "./styles.module.css";

export interface ModalProps {
  /**
   * 모달의 변형 스타일
   */
  variant?: "info" | "danger";

  /**
   * 모달의 액션 타입
   */
  actions?: "single" | "dual";

  /**
   * 테마 모드
   */
  theme?: "light" | "dark";

  /**
   * 모달 제목
   */
  title: string;

  /**
   * 모달 내용
   */
  content: string;

  /**
   * 단일 액션 버튼 텍스트
   */
  singleActionText?: string;

  /**
   * 이중 액션 버튼 텍스트 (첫 번째)
   */
  dualActionFirstText?: string;

  /**
   * 이중 액션 버튼 텍스트 (두 번째)
   */
  dualActionSecondText?: string;

  /**
   * 단일 액션 버튼 클릭 핸들러
   */
  onSingleAction?: () => void;

  /**
   * 이중 액션 첫 번째 버튼 클릭 핸들러
   */
  onDualActionFirst?: () => void;

  /**
   * 이중 액션 두 번째 버튼 클릭 핸들러
   */
  onDualActionSecond?: () => void;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * Modal 컴포넌트
 *
 * Figma 디자인을 기반으로 한 모달 컴포넌트입니다.
 * variant, actions, theme 시스템을 지원합니다.
 *
 * @example
 * ```tsx
 * <Modal
 *   variant="info"
 *   actions="single"
 *   theme="light"
 *   title="일기 등록 완료"
 *   content="등록이 완료 되었습니다."
 *   singleActionText="확인"
 *   onSingleAction={() => console.log('확인')}
 * />
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  variant = "info",
  actions = "single",
  theme = "light",
  title,
  content,
  singleActionText = "확인",
  dualActionFirstText = "계속 작성",
  dualActionSecondText = "등록 취소",
  onSingleAction,
  onDualActionFirst,
  onDualActionSecond,
  className = "",
}) => {
  // variant는 향후 확장을 위해 유지 (현재는 info/danger 구분 없음)
  const modalClasses = [
    styles.modal,
    styles[variant],
    styles[actions],
    styles[theme],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // variant 사용 (향후 확장 가능)
  const isDangerVariant = variant === "danger";

  return (
    <div className={modalClasses}>
      <div className={styles.content}>
        <div className={styles.textArea}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{content}</p>
          {/* variant 사용 예시 (향후 확장 가능) */}
          {isDangerVariant && (
            <div style={{ display: "none" }}>Danger variant</div>
          )}
        </div>

        <div className={styles.buttonArea}>
          {actions === "single" ? (
            <Button
              variant="primary"
              theme="light"
              size="medium"
              onClick={onSingleAction}
              className={styles.singleButton}
            >
              {singleActionText}
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                theme="light"
                size="medium"
                onClick={onDualActionFirst}
                className={styles.dualButton}
              >
                {dualActionFirstText}
              </Button>
              <Button
                variant="primary"
                theme="light"
                size="medium"
                onClick={onDualActionSecond}
                className={styles.dualButton}
              >
                {dualActionSecondText}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
