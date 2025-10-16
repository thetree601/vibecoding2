"use client";

import React, { useMemo, useState } from "react";
import styles from "./styles.module.css";
import { Selectbox } from "../../commons/components/selectbox";
import { SearchBar } from "../../commons/components/searchbar";
import { Button } from "../../commons/components/button";
import Image from "next/image";
import { EMOTIONS, EMOTION_ASSETS } from "../../commons/constants/enum";

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
            <div className={styles.mainPlaceholder}>메인 콘텐츠 영역</div>
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
