// src/components/Header/Nav/Nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.scss";
import { useAdminAuth } from "@/src/Context/AuthContext";

type NavLink = {
  href?: string;
  label: string;
  soon?: boolean;
};

export default function Nav() {
  const { admin } = useAdminAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const publicLinks: NavLink[] = [
    { href: "/", label: "მთავარი" },
    { href: "/project", label: "პროექტები" },
    {  label: "კატალოგი",soon:true },
    { href: "/about", label: "ჩვენს შესახებ" },
    { href: "/contact", label: "საკონტაქტო" },
  ];

  const adminLinks: NavLink[] = [
    { href: "/admin", label: "ადმინ დაფა" },
    { href: "/admin/projects", label: "ნამუშევრები" },
    { href: "/admin/projects/new", label: "დამატება" },
    { href: "/admin/categories", label: "კატეგორიები" },
    { label: "ფოტოები", soon: true },
    { label: "სიახლეების დამატება", soon: true },
   
  ];

  const links = admin ? adminLinks : publicLinks;

  function handleItemClick(link: NavLink) {
    if (!link.href) return; 
    
    setOpen(false);
  }

  return (
    <nav className={styles.navigation}>
      {/* მობილური burger ღილაკი */}
      <button
        type="button"
        className={styles.burger}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.burgerLines}>
          <img src="/icons/burger.svg" width={20} height={20} loading="lazy"/>
        </span>
        <span className={styles.burgerLabel}></span>
      </button>

      {/* მენიუ – desktop-ზე ხაზზე, მობილურზე dropdown */}
      <ul
        className={`${styles.navList} ${
          open ? styles.navListOpen : ""
        }`}
      >
        {links.map((link) => {
          const isActive =
            link.href &&
            (pathname === link.href ||
              (pathname?.startsWith(link.href + "/") ?? false));

          const content = link.href ? (
            <Link href={link.href}>{link.label}</Link>
          ) : (
            <span>{link.label}</span>
          );

          return (
            <li
              key={link.label}
              className={`${styles.links} ${
                isActive ? styles.active : ""
              } ${link.soon ? styles.disabled : ""}`}
              onClick={() => handleItemClick(link)}
            >
              {content}
              {link.soon && (
                <span className={styles.badgeSoon}>მალე</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
