"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { Input } from "../../commons/components/input";
import { Button } from "../../commons/components/button";
import {
  EMOTIONS,
  EMOTION_ASSETS,
  Emotion,
} from "../../commons/constants/enum";

export default function DiariesNew() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleEmotionChange = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleClose = () => {
    // TODO: Implement close modal logic
    console.log("Close modal");
  };

  const handleRegister = () => {
    // TODO: Implement register diary logic
    console.log("Register diary", { selectedEmotion, title, content });
  };

  return (
    <div className={styles.wrapper}>
      {/* Header section */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>일기 쓰기</h1>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Emotion box section */}
      <div className={styles.emotionBox}>
        <h2 className={styles.emotionTitle}>오늘 기분은 어땠나요?</h2>
        <div className={styles.emotionOptions}>
          {EMOTIONS.map((emotion) => (
            <label key={emotion} className={styles.emotionOption}>
              <input
                type="radio"
                name="emotion"
                value={emotion}
                checked={selectedEmotion === emotion}
                onChange={() => handleEmotionChange(emotion)}
                className={styles.radioInput}
              />
              <span className={styles.radioLabel}>
                {EMOTION_ASSETS[emotion].label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Input title section */}
      <div className={styles.inputTitle}>
        <label className={styles.inputLabel}>제목</label>
        <Input
          variant="primary"
          theme="light"
          size="medium"
          placeholder="제목을 입력합니다."
          value={title}
          onChange={handleTitleChange}
          className={styles.titleInput}
        />
      </div>

      {/* Gap */}
      <div className={styles.gapSmall}></div>

      {/* Input content section */}
      <div className={styles.inputContent}>
        <label className={styles.inputLabel}>내용</label>
        <textarea
          className={styles.contentTextarea}
          placeholder="내용을 입력합니다."
          value={content}
          onChange={handleContentChange}
        />
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Footer section */}
      <div className={styles.footer}>
        <Button
          variant="secondary"
          theme="light"
          size="medium"
          onClick={handleClose}
          className={styles.closeButton}
        >
          닫기
        </Button>
        <Button
          variant="primary"
          theme="light"
          size="medium"
          onClick={handleRegister}
          className={styles.registerButton}
        >
          등록하기
        </Button>
      </div>

      {/* Bottom space (remaining 48px) */}
      <div className={styles.bottomSpace}></div>
    </div>
  );
}
