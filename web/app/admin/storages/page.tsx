//app\admin\storages\page.tsx

"use client";
import { useEffect } from "react";
import styles from "./page.module.scss";
import { useAdminAuth } from "@/src/Context/AuthContext";
import { useRouter } from "next/navigation";
export default function Storages(){

    const router = useRouter();
    const{admin,loading} = useAdminAuth();

    useEffect(()=>{
        if(!loading && !admin){
            router.replace("/auth/login")
        }
    },[admin,router,loading]);

    if(!admin) return(
        <p>არაავატორიზირებული</p>
    )

    if(loading) return(
        <p>იტვირთება...</p>
    )

    return(
        <div className={styles.body}>
            <p>საწყობი</p>
        </div>
    )
}