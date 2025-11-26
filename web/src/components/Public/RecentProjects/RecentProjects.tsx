// src/components/RecentProjects/RecentProjects.tsx

"use client";

import Image from "next/image";
import styles from "./RecentProjects.module.scss";
import Link from "next/link";

const projects = [
  {
    src: "/WhatsAplaS.jpg",
    title: "საძინებელი ოთახი",
    location: "ბათუმი 2025 წ.",
  },
  {
    src: "/WhatsApp1.jpg",
    title: "სამზარეულო",
    location: "ბათუმი 2025 წ.",
  },
  {
    src: "/WhatsApp2.jpg",
    title: "სამზარეულო ოთახი",
    location: "ბათუმი 2025 წ.",
  },
  {
    src: "/WhatsApp3.jpg",
    title: "ლოგინი",
    location: "ბათუმი 2025 წ.",
  },
];

const extendedProjects = [...projects, ...projects];

export default function RecentProjects() {
  return (
    <section className={styles.section}>
      <div>
      <h2 className={styles.heading}>ბოლო პროექტები</h2>
      <div className={styles.lines}/>
</div>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {extendedProjects.map((p, index) => (
            <div className={styles.card} key={`${p.title}-${index}`}>
              <div className={styles.imageWrapper}>
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  className={styles.image}
                />
                <div className={styles.overlay} />
              </div>

              <div className={styles.info}>
                <p className={styles.title}>{p.title}</p>
                <p className={styles.location}>{p.location}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <Link href="/project" className={styles.wiewMore}> <p>მეტის ნახვა</p>
        <img src="/icons/point.svg" width={60} height={60} loading="lazy" />
      </Link>

    </section>
  );
}
