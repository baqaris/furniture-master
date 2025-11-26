// src/lib/categories.ts
import { furnitureApi } from "./api";

export type Category = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

export type CreateCategoryPayload = {
  name: string;
  description: string;
  imageUrl: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export async function fetchCategories(
  signal?: AbortSignal,
): Promise<Category[]> {
  const res = await furnitureApi.get<Category[]>("/categories", { signal });
  return res.data;
}

export async function createCategory(
  body: CreateCategoryPayload,
  signal?: AbortSignal,
): Promise<Category> {
  const res = await furnitureApi.post<Category>("/categories", body, {
    signal,
  });
  return res.data;
}

export async function updateCategory(
  id: number,
  body: UpdateCategoryPayload,
  signal?: AbortSignal,
): Promise<Category> {
  const res = await furnitureApi.patch<Category>(`/categories/${id}`, body, {
    signal,
  });
  return res.data;
}

export async function deleteCategory(
  id: number,
  signal?: AbortSignal,
): Promise<void> {
  await furnitureApi.delete(`/categories/${id}`, { signal });
}
