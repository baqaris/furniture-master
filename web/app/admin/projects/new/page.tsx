// app/admin/projects/new/page.tsx
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

import type { Category } from "@/src/lib/categories";
import { fetchCategories } from "@/src/lib/categories";
import {
  createProject,
  type CreateProjectPayload,
} from "@/src/lib/project";
import axios from "axios";

// Cloudinary helper
import { uploadImageToCloudinary } from "@/src/lib/cloudinaryUpload";

type FieldError = Partial<{
  title: string;
  description: string;
  categoryId: string;
  imageUrl: string;
}>;

export default function AdminNewProjectPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");

  // YouTube ვიდეოს ლინკი
  const [videoUrl, setVideoUrl] = useState("");

  const [isPublished, setIsPublished] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<FieldError>({});

  // Cloudinary upload – მთავარი ფოტო
  const [uploadingMain, setUploadingMain] = useState(false);

  // გალერეა – 4 სლოტი
  const [galleryUrls, setGalleryUrls] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<
    number | null
  >(null);

  // კატეგორიების წამოღება
  useEffect(() => {
    const controller = new AbortController();

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
        setLoadingCategories(false);
      });

    return () => controller.abort();
  }, []);

  function validate(): FieldError {
    const err: FieldError = {};

    if (!title.trim()) err.title = "სათაური სავალდებულოა";
    if (!description.trim()) err.description = "აღწერა სავალდებულოა";
    if (categoryId === "") err.categoryId = "აირჩიე კატეგორია";
    if (!imageUrl.trim())
      err.imageUrl = "მთავარი სურათის ლინკი სავალდებულოა";

    return err;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const err = validate();
    setFieldError(err);
    if (Object.keys(err).length > 0) return;

    const gallery = galleryUrls
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const payload: CreateProjectPayload = {
      title: title.trim(),
      description: description.trim(),
      categoryId: Number(categoryId),
      imageUrl: imageUrl.trim(),
      gallery: gallery.length > 0 ? gallery : undefined,
      isPublished,
      videoUrl: videoUrl.trim() || undefined,
    };

    try {
      setSubmitting(true);
      await createProject(payload);
      router.push("/admin/projects");
    } catch (err) {
      console.error(err);
      setError("ვერ შევქმენით პროექტი, სცადე თავიდან");
    } finally {
      setSubmitting(false);
    }
  }

  // მთავარი სურათის ატვირთვა Cloudinary-ზე
  async function handleMainImageFileChange(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMain(true);
      setError(null);
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      setError("ფოტოს ატვირთვა ვერ მოხერხდა, სცადე თავიდან");
    } finally {
      setUploadingMain(false);
    }
  }

  // გალერეის ფოტოების ატვირთვა Cloudinary-ზე (ფოტო 1–4)
  async function handleGalleryFileChange(
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingGalleryIndex(index);
      setError(null);

      const url = await uploadImageToCloudinary(file);

      setGalleryUrls((prev) => {
        const copy = [...prev];
        copy[index] = url;
        return copy;
      });
    } catch (err) {
      console.error(err);
      setError("გალერეის ფოტოს ატვირთვა ვერ მოხერხდა, სცადე თავიდან");
    } finally {
      setUploadingGalleryIndex(null);
    }
  }

  // live preview helpers
  const selectedCategory =
    categoryId === ""
      ? undefined
      : categories.find((c) => c.id === Number(categoryId));

  const galleryPreview = galleryUrls
    .map((url) => url.trim())
    .filter((url) => url.length > 0)
    .slice(0, 4);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>დაამატე ახალი ნამუშევარი</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.layout}>
        {/* მარცხენა სვეტი – ფორმა */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>სათაური</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="მაგ: თეთრი სამზარეულო LED განათებით"
            />
            {fieldError.title && (
              <p className={styles.fieldError}>{fieldError.title}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>აღწერა</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="მოკლედ აღწერე, რა გააკეთა ხელოსანმა..."
            />
            {fieldError.description && (
              <p className={styles.fieldError}>
                {fieldError.description}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>კატეგორია</label>
            {loadingCategories ? (
              <p>იტვირთება კატეგორიები...</p>
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
                <option value="">აირჩიე კატეგორია</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
            {fieldError.categoryId && (
              <p className={styles.fieldError}>
                {fieldError.categoryId}
              </p>
            )}
          </div>

          {/* მთავარი სურათი – file upload + URL */}
          <div className={styles.field}>
            <label className={styles.label}>მთავარი სურათი <strong>გარეკანზე</strong><span></span></label>

            {/* ლამაზი file ღილაკი – სტილი SCSS-ში */}
            <label className={styles.fileButton}>
              აირჩიე ფოტო
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageFileChange}
              />
            </label>

            {uploadingMain && (
              <div className={styles.uploadSpinner}>
                <span className={styles.spinnerCircle} />
                <span className={styles.spinnerText}>იტვირთება...</span>
              </div>
            )}

            <input
              className={styles.input}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
            {fieldError.imageUrl && (
              <p className={styles.fieldError}>
                {fieldError.imageUrl}
              </p>
            )}
          </div>

          {/* გალერეის ფოტოები – 4 slot */}
          <div className={styles.field}>
            <div className={styles.fieldHeader}>
              <label className={styles.label}>დამატებითი ფოტოები</label>
              <span className={styles.helperText}>
                არასავალდებულო • მაქს. 4 ფოტო
              </span>
            </div>

            <div className={styles.galleryRows}>
              {galleryUrls.map((url, index) => (
                <div key={index} className={styles.galleryRow}>
                  <span className={styles.galleryLabel}>
                    ფოტო {index + 1}
                  </span>

                  <label className={styles.fileButton}>
                    აირჩიე ფოტო
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleGalleryFileChange(index, e)
                      }
                    />
                  </label>

                  {uploadingGalleryIndex === index && (
                    <div className={styles.uploadSpinner}>
                      <span className={styles.spinnerCircle} />
                      <span className={styles.spinnerText}>
                        იტვირთება...
                      </span>
                    </div>
                  )}

                  {url && uploadingGalleryIndex !== index && (
                    <div className={styles.galleryThumb}>
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className={styles.galleryThumbImage}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* YouTube ვიდეოს ლინკი */}
          <div className={styles.field}>
            <label className={styles.label}>
              YouTube ვიდეოს ლინკი (არასავალდებულო)
            </label>
            <input
              className={styles.input}
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className={styles.fieldCheckbox}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              გამოქვეყნდეს საიტზე
            </label>
          </div>

          <button
            className={styles.submit}
            type="submit"
            disabled={submitting}
          >
            {submitting ? "იტვირთება..." : "შენახვა"}
          </button>
        </form>

        {/* მარჯვენა სვეტი – live preview */}
        <aside className={styles.previewWrapper}>
          <div className={styles.previewCard}>
            <div className={styles.previewImageWrapper}>
              {imageUrl.trim() ? (
                <img
                  src={imageUrl}
                  alt={title || "Project preview"}
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.previewPlaceholder}>
                  <span>მთავარი სურათი</span>
                  <p>ატვირთე ფოტო ნამუშევრის გარეკანისთვის</p>
                </div>
              )}
              <div className={styles.previewOverlay} />
              <div className={styles.previewHeader}>
                {selectedCategory && (
                  <span className={styles.previewCategory}>
                    {selectedCategory.name}
                  </span>
                )}
                <h2 className={styles.previewTitle}>
                  {title || "ახალი ნამუშევრის სათაური"}
                </h2>
              </div>
            </div>

            <div className={styles.previewBody}>
              <p className={styles.previewDescription}>
                {description ||
                  "აქ გამოჩნდება მოკლე აღწერა, როგორი სამუშაო შესრულდა ამ ნამუშევარში."}
              </p>

              <div className={styles.previewMetaRow}>
                <span
                  className={
                    isPublished
                      ? styles.previewStatusPublished
                      : styles.previewStatusDraft
                  }
                >
                  {isPublished ? "Published" : "Draft"}
                </span>

                {selectedCategory && (
                  <span className={styles.previewMetaText}>
                    კატეგორია: {selectedCategory.name}
                  </span>
                )}
              </div>

              {galleryPreview.length > 0 && (
                <div className={styles.previewGallery}>
                  {galleryPreview.map((url, index) => (
                    <div
                      key={url + index}
                      className={styles.previewThumb}
                    >
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className={styles.previewThumbImage}
                      />
                    </div>
                  ))}
                </div>
              )}

              {videoUrl.trim() && (
                <p className={styles.previewHint}>
                  🎬 ვიდეო დაემატება: {videoUrl}
                </p>
              )}

              <p className={styles.previewHint}>
                ეს არის მხოლოდ admin preview – საბოლოოდ ასე/ანალოგიურად
                გამოჩნდება კლიენტისთვის.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
