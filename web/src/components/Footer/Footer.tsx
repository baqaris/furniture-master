

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Footer.module.scss";

export default function Footer() {
  const year = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();

  // ამოვიღოთ მიმდინარე ენა URL-დან
  const currentLocale = pathname?.split("/")[1] || "ka";

  // ენის შეცვლა
  function changeLang(lang: string) {
    const parts = pathname.split("/");
    parts[1] = lang; // ვცვლით ლოკალს URL-ში
    router.push(parts.join("/"));
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* ბრენდი */}
        <div className={styles.brand}>
          <p className={styles.brandTitle}>პროფესიონალი ხელოსანი</p>
          <p className={styles.brandSubtitle}>ავეჯის ინდივიდუალური სტუდია</p>
        </div>

        {/* ლინკები */}
        <nav className={styles.links}>
          <Link href={`/project`}>პროექტები</Link>
          <Link href={`/about`}>როგორ ვმუშაობთ</Link>
          <Link href={`/contact`}>კონტაქტი</Link>
        </nav>

        {/* ენა + სოციალური */}
        <div className={styles.rightSide}>
          <div className={styles.languageSwitch}>
            <button
              onClick={() => changeLang("ka")}
              className={currentLocale === "ka" ? styles.langActive : styles.lang}
            >
              GEO
            </button>

            <span className={styles.langDivider}>/</span>

            <button
              onClick={() => changeLang("en")}
              className={currentLocale === "en" ? styles.langActive : styles.lang}
            >
              ENG
            </button>

            <span className={styles.langDivider}>/</span>

            <button
              onClick={() => changeLang("ru")}
              className={currentLocale === "ru" ? styles.langActive : styles.lang}
            >
              RU
            </button>
          </div>

          <div className={styles.socials}>
            <a href="#" aria-label="Facebook" className={styles.social}>
              <img
                src="/icons/facebook-color-svgrepo-com.svg"
                loading="lazy"
                width={28}
                height={28}
              />
            </a>

            <a href="#" aria-label="Instagram" className={styles.social}>
              <img
                src="/icons/instagram-1-svgrepo-com.svg"
                loading="lazy"
                width={30}
                height={30}
              />
            </a>

            <a href="#" aria-label="YouTube" className={styles.social}>
              <img
                src="/icons/youtube.svg"
                loading="lazy"
                width={35}
                height={35}
              />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {year} პროფესიონალი ხელოსანი. ყველა უფლება დაცულია.</p>
        <p className={styles.linkedin}>Created by <Link href="https://linkedin.com/in/bakar-melashvili" target="_blank"><img src="/icons/linkedin.svg" width={20} height={20}/></Link></p>
      </div>
    </footer>
  );
}
