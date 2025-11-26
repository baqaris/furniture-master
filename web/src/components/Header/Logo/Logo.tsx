"use client";

import Link from "next/link";
import styles from"./Logo.module.scss";


export default function Logo(){
    return(
        <div className={styles.logo}>
            <Link href="/">
            <img src="/worker.png" className={styles.img}/>
            </Link>
        </div>
    )
}