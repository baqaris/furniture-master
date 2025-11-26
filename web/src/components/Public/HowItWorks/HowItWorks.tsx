"use client";

import Link from "next/link";
import styles from "./HowItWorks.module.scss";

const steps = [
  {
    number: "01",
    title: "Contact us",
    text: "ტელეფონის მეშვეობით,მეილი, WhatsApp ან შეავსე განაცხადი, გვითხარი რა გჭირდება.",
    link:"დაკვიკავშირდი 📞"
  },
  {
    number: "02",
    title: "ზომები",
    text: "ჩვენ გესტუმრებით, გავზომავთ თქვენს მიერ შერჩეულ ადგილს და ვისაუბრებთ დეტალების შესახებ.",
  },
  {
    number: "03",
    title: "დიზაინი",
    text: "თქვენი სრუვილით შერჩეული დიზაინი ან ჩვენს მიერ შეთავაზებული სტილი, ასევე შესაძლებელია კატალოგიდან არჩევა.",
  },
  {
    number: "04",
    title: "მიტანა და დამონტაჟება",
    text: "მიტანის სერვისი, დამონტაჟება სუფთა და მაღალი სიბრთხილით განთავსება შეთანხმებულ დროს.",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>როგორ მუშობს</h2>
     
      <p className={styles.subheading}>
       
      </p>

      <div className={styles.track} />

      <div className={styles.grid}>
        {steps.map((step) => (
          <div key={step.number} className={styles.card}>
            <div className={styles.badge}>
              <span className={styles.badgeNumber}>{step.number}</span>
            </div>

            <div className={styles.content}>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
              <Link href="/contact"><p className={styles.contact}>{step.link}</p></Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
