// app/admin/projects/page.tsx

"use client";

import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

import { useAdminAuth } from "@/src/Context/AuthContext";
import {
  searchProject,
  type Project,
  deleteProject,
} from "@/src/lib/project";
import {
  fetchCategories,
  type Category,
} from "@/src/lib/categories";
import axios from "axios";

type FieldError = Partial<{
  search: string;
}>;

export default function AdminProjectsPage() {
  const router = useRouter();
  const { admin, loading: authLoading } = useAdminAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [onlyPublished, setOnlyPublished] = useState(true);
  const [fieldError, setFieldError] = useState<FieldError>({});

  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const ctrlRef = useRef<AbortController | null>(null);

  // 🔐 auth guard – redirect, მაგრამ ჰუკებს არ ვამტვრევთ
  useEffect(() => {
    if (!authLoading && !admin) {
      router.push("/auth/login");
    }
  }, [admin, authLoading, router]);

  // 🟦 კატეგორიების ჩატვირთვა (useCallback)
  const loadCategory = useCallback(async () => {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      setLoadingCategories(true);
      setError(null);
      setFieldError({});
      const data = await fetchCategories(ctrl.signal);
      setCategories(data);
    } catch (e: unknown) {
      if (axios.isCancel(e)) return;
      if (axios.isAxiosError(e)) {
        setError(e?.message ?? "Loading categories failed");
      } else {
        setError("try again");
      }
    } finally {
      setLoadingCategories(false);
      if (ctrlRef.current === ctrl) ctrlRef.current = null;
    }
  }, []);

  // 🟩 პროექტების ჩატვირთვა (useCallback)
  const loadProjects = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoadingProjects(true);
        setError(null);

        const data = await searchProject({
          title: search || undefined,
          categoryId: categoryId === "" ? undefined : Number(categoryId),
          onlyPublished,
          signal,
        });

        setProjects(data);
      } catch (e: unknown) {
        if (axios.isCancel(e)) return;
        if (axios.isAxiosError(e)) {
          setError(e?.message ?? "Loading projects failed");
        } else {
          setError("ვერ წავიკითხე პროექტები");
        }
      } finally {
        setLoadingProjects(false);
      }
    },
    [search, categoryId, onlyPublished],
  );

  // ერთხელ კატეგორიები, როცა admin მზადაა
  useEffect(() => {
    if (authLoading || !admin) return;

    loadCategory();
    return () => ctrlRef.current?.abort();
  }, [authLoading, admin, loadCategory]);

  // პროექტების ჩატვირთვა ფილტრების ცვლილებაზე
  useEffect(() => {
    if (authLoading || !admin) return;

    const controller = new AbortController();
    loadProjects(controller.signal);
    return () => controller.abort();
  }, [authLoading, admin, loadProjects]);

  async function handleDelete(id: number) {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setPendingDeleteId(null);
    } catch (err) {
      console.error(err);
      setError("ვერ წავშალე პროექტი");
    }
  }

  function getCategoryName(catId: number): string {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : `#${catId}`;
  }

  // 🔚 აქიდან ქვემოთ მხოლოდ JSX – არანაირი ჰუკი

  let content: ReactNode;

  if (authLoading) {
    content = <p className={styles.centerText}>იტვირთება...</p>;
  } else if (!admin) {
    content = <p className={styles.centerText}>არაავტორიზირებული</p>;
  } else {
    content = (
      <>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>ნამუშევრები (Projects)</h1>
          <Link href="/admin/projects/new" className={styles.addButton}>
            დამატება
          </Link>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.filters}>
          <div className={styles.filterItem}>
            <label className={styles.label}>ძებნა სათაურით</label>
            <input
              className={styles.input}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="მაგ: სამზარეულო, ლოგინი..."
            />
            {fieldError.search && (
              <p className={styles.fieldError}>{fieldError.search}</p>
            )}
          </div>

          <div className={styles.filterItem}>
            <label className={styles.label}>კატეგორია</label>
            {loadingCategories ? (
              <p>იტვირთება...</p>
            ) : (
              <select
                className={styles.select}
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              >
                <option value="">ყველა</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className={styles.filterItemCheckbox}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={onlyPublished}
                onChange={(e) => setOnlyPublished(e.target.checked)}
              />
              მხოლოდ გამოქვეყნებული
            </label>
          </div>
        </div>

        {loadingProjects ? (
          <p className={styles.centerText}>იტვირთება პროექტები...</p>
        ) : projects.length === 0 ? (
          <p className={styles.centerText}>
            ჯერ არ გაქვს დამატებული ნამუშევარი. დააჭირე &quot;<strong>დამატება</strong>&quot; ღილაკს.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>სურათი</th>
                <th>სათაური</th>
                <th>კატეგორია</th>
                <th>ვიდეო</th>
                <th>სტატუსი</th>
                <th>შექმნის თარიღი</th>
                <th>ქმედებები</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>
                    <Link href={`/admin/projects/${project.id}`}>
                      <div className={styles.thumbWrapper}>
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className={styles.thumb}
                        />
                      </div>
                    </Link>
                  </td>
                  <td className={styles.titleCell}>{project.title}</td>
                  <td>{getCategoryName(project.categoryId)}</td>

                  {/* 🔹 ვიდეოს სვეტი */}
                  <td>
                    {project.videoUrl ? (
                      <a
                        href={project.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.videoBadge}
                      >
                        ვიდეო
                      </a>
                    ) : (
                      <span className={styles.videoEmpty}>—</span>
                    )}
                  </td>

                  <td>
                    <span
                      className={
                        project.isPublished
                          ? styles.badgePublished
                          : styles.badgeDraft
                      }
                    >
                      {project.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    {new Date(project.createdAt).toLocaleDateString("ka-GE")}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.actionEdit}
                        onClick={() =>
                          router.push(`/admin/projects/${project.id}/edit`)
                        }
                      >
                        Edit
                      </button>

                      {pendingDeleteId === project.id ? (
                        <>
                          <button
                            type="button"
                            className={styles.actionConfirm}
                            onClick={() => handleDelete(project.id)}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            className={styles.actionCancel}
                            onClick={() => setPendingDeleteId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className={styles.actionDelete}
                          onClick={() => setPendingDeleteId(project.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  }

  return <div className={styles.page}>{content}</div>;
}
