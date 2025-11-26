// app/admin/layout.tsx
import type { ReactNode } from "react";
import styles from "./page.module.scss";
import "../globals.scss"; 
import AdminSideBar from "@/src/components/AdminSideBar/AdminSideBar";
import MessagesBell from "@/src/components/MessageBell/MessageBell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className={styles.body}>
    <AdminSideBar/>
    {children}
      <MessagesBell/>
    </div>
}
