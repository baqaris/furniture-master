
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PublicPage.module.scss";

type Slide = {
  src: string;
  alt: string;
  label: string;
};

const slides: Slide[] = [
  {
    src: "/Moder.jpg",
    alt: "Modern custom kitchen furniture",
    label: "Kitchen remodel",
  },
  {
    src: "/3_luxury-kitchens--1466x1080.jpg",
    alt: "Built-in wardrobe",
    label: "Wardrobe installation",
  },
  {
    src: "/1_luxury-kitchens-.jpg",
    alt: "Custom bed with storage",
    label: "Bedroom project",
  },
];

export default function PublicPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  // მარტივი autoslide
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(id);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className={styles.hero}>
      {/* Background image */}
      <div className={styles.heroMedia}>
        <Image
          key={activeSlide.src}
          src={activeSlide.src}
          alt={activeSlide.alt}
          fill
          priority
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
      </div>

      {/* Content */}
      <div className={styles.heroContent}>
        <p className={styles.kicker}>ავეჯის ინდივიდუალური სტუდიო</p>

        <h1 className={styles.title}>
          ავეჯი
          <br />
          შენი სახლისთვის
        </h1>

        <p className={styles.subtitle}>
          სამზარეულოები • გარდერობები • საწოლები • მისაღები სივრცე და სხვა
        </p>

        <p className={styles.description}>
          ხელით შექმნილი ხარისხი. დროული მიწოდება
        </p>

        <div className={styles.actions}>
          <Link href="/project" className={styles.primaryButton}>
           <strong>დაათვალიერე გალერეა</strong> 
          </Link>
          <Link href="/contact" className={styles.secondaryButton}>
            საკონტაქტო
          </Link>
        </div>

        <div className={styles.meta}>
          <span className={styles.dot} />
          <span>Batumi – ბათუმის ტერიტორია</span>
        </div>
      </div>

      {/* Slider bullets */}
      <div className={styles.bullets}>
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            className={
              index === activeIndex
                ? `${styles.bullet} ${styles.bulletActive}`
                : styles.bullet
            }
            onClick={() => setActiveIndex(index)}
            aria-label={slide.label}
          />
        ))}
      </div>
    </section>
  );
}
