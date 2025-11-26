//app\[locale]\page.tsx
"use client"
import RecentProjects from "@/src/components/Public/RecentProjects/RecentProjects";
import styles from "./page.module.scss";
import PublicPage from "@/src/components/Public/PublicPage/PublicPage";
import WhyUs from "@/src/components/Public/WhyUs/WhyUs.tsx";
import Clients from "@/src/components/Public/Clients/Clients";
import HowItWorks from "@/src/components/Public/HowItWorks/HowItWorks";
import ContactInfo from "@/src/components/Public/ContactInfo/ContactInfo";
import StickyContact from "@/src/components/StickyContact/StickyContact";
export default function HomePage() {
  return (
    <main className={styles.main}>
      <StickyContact/>
      <PublicPage />
      <WhyUs />
      <RecentProjects />

      <Clients />
      <HowItWorks />
      <ContactInfo />

    </main>
  );
}
