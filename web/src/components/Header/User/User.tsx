"use client";

import { useState } from "react";
import { useAdminAuth } from "@/src/Context/AuthContext";
import Link from "next/link";
import styles from "./User.module.scss";
import { useRouter } from "next/navigation";


export default function User() {
  const router = useRouter();
  const { admin, loading, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <p>იტვირთება...</p>;
  }


  if (!admin) {
    return (
      <button className={styles.LoginButton}>
        <Link href="/auth/login">Me</Link>
      </button>
    );
  }


  return (
    <div className={styles.profileWrapper}>
      <button
        type="button"
        className={styles.profileTrigger}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.name}>{admin.name}</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.avatarImage}>
            <img src="/icons/admin.svg" width={30} height={30} loading="lazy"/>
          </div>
          <p className={styles.greeting}>გამარჯობა, {admin.name}</p>

          <button
            type="button"
            className={styles.menuItem}
            onClick={() => {
              setOpen(false);
              router.push("/admin");
            }}
          >
            პირადი კაბინეტი
          </button>

          <button
            type="button"
            className={styles.menuItemDanger}
            onClick={() => {
              setOpen(false);
              logout();
              router.push("/")
            }}
          >
            გასვლა
          </button>
        </div>
      )}
    </div>
  );
}
