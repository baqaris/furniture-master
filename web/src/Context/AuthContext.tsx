// src/context/AdminAuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { AdminUser } from "@/src/lib/auth";

type AdminAuthContextValue = {
  admin: AdminUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (accessToken: string, admin: AdminUser) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);

const ADMIN_TOKEN_KEY = "admin_access_token";
const ADMIN_ADMIN_KEY = "admin_data"; 

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const loadAdmin = useCallback(async () => {
    try {
      setLoading(true);
      if (typeof window === "undefined") return;

      const savedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
      const savedAdmin = localStorage.getItem(ADMIN_ADMIN_KEY);

      if (!savedToken || !savedAdmin) {
        setAdmin(null);
        setToken(null);
        return;
      }

      const parsedAdmin: AdminUser = JSON.parse(savedAdmin);
      setAdmin(parsedAdmin);
      setToken(savedToken);
    } catch (err) {
      setError("Admin auth load failed");
      if (typeof window !== "undefined") {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_ADMIN_KEY);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    loadAdmin();
  }, [loadAdmin]);

  const login = useCallback(
    async (accessToken: string, adminData: AdminUser) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
        localStorage.setItem(ADMIN_ADMIN_KEY, JSON.stringify(adminData));
      }
      setToken(accessToken);
      setAdmin(adminData);
      setError(null);
    },
    []
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_ADMIN_KEY);
    }
    setAdmin(null);
    setToken(null);
    setError(null);
    setLoading(false);
  }, []);

  const value: AdminAuthContextValue = {
    admin,
    token,
    loading,
    error,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth უნდა იყოს AdminAuthProvider-ის შიგნით");
  }
  return ctx;
}
