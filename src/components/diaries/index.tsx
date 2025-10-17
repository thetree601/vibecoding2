"use client";

import React, { useMemo, useState } from "react";
import styles from "./styles.module.css";
import { Selectbox } from "../../commons/components/selectbox";
import { SearchBar } from "../../commons/components/searchbar";
import { Button } from "../../commons/components/button";
import Image from "next/image";
import {
  EMOTIONS,
  EMOTION_ASSETS,
  Emotion,
} from "../../commons/constants/enum";

// Mock data for diary cards - 피그마 디자인과 정확히 일치하도록 수정
const mockDiaries = [
  // 첫 번째 행 (4개)
  {
    id: 1,
    emotion: Emotion.Sad,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다.",
    image: "/images/emotion-sad-m.png",
  },
  {
    id: 2,
    emotion: Emotion.Surprise,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
    image: "/images/emotion-surprise-m.png",
  },
  {
    id: 3,
    emotion: Emotion.Angry,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
    image: "/images/emotion-angry-m.png",
  },
  {
    id: 4,
    emotion: Emotion.Happy,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
    image: "/images/emotion-happy-m.png",
  },
  // 두 번째 행 (4개)
  {
    id: 5,
    emotion: Emotion.Etc,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다.",
    image: "/images/emotion-etc-m.png",
  },
  {
    id: 6,
    emotion: Emotion.Surprise,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
    image: "/images/emotion-surprise-m.png",
  },
  {
    id: 7,
    emotion: Emotion.Angry,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
    image: "/images/emotion-angry-m.png",
  },
  {
    id: 8,
    emotion: Emotion.Happy,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
    image: "/images/emotion-happy-m.png",
  },
  // 세 번째 행 (4개)
  {
    id: 9,
    emotion: Emotion.Sad,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다.",
    image: "/images/emotion-sad-m.png",
  },
  {
    id: 10,
    emotion: Emotion.Surprise,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
    image: "/images/emotion-surprise-m.png",
  },
  {
    id: 11,
    emotion: Emotion.Angry,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
    image: "/images/emotion-angry-m.png",
  },
  {
    id: 12,
    emotion: Emotion.Happy,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
    image: "/images/emotion-happy-m.png",
  },
];

// Diary Card Component
interface DiaryCardProps {
  diary: {
    id: number;
    emotion: Emotion;
    date: string;
    title: string;
    image: string;
  };
}

function DiaryCard({ diary }: DiaryCardProps) {
  const emotionAsset = EMOTION_ASSETS[diary.emotion];

  return (
    <div className={styles.diaryCard}>
      <div className={styles.cardImageContainer}>
        <Image
          src={diary.image}
          alt={diary.title}
          width={274}
          height={208}
          className={styles.cardImage}
        />
        <button className={styles.closeButton}>
          <Image
            src="/icons/close_outline_light_m.svg"
            alt="닫기"
            fill
            className={styles.closeIcon}
          />
        </button>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <span
            className={styles.emotionText}
            style={{ color: emotionAsset.color }}
          >
            {emotionAsset.label}
          </span>
          <span className={styles.dateText}>{diary.date}</span>
        </div>
        <div className={styles.cardTitle}>
          <h3 className={styles.titleText}>{diary.title}</h3>
        </div>
      </div>
    </div>
  );
}

export default function Diaries() {
  const [filterValue, setFilterValue] = useState<string>("all");
  const [searchValue, setSearchValue] = useState<string>("");

  const filterOptions = useMemo(
    () => [
      { label: "전체", value: "all" },
      ...EMOTIONS.map((emotion) => ({
        label: EMOTION_ASSETS[emotion].label,
        value: emotion,
      })),
    ],
    []
  );

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleWriteDiary = () => {
    // TODO: Navigate to diary creation page
    console.log("일기쓰기 버튼 클릭");
  };

  return (
    <div className={styles.container}>
      {/* Gap */}
      <div className={styles.gap}>
        <div className={styles.gapInner}></div>
      </div>

      {/* Search */}
      <div className={styles.search}>
        <div className={styles.searchInner}>
          <div className={styles.searchContent}>
            <div className={styles.searchControls}>
              <Selectbox
                variant="primary"
                theme="light"
                size="medium"
                options={filterOptions}
                value={filterValue}
                onChange={handleFilterChange}
                placeholder="전체"
                className={styles.filterSelect}
              />
              <SearchBar
                variant="primary"
                theme="light"
                size="medium"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="검색어를 입력해 주세요."
                className={styles.searchInput}
              />
            </div>
            <Button
              variant="primary"
              theme="light"
              size="medium"
              onClick={handleWriteDiary}
              className={styles.writeButton}
            >
              <Image
                src="/icons/plus_outline_light_m.svg"
                alt=""
                width={24}
                height={24}
                style={{ marginRight: 8 }}
              />
              일기쓰기
            </Button>
          </div>
        </div>
      </div>

      {/* Gap */}
      <div className={styles.gap}>
        <div className={styles.gapInner}></div>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        <div className={styles.mainInner}>
          <div className={styles.mainContent}>
            <div className={styles.diaryGrid}>
              {mockDiaries.map((diary) => (
                <DiaryCard key={diary.id} diary={diary} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gap */}
      <div className={styles.gap}>
        <div className={styles.gapInner}></div>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationInner}>
          <div className={styles.paginationContent}>
            <div className={styles.paginationPlaceholder}>
              페이지네이션 영역
            </div>
          </div>
        </div>
      </div>

      {/* Gap */}
      <div className={styles.gap}>
        <div className={styles.gapInner}></div>
      </div>
    </div>
  );
}
