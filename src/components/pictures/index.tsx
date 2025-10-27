"use client";

import React, { memo } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Selectbox } from "@/commons/components/selectbox";
import { usePicturesBinding } from "./hooks/index.binding.hook";
import { usePicturesFilter } from "./hooks/index.filter.hook";

function PicturesUI(): JSX.Element {
  const { selectedFilter, setSelectedFilter, filterSize, filterOptions } =
    usePicturesFilter();

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value as "default" | "landscape" | "portrait");
  };

  const { images, isInitialLoading, isError, errorMessage, sentinelRef } =
    usePicturesBinding();

  return (
    <section className={styles.container}>
      <div className={styles.gapTop} aria-hidden>
        <div className={styles.gapTopInner} />
      </div>

      <div className={styles.filter}>
        <div className={styles.filterInner}>
          <Selectbox
            variant="primary"
            theme="light"
            size="medium"
            options={filterOptions}
            value={selectedFilter}
            onChange={handleFilterChange}
            className={styles.selectWidth}
            aria-label="사진 필터"
          />
        </div>
      </div>

      <div className={styles.gapMiddle} aria-hidden>
        <div className={styles.gapMiddleInner} />
      </div>

      <main className={styles.main}>
        <div className={styles.mainInner}>
          {isError ? (
            <div role="alert" aria-live="assertive">
              {errorMessage ?? "에러가 발생했습니다."}
            </div>
          ) : (
            <div className={styles.grid} data-testid="pictures-grid">
              {(isInitialLoading ? new Array(6).fill(null) : images).map(
                (item, idx) => (
                  <div
                    key={idx}
                    className={styles.card}
                    style={{
                      width: `${filterSize.width}px`,
                      height: `${filterSize.height}px`,
                    }}
                  >
                    <div className={styles.imageWrap}>
                      {isInitialLoading ? (
                        <div
                          data-testid="skeleton"
                          className={styles.skeleton}
                        />
                      ) : (
                        <Image
                          src={item as string}
                          alt="dog"
                          fill
                          sizes={`(max-width: 1168px) ${filterSize.width}px`}
                          className={styles.image}
                        />
                      )}
                    </div>
                  </div>
                )
              )}
              {/* sentinel for infinite scroll */}
              <div ref={sentinelRef} data-testid="pictures-sentinel" />
            </div>
          )}
        </div>
      </main>
    </section>
  );
}

export default memo(PicturesUI, () => {
  // props가 변경되지 않으면 리렌더링 방지
  return true;
});
