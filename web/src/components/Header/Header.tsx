//src\components\Header\Header.tsx

"use client";
import MessagesBell from "../MessageBell/MessageBell";
import styles from "./Header.module.scss";
import Logo from "./Logo/Logo";
import Nav from "./Nav/Nav";
import User from "./User/User";

export default function Header(){
    return(
        <div className={styles.header}>
           <Logo />
           <Nav/>
      
           
           <User/>

        </div>
    )
}