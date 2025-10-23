"use client";

import React, { useMemo, useState } from "react";
import styles from "./styles.module.css";
import { Selectbox } from "../../commons/components/selectbox";
import { SearchBar } from "../../commons/components/searchbar";
import { Button } from "../../commons/components/button";
import { Pagination } from "../../commons/components/pagination";
import Image from "next/image";
import {
  EMOTIONS,
  EMOTION_ASSETS,
  Emotion,
} from "../../commons/constants/enum";
import { useDiaryModal } from "./hooks/index.link.modal.hook";
import { useDiariesBinding } from "./hooks/index.binding.hook";
import { useDiariesLinkRouting } from "./hooks/index.link.routing.hook";
import { useDiariesSearch } from "./hooks/index.search.hook";

// Diary Card Component
interface DiaryCardProps {
  diary: {
    id: number;
    emotion: Emotion;
    date: string;
    title: string;
    image: string;
  };
  onCardClick: (id: number) => void;
  onDeleteClick: (event: React.MouseEvent) => void;
}

function DiaryCard({ diary, onCardClick, onDeleteClick }: DiaryCardProps) {
  const emotionAsset = EMOTION_ASSETS[diary.emotion];

  return (
    <div
      className={styles.diaryCard}
      data-testid={`diary-card-${diary.id}`}
      onClick={() => onCardClick(diary.id)}
    >
      <div className={styles.cardImageContainer}>
        <Image
          src={diary.image}
          alt={diary.title}
          width={274}
          height={208}
          className={styles.cardImage}
        />
        <button className={styles.closeButton} onClick={onDeleteClick}>
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
            data-testid="diary-emotion"
          >
            {emotionAsset.label}
          </span>
          <span className={styles.dateText} data-testid="diary-date">
            {diary.date}
          </span>
        </div>
        <div className={styles.cardTitle}>
          <h3 className={styles.titleText} data-testid="diary-title">
            {diary.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function Diaries() {
  const [filterValue, setFilterValue] = useState<string>("all");
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { openDiaryModal } = useDiaryModal();
  const { loaded, diaries } = useDiariesBinding();
  const { handleCardClick, handleDeleteClick } = useDiariesLinkRouting();
  const { filteredDiaries } = useDiariesSearch({ diaries, searchValue });

  // 검색된 일기들을 카드 형태로 변환
  const searchResultCards = useMemo(() => {
    return filteredDiaries.map((diary) => {
      const emotionAsset = EMOTION_ASSETS[diary.emotion];
      const createdDate = new Date(diary.createdAt);
      const formattedDate = createdDate
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\./g, ". ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\.$/, "");

      // 제목이 길 경우 "..." 처리 (카드 크기에 맞게 조정)
      const truncatedTitle =
        diary.title.length > 20
          ? diary.title.substring(0, 20) + "..."
          : diary.title;

      return {
        id: diary.id,
        emotion: diary.emotion,
        date: formattedDate,
        title: truncatedTitle,
        image: emotionAsset.icon.m,
      };
    });
  }, [filteredDiaries]);

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
    openDiaryModal();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Show loading state while data is being fetched
  if (!loaded) {
    return (
      <div className={styles.container} data-testid="diaries-page-loaded">
        <div className={styles.gap}>
          <div className={styles.gapInner}></div>
        </div>
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
                data-testid="write-diary-button"
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
        <div className={styles.gap}>
          <div className={styles.gapInner}></div>
        </div>
        <div className={styles.main}>
          <div className={styles.mainInner}>
            <div className={styles.mainContent}>
              <div className={styles.diaryGrid}>{/* Loading state */}</div>
            </div>
          </div>
        </div>
        <div className={styles.gap}>
          <div className={styles.gapInner}></div>
        </div>
        <div className={styles.pagination}>
          <div className={styles.paginationInner}>
            <div className={styles.paginationContent}>
              <Pagination
                currentPage={currentPage}
                totalPages={1}
                onChange={handlePageChange}
                variant="primary"
                theme="light"
                size="medium"
                showArrows={true}
                showEdgeButtons={false}
                maxVisible={5}
              />
            </div>
          </div>
        </div>
        <div className={styles.gap}>
          <div className={styles.gapInner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid="diaries-page-loaded">
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
              data-testid="write-diary-button"
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
              {searchResultCards.map((diary) => (
                <DiaryCard
                  key={diary.id}
                  diary={diary}
                  onCardClick={handleCardClick}
                  onDeleteClick={handleDeleteClick}
                />
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
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(searchResultCards.length / 12) || 1}
              onChange={handlePageChange}
              variant="primary"
              theme="light"
              size="medium"
              showArrows={true}
              showEdgeButtons={false}
              maxVisible={5}
            />
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
