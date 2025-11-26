// src/lib/adminContact.ts
import { furnitureApi } from "./api";

export interface AdminContactMessage {
  id: number;
  name: string;
  phone: string;
  email?: string;
  projectType?: string;
  message: string;
  preferPhone?: boolean;
  preferEmail?: boolean;
  createdAt: string;
  isRead: boolean;
}

export interface AdminContactListFilter {
  isRead?: boolean;
}

export async function fetchContactMessages(
  filter?: AdminContactListFilter,
): Promise<AdminContactMessage[]> {
  const params: Record<string, string> = {};

  if (typeof filter?.isRead === "boolean") {
    params.isRead = filter.isRead ? "true" : "false";
  }

  const { data } = await furnitureApi.get<AdminContactMessage[]>("/contact", {
    params,
  });

  return data;
}

export async function markContactAsRead(id: number): Promise<void> {
  await furnitureApi.patch(`/contact/${id}/read`);
}

export async function deleteContactMessage(id: number): Promise<void> {
  await furnitureApi.delete(`/contact/${id}`);
}
