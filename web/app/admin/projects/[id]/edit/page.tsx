"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.scss";

import { useAdminAuth } from "@/src/Context/AuthContext";
import {
  fetchProjectById,
  updateProject,
  type Project,
  type UpdateProjectPayload,
} from "@/src/lib/project";
import {
  fetchCategories,
  type Category,
} from "@/src/lib/categories";
import axios from "axios";

// 🔹 Cloudinary helper
import { uploadImageToCloudinary } from "@/src/lib/cloudinaryUpload";

type FieldError = Partial<{
  title: string;
  description: string;
  categoryId: string;
  imageUrl: string;
}>;

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const { admin, loading: authLoading } = useAdminAuth();

  const idParam = params?.id;
  const projectId = Number(
    Array.isArray(idParam) ? idParam[0] : idParam,
  );

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");

  // 🔹 გალერეა – 4 სლოტი, როგორც new ფეიჯზე
  const [galleryUrls, setGalleryUrls] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<FieldError>({});

  // 🔹 upload state-ები
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(null);

  // debug render
  useEffect(() => {
    console.log("EditProjectPage render:", {
      projectId,
      authLoading,
      hasAdmin: !!admin,
    });
  }, [projectId, authLoading, admin]);

  // კატეგორიები + პროექტი ერთად იტვირთება
  useEffect(() => {
    if (authLoading) return;
    if (!admin) return;
    if (Number.isNaN(projectId)) return;

    let cancelled = false;

    async function loadAll() {
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

        setTitle(proj.title);
        setDescription(proj.description);
        setCategoryId(proj.categoryId);
        setImageUrl(proj.imageUrl);
        setIsPublished(proj.isPublished);
        setVideoUrl(proj.videoUrl ?? "");

        // 🔹 არსებული gallery შევიყვანოთ 4-სლოტიან state-ში
        const existingGallery = proj.gallery ?? [];
        setGalleryUrls([
          existingGallery[0] ?? "",
          existingGallery[1] ?? "",
          existingGallery[2] ?? "",
          existingGallery[3] ?? "",
        ]);
      } catch (e: unknown) {
        console.error("loadAll error", e);
        if (axios.isAxiosError(e)) {
          if (e.response?.status === 404) {
            setError("ასეთი პროექტი ვერ მოიძებნა");
          } else {
            setError(e?.message ?? "Loading failed");
          }
        } else {
          setError("მონაცემების ჩატვირთვა ვერ მოხდა");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingCategories(false);
        }
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [authLoading, admin, projectId]);

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
    if (!project) return;

    const err = validate();
    setFieldError(err);
    if (Object.keys(err).length > 0) return;

    const gallery = galleryUrls
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const payload: UpdateProjectPayload = {
      title: title.trim(),
      description: description.trim(),
      categoryId: categoryId === "" ? undefined : Number(categoryId),
      imageUrl: imageUrl.trim(),
      gallery: gallery.length > 0 ? gallery : undefined,
      isPublished,
      videoUrl: videoUrl.trim() || undefined,
    };

    try {
      setSaving(true);
      setError(null);
      await updateProject(project.id, payload);
      router.push("/admin/projects");
    } catch (e: unknown) {
      console.error("update error", e);
      if (axios.isAxiosError(e)) {
        setError(e?.message ?? "პროექტის განახლება ვერ მოხდა");
      } else {
        setError("ვერ განვაახლეთ პროექტი");
      }
    } finally {
      setSaving(false);
    }
  }

  // 🔹 მთავარი სურათის file upload → Cloudinary
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

  // 🔹 გალერეის სლოტების upload
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

  let content;

  if (authLoading) {
    content = <p className={styles.centerText}>იტვირთება...</p>;
  } else if (!admin) {
    content = (
      <p className={styles.centerText}>
        არაავტორიზირებული – ჯერ ავტორიზდი
      </p>
    );
  } else if (Number.isNaN(projectId)) {
    content = (
      <p className={styles.centerText}>
        არასწორი IDა URL-ში (id = {String(idParam)})
      </p>
    );
  } else if (loading) {
    content = (
      <p className={styles.centerText}>იტვირთება პროექტი...</p>
    );
  } else if (!project) {
    content = (
      <p className={styles.centerText}>
        {error ?? "პროექტი ვერ მოიძებნა"}
      </p>
    );
  } else {
    content = (
      <>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>
            პროექტის რედაქტირება – #{project.id}
          </h1>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.push("/admin/projects")}
          >
            ← უკან
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>სათაური</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            />
            {fieldError.description && (
              <p className={styles.fieldError}>{fieldError.description}</p>
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
              <p className={styles.fieldError}>{fieldError.categoryId}</p>
            )}
          </div>

          {/* მთავარი სურათი – file upload + URL, ზუსტად როგორც new-ზე */}
          <div className={styles.field}>
            <label className={styles.label}>მთავარი სურათი</label>

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
              <p className={styles.fieldError}>{fieldError.imageUrl}</p>
            )}
          </div>

          {/* გალერეის ფოტოები – 4 slot, file upload + thumb */}
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

          {/* YouTube ვიდეოს ველი (არასავალდებულო) */}
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
            type="submit"
            className={styles.submit}
            disabled={saving}
          >
            {saving ? "ინახება..." : "შენახვა"}
          </button>
        </form>
      </>
    );
  }

  return <div className={styles.page}>{content}</div>;
}
