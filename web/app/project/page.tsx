// app/projects/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import styles from "./page.module.scss";

import {
  searchProject,
  type Project,
} from "@/src/lib/project";
import {
  fetchCategories,
  type Category,
} from "@/src/lib/categories";

type FieldError = Partial<{
  search: string;
}>;

export default function PublicProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [fieldError, setFieldError] = useState<FieldError>({});

  useEffect(() => {
    const controller = new AbortController();

    fetchCategories(controller.signal)
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error(err);
        setError("გთხოვ, განაახლო გვერდი და სცადე კიდევ ერთხელ.");
      })
      .finally(() => setLoadingCategories(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setLoadingProjects(true);
    setError(null);

    searchProject({
      title: search || undefined,
      categoryId: categoryId === "" ? undefined : Number(categoryId),
      onlyPublished: true,
      signal: controller.signal,
    })
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error(err);
        setError("მოხდა გაუთვალისწინებელი შეცდომა");
      })
      .finally(() => setLoadingProjects(false));

    return () => controller.abort();
  }, [search, categoryId]);

  function getCategoryName(catId: number): string {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "უცნობი კატეგორია";
  }

  // helper აქტიური კატეგორიის შემოსამოწმებლად
  function isActiveCategory(id: number | "") {
    if (id === "") return categoryId === "";
    return categoryId === id;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>ნამუშევრები</h1>
          <p className={styles.subtitle}>
            დაათვალიერე ხელოსნის შესრულებული სამზარეულოები, კარადები და სხვა ავეჯი.
          </p>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {/* 🔍 ძებნის ფილტრი */}
      <section className={styles.filters}>
        <div className={styles.filterItem}>
          <label className={styles.label}>ძებნა</label>
          <input
            className={styles.input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="მაგ: თეთრი სამზარეულო, მინა, LED..."
          />
          {fieldError.search && (
            <p className={styles.fieldError}>{fieldError.search}</p>
          )}
        </div>
      </section>

      {/* 🔹 კატეგორიების ჰორიზონტალური ბარები */}
      {loadingCategories ? (
        <p className={styles.muted}>იტვირთება კატეგორიები...</p>
      ) : categories.length > 0 ? (
        <section className={styles.categoryStrip}>
          {/* ყველა კატეგორია */}
          <button
            type="button"
            onClick={() => setCategoryId("")}
            className={
              isActiveCategory("")
                ? `${styles.categoryButton} ${styles.categoryButtonActive}`
                : styles.categoryButton
            }
          >
            <div className={styles.categoryThumbFallback}>ყველა</div>
            <div className={styles.categoryText}>
              <span className={styles.categoryName}>ყველა ნამუშევარი</span>
              <span className={styles.categoryDescription}>
                ნახე ყველა შესრულებული პროექტი ერთად
              </span>
            </div>
          </button>

          {/* ინდივიდუალური კატეგორიები */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={
                isActiveCategory(cat.id)
                  ? `${styles.categoryButton} ${styles.categoryButtonActive}`
                  : styles.categoryButton
              }
            >
              <div className={styles.categoryThumbWrapper}>
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className={styles.categoryThumb}
                />
              </div>
              <div className={styles.categoryText}>
                <span className={styles.categoryName}>{cat.name}</span>
                {cat.description && (
                  <span className={styles.categoryDescription}>
                    {cat.description.length > 60
                      ? cat.description.slice(0, 60) + "..."
                      : cat.description}
                  </span>
                )}
              </div>
            </button>
          ))}
        </section>
      ) : null}

      {loadingProjects ? (
        <div className={styles.loadingWrapper}>
          <p className={styles.loadingText}>
            {Array.from("იტვირთება ნამუშევრები...")
              .map((char, index) => (
                <span
                  key={index}
                  className={styles.loadingChar}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {char}
                </span>
              ))}
          </p>
        </div>
      ) : projects.length === 0 ? (
        <p className={styles.centerText}>
          ამ ფილტრით ნამუშევარი ვერ მოიძებნა.
        </p>
      ) : (
        <section className={styles.grid}>
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className={styles.card}
            >
              <div className={styles.cardImageWrapper}>
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className={styles.cardImage}
                />
                <div className={styles.cardOverlay} />
                <div className={styles.cardTop}>
                  <span className={styles.cardCategory}>
                    {getCategoryName(project.categoryId)}
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <h2 className={styles.cardTitle}>{project.title}</h2>
                  <p className={styles.cardDescription}>
                    {project.description.length > 80
                      ? project.description.slice(0, 80) + "..."
                      : project.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
