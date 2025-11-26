"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import styles from "./MessageBell.module.scss";

export default function MessagesBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("http://localhost:4000/api/contact?isRead=false", {
        signal: controller.signal,
      })
      .then((res) => {
        setUnreadCount(res.data.length);
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return (
    <Link href="/admin/messages" className={styles.wrapper}>
      <div
        className={
          unreadCount > 0
            ? `${styles.icon} ${styles.vibrate}`
            : styles.icon
        }
      >
        💬
      </div>

      {unreadCount > 0 && (
        <span className={styles.badge}>{unreadCount}</span>
      )}
    </Link>
  );
}
