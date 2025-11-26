// app/admin/categories/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./page.module.scss";

import { useAdminAuth } from "@/src/Context/AuthContext";
import {
  fetchCategories,
  deleteCategory,
  type Category,
} from "@/src/lib/categories";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { admin, loading: authLoading } = useAdminAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // მოდალის state – რომელი კატეგორიაა წასაშლელი
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // auth guard
  useEffect(() => {
    if (!authLoading && !admin) {
      router.push("/auth/login");
    }
  }, [admin, authLoading, router]);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchCategories(controller.signal)
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error(err);
        setError("ვერ წავიკითხე კატეგორიები");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // ძველი window.confirm-ის ნაცვლად – უბრალოდ ვხსნით modal-ს
  function handleDelete(id: number) {
    setConfirmDeleteId(id);
  }

  async function handleConfirmDelete() {
    if (confirmDeleteId == null) return;

    try {
      await deleteCategory(confirmDeleteId);
      setCategories((prev) => prev.filter((c) => c.id !== confirmDeleteId));
    } catch (err) {
      console.error(err);
      setError("ვერ წავშალე კატეგორია");
    } finally {
      setConfirmDeleteId(null);
    }
  }

  function handleCancelDelete() {
    setConfirmDeleteId(null);
  }

  if (authLoading) {
    return <p className={styles.centerText}>იტვირთება...</p>;
  }

  if (!admin) {
    return <p className={styles.centerText}>არაავტორიზირებული</p>;
  }

  return (
    <div className={styles.body}>
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>კატეგორიები</h1>
          <Link href="/admin/categories/new" className={styles.addButton}>
            + დაამატე კატეგორია
          </Link>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p className={styles.centerText}>იტვირთება კატეგორიები...</p>
        ) : categories.length === 0 ? (
          <p className={styles.centerText}>
            ჯერ არ გაქვს შექმნილი კატეგორია. დააჭირე &quot;დაამატე კატეგორია&quot;
            ღილაკს.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>სურათი</th>
                <th>სახელი</th>
                <th>აღწერა</th>
                <th>ქმედებები</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td data-label="ID">{cat.id}</td>
                  <td data-label="სურათი">
                    <div className={styles.thumbWrapper}>
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className={styles.thumb}
                      />
                    </div>
                  </td>
                  <td data-label="სახელი" className={styles.nameCell}>
                    {cat.name}
                  </td>
                  <td
                    data-label="აღწერა"
                    className={styles.descriptionCell}
                  >
                    {cat.description}
                  </td>
                  <td data-label="ქმედებები">
                    <div className={styles.actions}>
                      {/* მომავალში გავაკეთებთ /admin/categories/[id]/edit */}
                      <button
                        type="button"
                        className={styles.actionEdit}
                        onClick={() =>
                          router.push(`/admin/categories/${cat.id}/edit`)
                        }
                        disabled
                      >
                        შეცვლა
                      </button>
                      <button
                        type="button"
                        className={styles.actionDelete}
                        onClick={() => handleDelete(cat.id)}
                      >
                        წაშლა
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* წაშლის დადასტურების modal */}
        {confirmDeleteId !== null && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmBox}>
              <h3 className={styles.confirmTitle}>
                გსურს კატეგორიის წაშლა?
              </h3>
              <p className={styles.confirmText}>
                ეს მოქმედება შეუქცევადია. არჩეული კატეგორია და მისი მონაცემები
                სამუდამოდ წაიშლება ადმინისტრატორის სიიდან.
              </p>

              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.confirmDanger}
                  onClick={handleConfirmDelete}
                >
                  დიახ, წაშალე
                </button>
                <button
                  type="button"
                  className={styles.confirmGhost}
                  onClick={handleCancelDelete}
                >
                  გაუქმება
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
