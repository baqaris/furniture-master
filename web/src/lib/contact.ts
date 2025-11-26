// src/lib/contact.ts

import { furnitureApi } from "./api";

// Nest-ის DTO-ს შესაბამისი payload
export interface ContactPayload {
  name: string;
  phone: string;
  email?: string;
  projectType?: string;
  message: string;
  preferPhone?: boolean;
  preferEmail?: boolean;
}

// ის, რასაც ბექი რეალურად აბრუნებს (ContactMessage)
export interface ContactMessageEntity {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  projectType?: string | null;
  message: string;
  preferPhone?: boolean | null;
  preferEmail?: boolean | null;
  isRead: boolean;
  createdAt: string; // Date ISO string
}

// ფორმის მდგომარეობა ფრონტზე (ყველა ველი string/boolean)
export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  message: string;
  preferPhone: boolean;
  preferEmail: boolean;
}

// საწყისი მნიშვნელობები useState–ისთვის
export const initialContactFormData: ContactFormData = {
  name: "",
  phone: "",
  email: "",
  projectType: "",
  message: "",
  preferPhone: false,
  preferEmail: false,
};

export async function sendContactMessage(
  form: ContactFormData,
  signal?: AbortSignal,
): Promise<ContactMessageEntity> {
  const payload: ContactPayload = {
    name: form.name,
    phone: form.phone,
    email: form.email.trim() ? form.email.trim() : undefined,
    projectType: form.projectType || undefined,
    message: form.message,
    preferPhone: form.preferPhone || undefined,
    preferEmail: form.preferEmail || undefined,
  };

  const { data } = await furnitureApi.post<ContactMessageEntity>(
    "/contact",
    payload,
    signal ? { signal } : undefined,
  );

  return data;
}
