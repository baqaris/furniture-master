// app/admin/categories/new/page.tsx
"use client";

import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

import { useAdminAuth } from "@/src/Context/AuthContext";
import {
  createCategory,
  type CreateCategoryPayload,
} from "@/src/lib/categories";

// Cloudinary helper – იგივე, რაც projects/new-ზე
import { uploadImageToCloudinary } from "@/src/lib/cloudinaryUpload";

type FieldError = Partial<{
  name: string;
  description: string;
  imageUrl: string;
}>;

export default function AdminNewCategoryPage() {
  const router = useRouter();
  const { admin, loading: authLoading } = useAdminAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<FieldError>({});

  // Cloudinary upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  function validate(): FieldError {
    const err: FieldError = {};

    if (!name.trim()) err.name = "სახელი სავალდებულოა";
    if (!description.trim()) err.description = "აღწერა სავალდებულოა";
    if (!imageUrl.trim()) err.imageUrl = "სურათის URL სავალდებულოა";

    return err;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const err = validate();
    setFieldError(err);
    if (Object.keys(err).length > 0) return;

    const payload: CreateCategoryPayload = {
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(), // აქ უკვე ან Cloudinary-ის URL იქნება, ან ხელით შეყვანილი
    };

    try {
      setSubmitting(true);
      await createCategory(payload);
      router.push("/admin/categories");
    } catch (err) {
      console.error(err);
      setError("ვერ შევქმენით კატეგორია, სცადე თავიდან");
    } finally {
      setSubmitting(false);
    }
  }

  // სურათის ატვირთვა Cloudinary-ზე
  async function handleImageFileChange(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url); // შევინახავთ მიღებულ URL-ს
    } catch (err) {
      console.error(err);
      setError("ფოტოს ატვირთვა ვერ მოხერხდა, სცადე თავიდან");
    } finally {
      setUploadingImage(false);
    }
  }

  if (authLoading) {
    return <p className={styles.centerText}>იტვირთება...</p>;
  }

  if (!admin) {
    return <p className={styles.centerText}>არაავტორიზირებული</p>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>დაამატე ახალი კატეგორია</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.layout}>
        {/* ფორმა */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>კატეგორიის სახელი</label>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="მაგ: სამზარეულო, ჩასაშენებელი კარადები..."
            />
            {fieldError.name && (
              <p className={styles.fieldError}>{fieldError.name}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>აღწერა</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="მოკლედ აღწერე, რა ტიპის ნამუშევრებს მოიცავს ეს კატეგორია..."
            />
            {fieldError.description && (
              <p className={styles.fieldError}>
                {fieldError.description}
              </p>
            )}
          </div>

          {/* სურათი – file upload + URL */}
          <div className={styles.field}>
            <label className={styles.label}>კატეგორიის სურათი</label>

            {/* ლამაზი file ღილაკი, როგორც projects/new-ში */}
            <label className={styles.fileButton}>
              აირჩიე ფოტო
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
              />
            </label>

            {uploadingImage && (
              <div className={styles.uploadSpinner}>
                <span className={styles.spinnerCircle} />
                <span className={styles.spinnerText}>იტვირთება...</span>
              </div>
            )}

            {/* მაინც ვტოვებთ URL input-ს, რომ თუ უნდა ხელით ჩაწეროს */}
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

          <button
            className={styles.submit}
            type="submit"
            disabled={submitting}
          >
            {submitting ? "იტვირთება..." : "შენახვა"}
          </button>
        </form>

        {/* მარჯვენა მხარეს live preview */}
        <aside className={styles.previewWrapper}>
          <div className={styles.previewCard}>
            <div className={styles.previewImageWrapper}>
              {imageUrl.trim() ? (
                <img
                  src={imageUrl}
                  alt={name || "Category preview"}
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.previewPlaceholder}>
                  <span>კატეგორიის სურათი</span>
                  <p>ჩაწერე URL ან ატვირთე ფოტო მარცხნივ</p>
                </div>
              )}
              <div className={styles.previewOverlay} />
              <div className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>
                  {name || "კატეგორიის სახელი"}
                </h2>
              </div>
            </div>

            <div className={styles.previewBody}>
              <p className={styles.previewDescription}>
                {description ||
                  "აქ გამოჩნდება მოკლე აღწერა, რას მოიცავს ეს კატეგორია კლიენტის გვერდზე."}
              </p>

              <p className={styles.previewHint}>
                ეს არის მხოლოდ admin preview — საბოლოოდ მსგავსი ბლოკით
                გამოჩნდება კატეგორიების სიაში.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
