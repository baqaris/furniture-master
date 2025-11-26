// src/lib/project.ts
import { furnitureApi } from "./api";

export type Project = {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  imageUrl: string;
  gallery: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  videoUrl?:string;
};

export type ProjectSearchParams = {
  title?: string;
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
  categoryId?: number;
  onlyPublished?: boolean;
};

// ყველ პროექტთა ჩამოწერა
export async function fetchProjects(
  signal?: AbortSignal,
): Promise<Project[]> {
  const res = await furnitureApi.get<Project[]>("/projects", { signal });
  return res.data;
}

// პროექტების ძებნა / ფილტრი
export async function searchProject(
  q: ProjectSearchParams = {},
): Promise<Project[]> {
  const {
    limit = 20,
    offset = 0,
    title,
    signal,
    categoryId,
    onlyPublished,
  } = q;

  const search = title?.trim();

  const params: Record<string, unknown> = {
    limit,
    offset,
  };

  if (search) params.title = search;
  if (categoryId != null) params.categoryId = categoryId;
  if (typeof onlyPublished === "boolean") params.onlyPublished = onlyPublished;

  const res = await furnitureApi.get<Project[]>("/projects", {
    params,
    signal,
  });
  return res.data;
}

// ერთი კონკრეტული პროექტის წამოღება
export async function fetchProjectById(
  id: number,
  signal?: AbortSignal,
): Promise<Project> {
  const res = await furnitureApi.get<Project>(`/projects/${id}`, { signal });
  return res.data;
}

// შექმნა
export type CreateProjectPayload = {
  title: string;
  description: string;
  categoryId: number;
  imageUrl: string;
  gallery?: string[];
  isPublished?: boolean;
  videoUrl?:string;
};

export async function createProject(
  body: CreateProjectPayload,
  signal?: AbortSignal,
): Promise<Project> {
  const res = await furnitureApi.post<Project>("/projects", body, { signal });
  return res.data;
}

// განახლება
export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export async function updateProject(
  id: number,
  body: UpdateProjectPayload,
  signal?: AbortSignal,
): Promise<Project> {
  const res = await furnitureApi.patch<Project>(`/projects/${id}`, body, {
    signal,
  });
  return res.data;
}

// წაშლა
export async function deleteProject(
  id: number,
  signal?: AbortSignal,
): Promise<void> {
  await furnitureApi.delete(`/projects/${id}`, { signal });
}
