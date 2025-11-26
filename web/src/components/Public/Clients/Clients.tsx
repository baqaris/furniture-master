"use client";

import Image from "next/image";
import styles from "./Clients.module.scss";

const reviews = [
  {
    name: "Baqar M.",
    location: "ბათუმი",
    text: "საუკეთესო საძინებელი - ძალიან სწრაფად და მაღალი ხარისხით!",
    img: "/Profile.jpg",
  },
  {
    name: "Temo J.",
    location: "ბათუმი",
    text: "კარგი ნამუშევარი, დროულად მოვიდნენ და დროზე ადრეც დაამთავრეს!",
    img: "/Profile2.jpg",
  },
  {
    name: "Nino K.",
    location: "ბათუმი",
    text: "ხარისხიანად მუშაობენ, რეკომენდაციას ვუწევ!",
    img: "/Profile3.jpg",
  },
];

export default function Clients() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>რას ამბობენ კლიენტები</h2>
      <div className={styles.track}/>
      <div className={styles.grid}>
        {reviews.map((r) => (
          <div key={r.name} className={styles.card}>
            <div className={styles.photoWrapper}>
              <Image
                src={r.img}
                alt={r.name}
                fill
                className={styles.photo}
              />
            </div>

            <h3 className={styles.name}>
              {r.name} — <span className={styles.location}>{r.location}</span>
            </h3>

            <p className={styles.text}>{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
