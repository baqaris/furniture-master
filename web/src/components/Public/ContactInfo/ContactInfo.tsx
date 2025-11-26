"use client";

import Link from "next/link";
import styles from "./ContactInfo.module.scss";

export default function ContactInfo() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.heading}>მზად ხარ შეკვეთისთვის?</h2>
        <p className={styles.text}>
          დაგვიკავშირდით და ერთად შევქმნათ ავეჯი, რომელიც ზუსტად თქვენს სახლს მოერგება.
        </p>
      </div>

      <div className={styles.actions}>
        <a href="tel:+9955XXXXXXXX" className={styles.primary}>
          დარეკვა
        </a>
        <Link href="/contact" className={styles.secondary}>
          მოთხოვნა
        </Link>
      </div>
    </section>
  );
}
