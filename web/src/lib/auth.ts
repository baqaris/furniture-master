import { furnitureApi } from "./api";



export type AdminUser = {
    id:number;
    email:string;
    name:string;
    image?:string;
}

export type AdminLoginPayload ={
    email:string;
    password:string;

}

export type AdminResponse = {
    accessToken:string;
    admin:AdminUser;
}

export async function adminLogin(body:AdminLoginPayload, signal?:AbortSignal):Promise<AdminResponse>{
    const res = await furnitureApi.post<AdminResponse>("/auth/login", body, {signal});
    return res.data;
}
