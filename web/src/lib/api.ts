// src/lib/api.ts
import axios from "axios";


export const furnitureApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
  timeout: 30000,
});
