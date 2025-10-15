"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { Selectbox } from "../../commons/components/selectbox";
import { SearchBar } from "../../commons/components/searchbar";
import { Button } from "../../commons/components/button";

export default function Diaries() {
  const [filterValue, setFilterValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const filterOptions = [
    { label: "전체", value: "all" },
    { label: "최신순", value: "latest" },
    { label: "오래된순", value: "oldest" },
    { label: "제목순", value: "title" },
  ];

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
              <Button
                variant="primary"
                theme="light"
                size="medium"
                onClick={handleWriteDiary}
                className={styles.writeButton}
              >
                일기쓰기
              </Button>
            </div>
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
