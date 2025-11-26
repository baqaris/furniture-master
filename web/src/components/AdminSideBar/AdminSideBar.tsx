// src/components/AdminSideBar/AdminSideBar.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./AdminSideBar.module.scss";

type MenuItem = {
  label: string;
  path?: string;
  soon?: boolean;
};

const menuItems: MenuItem[] = [
  { label: "მთავარი", path: "/admin" },
  { label: "ნამუშევრები", path: "/admin/projects" },
  { label: "კატეგორიები", path: "/admin/categories" },
  {label:"შეტყობინებები" , path: "/admin/messages"},
  { label: "მასალა", path: "/admin/storages" },
  {label:"კატალოგი", soon:true},
  { label: "შეკვეთები", soon: true },
  { label: "ხელოსნები", soon: true },
];

export default function AdminSideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(
    (item: MenuItem) => {
      if (!item.path) return;
      router.push(item.path);
      setIsOpen(false); // მობილურზე დახურე მენიუ გადასვლის შემდეგ
    },
    [router],
  );

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <>
      {/* მობილური toggle ღილაკი */}
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={toggle}
      >
        <img src="/icons/sidebar.svg" width={20} height={20} loading="lazy" />
      </button>

      {/* sidebar */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.logoBox}>
          <div className={styles.logoCircle}>F</div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Furniture Admin</span>
            <span className={styles.logoSubtitle}>კაბინეტი</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.menu}>
            {menuItems.map((item) => {
              const isActive =
                item.path &&
                (pathname === item.path ||
                  (pathname?.startsWith(item.path + "/") ?? false));

              return (
                <li
                  key={item.label}
                  className={`${styles.menuItem} ${
                    isActive ? styles.menuItemActive : ""
                  } ${item.soon ? styles.menuItemDisabled : ""}`}
                  onClick={() => handleClick(item)}
                >
                  <div className={styles.menuBullet} />
                  <span className={styles.menuLabel}>{item.label}</span>
                  {item.soon && (
                    <span className={styles.badgeSoon}>მალე</span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* მუქი ფონური ფენა, მხოლოდ მობილურზე როცა გახსნილია */}
      {isOpen && <div className={styles.backdrop} onClick={close} />}
    </>
  );
}
