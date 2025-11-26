"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/src/lib/auth";
import type { AdminLoginPayload } from "@/src/lib/auth";
import styles from "./page.module.scss";
import axios from "axios";
import { useAdminAuth } from "@/src/Context/AuthContext";

type FieldError = Partial<{
  email: string;
  password: string;
}>;

export default function Login() {
  const router = useRouter();

  const {login} = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [errorInput, setErrorInput] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);

  function validate(): FieldError {
    const err: FieldError = {};
    if (!email.trim()) err.email = "მეილი სავალდებულოა!";
    if (!password) {
      err.password = "პაროლი სავალდებულოა!";
    } else if (password.length < 5) {
      err.password = "პაროლი მოკლეა მინ(5) სიმბოლო!";
    }
    return err;
  }

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setErrorInput({});

    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrorInput(err);
      return;
    }

    const body: AdminLoginPayload = {
      email: email.trim(),
      password,
    };

    try {
      setLoading(true);
      const resProfile = await adminLogin(body);
        await login(resProfile.accessToken, resProfile.admin);

      router.push("/admin");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) {
          setError("Email ან პაროლი არასწორია");
        } else {
          setError("გთხოვ სცადო ხელახლა.");
        }
      } else {
        setError("გთხოვ სცადო ხელახლა.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.login}>
      <form className={styles.form} onSubmit={onLogin}>
        <div>
          <label htmlFor="email" className={styles.labelContainer}>
            მომხმარებელი
            <input
              type="email"
              id="email"
              value={email}
              placeholder="example@gmail.com..."
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setEmail("");
              }}
              className={`${styles.input} ${
                errorInput.email ? styles.inputError : ""
              }`}
            />
            {errorInput.email && (
              <p className={styles.errorInput}>{errorInput.email}</p>
            )}
          </label>

          <label htmlFor="password" className={styles.labelContainer}>
            პაროლი
            <input
              type="password"
              id="password"
              value={password}
              placeholder="password..."
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setPassword("");
              }}
              className={`${styles.input} ${
                errorInput.password ? styles.inputError : ""
              }`}
            />
            {errorInput.password && (
              <p className={styles.errorInput}>{errorInput.password}</p>
            )}
          </label>
        </div>

        {/* გლობალური error – მაგალითად "Invalid email or password" */}
        {error && <p className={styles.errorGlobal}>{error}</p>}

        <label htmlFor="ok" className={styles.labelCheckbox}>
          <input type="checkbox" id="ok" />
          <span>Remember Me</span>
        </label>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "დაელოდე..." : "შესვლა"}
        </button>
       
      </form>
      
    </div>
  );
}
