
"use client";

import { useEffect, useState } from "react";
import styles from "./StickyContact.module.scss";
import Link from "next/link";

const SCROLL_TRIGGER = 600; 
export default function StickyContact() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      setVisible(y > SCROLL_TRIGGER);
    }

    handleScroll(); // პირველადაც შეამოწმოს
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`${styles.wrapper} ${
        visible ? styles.wrapperVisible : ""
      }`}
    >
      <div className={styles.bar}>
        <div className={styles.left}>
          <span className={styles.masterName}>პროფესიონალი ხელოსანი</span>
          <span className={styles.subtitle}>
            სამზარეულოები • კარადები • ლოგინები
          </span>
        </div>

        <div className={styles.right}>
          <Link href="tel:+9955XXXXXXX" className={styles.link}>
            📞 +995 595 05 10 43
          </Link>
          <Link href="mailto:gavtadze.1991@mail.ru" className={styles.link}>
            ✉️ gavtadze.1991@mail.ru
          </Link>
        </div>
      </div>
    </div>
  );
}
