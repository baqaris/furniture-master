// src/components/Public/Contact/Contact.tsx

"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./page.module.scss";
import {
  type ContactFormData,
  initialContactFormData,
  sendContactMessage,
} from "@/src/lib/contact";


type FieldError = Partial<{
  name: string;
  phone: string;
  email: string;
  message: string;
}>;

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>(initialContactFormData);
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ვალიდაცია
  const validate = useCallback((): FieldError => {
    const err: FieldError = {};

    if (!form.name.trim()) err.name = "გთხოვთ შეიყვანოთ თქვენი სახელი და გვარი.";
    if (!form.phone.trim()) err.phone = "გთხოვთ შეიყვანოთ ტელეფონის ნომერი.";
    if (!form.message.trim())
      err.message = "გთხოვთ მოკლედ მოგვუყვეთ, რა გჭირდებათ.";

    if (form.email.trim() && !form.email.includes("@")) {
      err.email = "ელ–ფოსტის ფორმატი არასწორია.";
    }

    return err;
  }, [form]);

  // ყველა input/select/textarea ერთ handler-ზე
  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
    ) => {
      const target = e.target as HTMLInputElement;
      const { name, value, type, checked } = target;

      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      // კონკრეტული ველის ერორის მოხსნა
      if (errors[name as keyof FieldError]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(null);

      const validation = validate();
      if (
        validation.name ||
        validation.phone ||
        validation.email ||
        validation.message
      ) {
        setErrors(validation);
        setLoading(false);
        return;
      }

      try {
        // აქ response აღარ გვჭირდება, უბრალოდ ველოდებით რომ წარმატებით წავიდეს
        await sendContactMessage(form);

        setSuccess("მოთხოვნა წარმატებით გაიგზავნა");
        setForm(initialContactFormData);
        setErrors({});
      } catch (err) {
        setError("დაფიქსირდა შეცდომა. სცადეთ კვლავ ცოტა ხანში.");
      } finally {
        setLoading(false);
      }
    },
    [form, validate],
  );


  // ✅ success overlay 4 წამში გაქრეს
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [success]);

  return (
    <section className={styles.section} id="contact">
      <div className={styles.glow} />

      {/* ✅ SUCCESS OVERLAY – ეკრანის შუაში */}
      {success && (
        <div className={styles.successOverlay}>
          <div className={styles.successBox}>
            <div className={styles.successIcon}>
              <span>✓</span>
            </div>
            <h4 className={styles.successTitle}>მოთხოვნა წარმატებით გაიგზავნა</h4>
            <p className={styles.successText}>
              მადლობა ნდობისთვის. მალე დაგიკავშირდებით, რომ დეტალები დავაზუსტოთ.
            </p>
            <button
              type="button"
              className={styles.successButton}
              onClick={() => setSuccess(null)}
            >
              გასაგებია
            </button>
          </div>
        </div>
      )}

      <div className={styles.inner}>
        {/* LEFT – ტექსტი + საკონტაქტო ინფო */}
        <div className={styles.left}>
          <p className={styles.badge}>კონტაქტი</p>
          <h2 className={styles.title}>
            მოგვწერე და ერთად დავგეგმოთ შენი პროექტი.
          </h2>
          <p className={styles.subtitle}>
            მოგვწერე რა სივრცე გაქვს, რა სტილი მოგწონს და რა ბიუჯეტზე ფიქრობ.
            დაგიბრუნდებით დეტალებით და შემოთავაზებით, რომელიც შენს სახლს ან
            ოფისს მაქსიმალურად მოერგება.
          </p>

          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>ტელეფონი</span>
              <a href="tel:+995595051043" className={styles.infoValue}>
                +995 595 05 10 43
              </a>
              <p className={styles.infoHint}>
                ზარი 10:00–22:00, სამუშაო დღეებში.
              </p>
            </div>

            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>ელ–ფოსტა</span>
              <a href="mailto:gavtadze.1991@mail.ru" className={styles.infoValue}>
                ✉️ gavtadze.1991@mail.ru
              </a>
              <p className={styles.infoHint}>
                გამოაგზავნე ფოტოც ან სქემა, თუ გაქვს.
              </p>
            </div>

            <div className={styles.infoCardMiniRow}>
              <div>
                <span className={styles.infoLabel}>ლოკაცია</span>
                <p className={styles.infoValueMuted}>ბათუმი, საქართველო</p>
              </div>
              <div>
                <span className={styles.infoLabel}>მუშაობის ფორმატი</span>
                <p className={styles.infoValueMuted}>
                  გადაზომვა ადგილზე + ონლაინ კონსულტაცია
                </p>
              </div>
            </div>
          </div>

          <div className={styles.miniStats}>
            <div>
              <p className={styles.miniNumber}>24H</p>
              <p className={styles.miniLabel}>საშუალო პასუხის დრო</p>
            </div>
            <div>
              <p className={styles.miniNumber}>98%</p>
              <p className={styles.miniLabel}>კმაყოფილი კლიენტები</p>
            </div>
          </div>
        </div>

        {/* RIGHT – ფორმა */}
        <div className={styles.right}>
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>მოგვწერე მოკლე დეტალები</h3>
            <p className={styles.formSubtitle}>
              შეავსე ფორმა და დავუკავშირდებით შენი პროექტის დასაგეგმად.
            </p>

            {/* აქედან success-ს აღარ ვაჩენთ, overlay-ზეა */}
            {error && <p className={styles.errorMessage}>{error}</p>}

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="name">
                    სახელი და გვარი
                  </label>
                  <input
                    id="name"
                    name="name"
                    className={styles.input}
                    placeholder="მაგ: გიორგი ქავთარაძე"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className={styles.errorText}>{errors.name}</p>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="phone">
                    ტელეფონი
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className={styles.input}
                    placeholder="+995 5XX XX XX XX"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <p className={styles.errorText}>{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">
                  ელ–ფოსტა (სურვილისამებრ)
                </label>
                <input
                  id="email"
                  name="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className={styles.errorText}>{errors.email}</p>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="projectType">
                  რა ტიპის პროექტია?
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  className={styles.select}
                  value={form.projectType}
                  onChange={handleChange}
                >
                  <option value="">აირჩიე</option>
                  <option value="kitchen">სამზარეულო</option>
                  <option value="bedroom">საძინებელი</option>
                  <option value="wardrobe">
                    კარადები / ჩაშენებული ავეჯი
                  </option>
                  <option value="living">მისაღები</option>
                  <option value="office">ოფისის ავეჯი</option>
                  <option value="other">სხვა / კომბინირებული</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="message">
                  მოგვიყევი რამდენიმე წინადადებით
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={styles.textarea}
                  placeholder="მაგ: მჭირდება სამზარეულო 3 მეტრიანი კუთხით, მაქვს სქემა და ფოტოები..."
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                />
                {errors.message && (
                  <p className={styles.errorText}>{errors.message}</p>
                )}
              </div>

              <div className={styles.fieldInline}>
                <div className={styles.checkboxWrapper}>
                  <input
                    id="contactByPhone"
                    type="checkbox"
                    name="preferPhone"
                    className={styles.checkbox}
                    checked={form.preferPhone}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="contactByPhone"
                    className={styles.checkboxLabel}
                  >
                    მირჩევნია ჩემთან ტელეფონით დამიკავშირდეთ
                  </label>
                </div>

                <div className={styles.checkboxWrapper}>
                  <input
                    id="contactByEmail"
                    type="checkbox"
                    name="preferEmail"
                    className={styles.checkbox}
                    checked={form.preferEmail}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="contactByEmail"
                    className={styles.checkboxLabel}
                  >
                    ელ–ფოსტაზეც გავეცნობ დეტალებს
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "იგზავნება..." : "გაგზავნა"}
                <span className={styles.submitGlow} />
              </button>

              <p className={styles.privacyText}>
                ფორმის შევსებით ეთანხმები, რომ დაგიკავშირდეთ შენს მიერ მითითებულ
                ნომერზე ან ელ–ფოსტაზე. პერსონალურ მონაცემებს ვიყენებთ მხოლოდ
                კონსულტაციისთვის.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
