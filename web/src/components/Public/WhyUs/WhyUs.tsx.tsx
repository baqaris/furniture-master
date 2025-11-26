// src/components/WhyUs/WhyUs.tsx

import styles from "./WhyUs.tsx.module.scss";

const features = [
  {
    icon: "🛠️",
    title: "15-წლიანი გამოცდილება",
    description: "რეალური პროექტები, რეალური შედეგები და ათობით კმაყოფილი კლიენტი.",
  },
  {
    icon: "✏️",
    title: "თქვენს გემოვნებაზე მორგებული დიზაინი",
    description: "ყოველი სამზარეულო, გარდერობი და საწოლი თქვენს სივრცესა და სტილზეა მორგებული.",
  },
  {
    icon: "⏱️",
    title: "დროის და ბიუჯეტის დაცვა",
    description: "ვიცავთ შეთანხმებულ ვადებს და ფიქსირებულ ფასს – უსიამოვნო სიურპრიზების გარეშე.",
  },
  {
    icon: "🌳",
    title: "ხარისხიანი მასალები",
    description: "MDF, მუხა, HPL და ფურნიტურა შერჩეულია ხანგრძლივი და კომფორტული გამოყენებისთვის.",
  },
];


export default function WhyUs() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>რატომ ჩვენ?</h2>
      <div className={styles.track}/>
      <p className={styles.subheading}>
       „ადამიანები მხოლოდ ავეჯს არ ყიდულობენ, ისინი ნდობას და კომფორტს ყიდულობენ.“
      </p>

      <div className={styles.grid}>
        {features.map((item) => (
          <div key={item.title} className={styles.card}>
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>{item.icon}</span>
            </div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
