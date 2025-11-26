// app/projects/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.scss";

import {
  fetchProjectById,
  type Project,
} from "@/src/lib/project";
import {
  fetchCategories,
  type Category,
} from "@/src/lib/categories";
import axios from "axios";

// 🔹 Helper: YouTube ლინკიდან embed URL
function getYoutubeEmbedUrl(original: string): string | null {
  try {
    const url = new URL(original);

    // youtu.be/VIDEO_ID
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    // youtube.com/watch?v=VIDEO_ID
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const idParam = params?.id;
  const projectId = Number(
    Array.isArray(idParam) ? idParam[0] : idParam,
  );

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(projectId)) {
      setError("არასწორი პროექტის ID");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [cats, proj] = await Promise.all([
          fetchCategories(),
          fetchProjectById(projectId),
        ]);

        if (cancelled) return;

        setCategories(cats);
        setProject(proj);
      } catch (e: unknown) {
        console.error("load project error", e);
        if (axios.isAxiosError(e)) {
          if (e.response?.status === 404) {
            setError("პროექტი ვერ მოიძებნა");
          } else {
            setError(e?.message ?? "დატა ვერ ჩაიტვირთა");
          }
        } else {
          setError("დატა ვერ ჩაიტვირთა");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  function getCategoryName(catId: number | undefined): string {
    if (!catId) return "უსათაურო კატეგორია";
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "კატეგორია";
  }

  const createdAtText =
    project &&
    new Date(project.createdAt).toLocaleDateString("ka-GE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  let content;

  if (loading) {
    content = (
      <div className={styles.center}>
        <div className={styles.loader} />
        <p>იტვირთება პროექტი...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className={styles.center}>
        <p className={styles.error}>{error}</p>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.push("/projects")}
        >
          ← დაბრუნდი ნამუშევრების სიაზე
        </button>
      </div>
    );
  } else if (!project) {
    content = (
      <div className={styles.center}>
        <p className={styles.error}>პროექტი ვერ მოიძებნა</p>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.push("/projects")}
        >
          ← დაბრუნდი ნამუშევრების სიაზე
        </button>
      </div>
    );
  } else {
    const categoryName = getCategoryName(project.categoryId);
    const gallery = project.gallery ?? [];
    const videoEmbedUrl = project.videoUrl
      ? getYoutubeEmbedUrl(project.videoUrl)
      : null;

    content = (
      <>
        {/* Breadcrumb / header row */}
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.backLink}
            onClick={() => router.push("/admin/projects")}
          >
            ← უკან
          </button>

          <div className={styles.badgesRow}>
            <span className={styles.badgeId}>ID: #{project.id}</span>
            <span
              className={
                project.isPublished
                  ? styles.badgePublished
                  : styles.badgeDraft
              }
            >
              {project.isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        {/* Hero section */}
        <section className={styles.hero}>
          <div className={styles.heroImageWrapper}>
            <img
              src={project.imageUrl}
              alt={project.title}
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <div className={styles.categoryPill}>
                {categoryName}
              </div>
              <h1 className={styles.heroTitle}>{project.title}</h1>
              <div className={styles.metaRow}>
                {createdAtText && (
                  <span className={styles.metaItem}>
                    დაგეგმილი: {createdAtText}
                  </span>
                )}
                <span className={styles.metaItem}>
                  სტატუსი:{" "}
                  {project.isPublished ? "გამოქვეყნებული" : "დრაფტი"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className={styles.mainSection}>
          <div className={styles.mainContent}>
            <div className={styles.descriptionCard}>
              <h2 className={styles.sectionTitle}>აღწერა</h2>
              <p className={styles.descriptionText}>
                {project.description}
              </p>
            </div>

            <div className={styles.infoCard}>
              <h2 className={styles.sectionTitle}>პროექტის დეტალები</h2>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>კატეგორია</span>
                  <span className={styles.infoValue}>
                    {categoryName}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>პროექტის ID</span>
                  <span className={styles.infoValue}>#{project.id}</span>
                </div>
                {createdAtText && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>
                      შესრულების თარიღი
                    </span>
                    <span className={styles.infoValue}>
                      {createdAtText}
                    </span>
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>სტატუსი</span>
                  <span
                    className={
                      project.isPublished
                        ? styles.infoStatusPublished
                        : styles.infoStatusDraft
                    }
                  >
                    {project.isPublished ? "გამოქვეყნებული" : "დრაფტი"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={styles.ctaButton}
              >
                დამიკავშირდი მსგავს პროექტზე
              </button>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className={styles.gallerySection}>
            <div className={styles.galleryHeader}>
              <h2 className={styles.sectionTitle}>
                დამატებითი ფოტოები
              </h2>
              <p className={styles.galleryHint}>
                იხილე დეტალები სხვადასხვა კუთხიდან
              </p>
            </div>

            <div className={styles.galleryGrid}>
              {gallery.map((url, index) => (
                <figure
                  key={url + index}
                  className={styles.galleryItem}
                >
                  <img
                    src={url}
                    alt={`${project.title} – დეტალი ${index + 1}`}
                    className={styles.galleryImage}
                  />
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* 🔹 ვიდეო სექცია – თუ videoUrl არსებობს და embed გაიშიფრა */}
        {videoEmbedUrl && (
          <section className={styles.videoSection}>
            <h2 className={styles.sectionTitle}>ვიდეო მიმოხილვა</h2>
            <p className={styles.videoHint}>
              ეს არის ვიდეო, რომელიც youtube ლინკის დამატების შემდეგ ჩანს!
            </p>
            <div className={styles.videoWrapper}>
              <iframe
                src={videoEmbedUrl}
                title={project.title}
                className={styles.videoFrame}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
        )}
      </>
    );
  }

  return <div className={styles.page}>{content}</div>;
}
