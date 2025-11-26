// app/projects/[id]/page.tsx 
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import styles from "./page.module.scss";

import {
  fetchProjectById,
  type Project,
} from "@/src/lib/project";
import {
  fetchCategories,
  type Category,
} from "@/src/lib/categories";
import Link from "next/link";

// 🔹 Helper: YouTube ლინკიდან ვიღებთ embed URL-ს
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

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingCategories(true);

    fetchCategories(controller.signal)
      .then((data) => setCategories(data))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error(err);
      })
      .finally(() => setLoadingCategories(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const idRaw = params?.id;
    if (!idRaw) return;

    const id = Number(idRaw);
    if (Number.isNaN(id)) {
      setError("არასწორი ID");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchProjectById(id, controller.signal)
      .then((data) => {
        setProject(data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error(err);
        setError("ვერ ვიპოვეთ ეს ნამუშევარი");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [params]);

  function getCategoryName(catId: number): string {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "კატეგორია";
  }

  // Lightbox handlers
  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrevImage = () => {
    if (!project || lightboxIndex === null) return;
    const total = project.gallery?.length ?? 0;
    if (!total) return;

    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + total) % total;
    });
  };

  const handleNextImage = () => {
    if (!project || lightboxIndex === null) return;
    const total = project.gallery?.length ?? 0;
    if (!total) return;

    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % total;
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.centerText}>იტვირთება...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.page}>
        <p className={styles.centerText}>{error ?? "ნამუშევარი არ მოიძებნა"}</p>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.push("/project")}
        >
          ← უკან
        </button>
      </div>
    );
  }

  const gallery = project.gallery ?? [];
  const videoEmbedUrl = project.videoUrl
    ? getYoutubeEmbedUrl(project.videoUrl)
    : null;

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => router.push("/project")}
      >
        ← უკან
      </button>

      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <img
            src={project.imageUrl}
            alt={project.title}
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroHeader}>
            <span className={styles.heroCategory}>
              {getCategoryName(project.categoryId)}
            </span>
            <h1 className={styles.heroTitle}>{project.title}</h1>
            <p className={styles.heroMeta}>
              {new Date(project.createdAt).toLocaleDateString("ka-GE")}
            </p>
          </div>
        </div>

        <div className={styles.heroInfo}>
          <p className={styles.description}>{project.description}</p>

          <div className={styles.infoBox}>
            <h2 className={styles.infoTitle}>დეტალები</h2>
            <ul className={styles.infoList}>
              <li>
                <span>კატეგორია:</span>
                <strong>{getCategoryName(project.categoryId)}</strong>
              </li>
              <li>
                <span>სტატუსი:</span>
                <strong>
                  {project.isPublished ? "გამოქვეყნებულია" : "დამალულია"}
                </strong>
              </li>
              <li>
                <span>დამატების თარიღი:</span>
                <strong>
                  {new Date(project.createdAt).toLocaleDateString("ka-GE")}
                </strong>
              </li>
            </ul>
          </div>

          <div className={styles.contactBox}>
            <h2 className={styles.infoTitle}>გინდა მსგავსი პროექტი?</h2>
            <p className={styles.contactText}>
              დაგვიკავშირდი და მოვიფიქროთ შენთვის შესაბამისი დიზაინი და გადაწყვეტა.
            </p>
            {/* აქ მერე ჩასვამ მეგობრის ნამდვილი ნომერი / ლინკებს */}
            <div className={styles.contactActions}>
              <Link href="tel:+995595051043" className={styles.primaryButton}>
                დარეკვა
              </Link>
              <Link
                href="https://www.facebook.com/share/1AZPTyMoDh/" 
                target="_blank"
                className={styles.secondaryButton}
               
              >
                WhatsApp / Messenger
              </Link>
            </div>
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className={styles.gallerySection}>
          <h2 className={styles.galleryTitle}>დამატებითი ფოტოები</h2>
          <div className={styles.galleryGrid}>
            {gallery.map((url, index) => (
              <div
                key={url + index}
                className={styles.galleryItem}
                onClick={() => handleOpenLightbox(index)}
              >
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className={styles.galleryImage}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🔹 ვიდეო სექცია – თუ ვიდეო ლინკი არსებობს და წარმატებით გადაიქცა embed URL-ად */}
      {videoEmbedUrl && (
        <div className={styles.videoContainer}>
        <section className={styles.videoSection}>
          <h2 className={styles.galleryTitle}>ვიდეო მიმოხილვა</h2>
          <p className={styles.videoHint}>
          პროექტის დეტალურად ნახვისთვის გთხოვთ უყუროთ ვიდეო ჩანაწერს 
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
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && gallery.length > 0 && (
        <div
          className={styles.lightboxOverlay}
          onClick={handleCloseLightbox}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={handleCloseLightbox}
            >
              ✕
            </button>

            <button
              type="button"
              className={styles.lightboxPrev}
              onClick={handlePrevImage}
            >
              ‹
            </button>

            <div className={styles.lightboxImageWrapper}>
              <img
                src={gallery[lightboxIndex!]}
                alt={`Gallery ${lightboxIndex + 1}`}
                className={styles.lightboxImage}
              />
            </div>

            <button
              type="button"
              className={styles.lightboxNext}
              onClick={handleNextImage}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
