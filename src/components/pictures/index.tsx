"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import Selectbox, {
  type SelectboxOption,
} from "@/commons/components/selectbox";

export default function PicturesUI(): JSX.Element {
  const options: SelectboxOption[] = useMemo(
    () => [
      { label: "전체", value: "all" },
      { label: "강아지", value: "dog" },
      { label: "고양이", value: "cat", disabled: true },
    ],
    []
  );

  const [filter, setFilter] = useState<string>("all");

  // Mock images: all use the same asset as required (9 images for 3x3 grid)
  const images = useMemo(
    () =>
      new Array(9).fill(null).map((_, idx) => ({
        id: idx,
        src: "/images/dog-1.jpg",
        alt: "dog",
      })),
    []
  );

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
            options={options}
            value={filter}
            onChange={setFilter}
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
          <div className={styles.grid}>
            {images.map((img) => (
              <div key={img.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1168px) 33vw, 292px"
                    className={styles.image}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}
