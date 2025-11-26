// src/components/Public/About/AboutUs.tsx

"use client";

import StickyContact from "@/src/components/StickyContact/StickyContact";
import styles from "./page.module.scss";

export default function AboutUs() {
  return (
    <section className={styles.section} id="about">
      <StickyContact />

      {/* Header / Intro */}
      <div className={styles.headerRow}>
        <div className={styles.badge}>ჩვენს შესახებ</div>
        <h2 className={styles.title}>
          ვქმნით სივრცეს, სადაც ცხოვრება უფრო კომფორტულია.
        </h2>
        <p className={styles.subtitle}>
          უკვე <span className={styles.highlight}>15 წელზე მეტია</span>, რაც ვამზადებთ
          სამზარეულოებს, კარადებსა და საძინებელ ავეჯს მათთვის, ვინც ფასს სდებს
          ხარისხში, სისუფთავეს და დეტალებს. ჩვენთვის ავეჯი უბრალოდ ნივთი არ არის, 
          ეს არის გარემო, სადაც ოჯახი იკრიბება, ბავშვები იზრდებიან და სადაც სახლი სიმყუდროვედ იქცევა.
        </p>
      </div>

      {/* 📸 Photos */}
      {/* დიდი ჰორიზონტალური ჰედერის ფოტო – ოფისის ავეჯი + ხელოსანი */}
      <div className={styles.photoHero}>
        <img
          src="/OfficeWork.png" // აქ ჩასვი ფართო ოფისის ფოტო (wide worker in office)
          alt="ოფისის ავეჯი და ხელოსანი მუშაობის პროცესში"
          className={styles.photoHeroImage}
        />
      </div>

    

      {/* Stats strip */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <p className={styles.statNumber}>15+</p>
          <p className={styles.statLabel}>წლის გამოცდილება</p>
          <p className={styles.statDesc}>დადასტურებული ნამუშევრები და სტაბილური ხარისხი.</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statNumber}>120+</p>
          <p className={styles.statLabel}>დასრულებული პროექტი</p>
          <p className={styles.statDesc}>სხვადასხვა ზომის ბინები, სახლები და ოფისები.</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statNumber}>98%</p>
          <p className={styles.statLabel}>კმაყოფილი კლიენტები</p>
          <p className={styles.statDesc}>რეკომენდაციებით მიღებული ახალი შეკვეთების დიდი ნაწილი.</p>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Left column – what we do / services */}
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>რას გთავაზობთ</h3>
          <p className={styles.blockText}>
            თითოეული პროექტი იგეგმება ზუსტ გაზომვებზე, ფუნქციონალზე და შენს ცხოვრების
            სტილზე დაყრდნობით. ვამზადებთ ავეჯს, რომელიც ვიზუალურადაც ლამაზია და ყოველდღიურ
            გამოყენებაში კომფორტულია.
          </p>

          <ul className={styles.list}>
            <li>თანამედროვე და კლასიკური <strong>სამზარეულოები</strong></li>
            <li><strong>ჩაშენებული და კედელზე დამონტაჟებული კარადები</strong></li>
            <li><strong>საძინებელი ზონები</strong> – ლოგინები, ტუმბოები, გარდერობები</li>
            <li><strong>მისაღები და ოფისის ავეჯი</strong></li>
            <li>ინდივიდუალური ავეჯი <strong>შენი სივრცის ზომებზე მორგებული</strong></li>
          </ul>
        </div>

        {/* Right column – why us */}
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>რატომ ჩვენ?</h3>
          <p className={styles.blockText}>
            ჩვენი მიზანია, რომ დასრულებული პროექტის ნახვისას თქვა:
            <br />
            <span className={styles.quote}>&nbsp;„აი ზუსტად ასე წარმომედგინა.“</span>
          </p>

          <ul className={styles.list}>
            <li>
              <span className={styles.check}>✓</span>
              <div>
                <strong>15+ წლიანი გამოცდილება</strong>
                <p className={styles.itemText}>
                  ნანახი გვაქვს ყველა ტიპის სივრცე და სხვადასხვა გამოწვევა.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.check}>✓</span>
              <div>
                <strong>ხარისხიანი მასალები</strong>
                <p className={styles.itemText}>
                  ვიყენებთ სანდო, გამძლე მასალებს, რომ ავეჯმა წლები გაძლოს.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.check}>✓</span>
              <div>
                <strong>დეტალებზე ორიენტირებული მუშაობა</strong>
                <p className={styles.itemText}>
                  ფურნიტურიდან დაწყებული, დასრულებული კუთხეებითა და ფინიშით.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.check}>✓</span>
              <div>
                <strong>დროის პატივისცემა</strong>
                <p className={styles.itemText}>
                  ვმუშობთ შეთანხმებულ ვადებში და ვეძებთ საუკეთესო, რეალურ გადაწყვეტას.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.check}>✓</span>
              <div>
                <strong>სუფთა და მოწესრიგებული მონტაჟი</strong>
                <p className={styles.itemText}>
                  სამუშაოს დასრულების შემდეგ სივრცე არის მოწესრიგებული,
                  არა სამშენებლო ქაოსი.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Process + Mission / Vision */}
      <div className={styles.bottomGrid}>
        {/* How we work */}
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>როგორ ვმუშაობთ</h3>
          <ol className={styles.steps}>
            <li>
              <span className={styles.stepNumber}>1</span>
              <div>
                <strong>კონსულტაცია</strong>
                <p className={styles.itemText}>
                  ვისმენთ შენს სურვილებს, სტილს და ბიუჯეტს, გთავაზობთ ეფექტურ გადაწყვეტილებებს.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>2</span>
              <div>
                <strong>გაზომვები ადგილზე</strong>
                <p className={styles.itemText}>
                  ზუსტად ვაფიქსირებთ სივრცის ზომებს, რომ ავეჯი იდეალურად ჩაჯდეს გარემოში.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>3</span>
              <div>
                <strong>დიზაინი და დაგეგმარება</strong>
                <p className={styles.itemText}>
                  ვარჩევთ მასალებს, ფერს, ფურნიტურას და ვქმნით პროექტს, რომელიც
                  შენს ყოველდღიურობას უხდება.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>4</span>
              <div>
                <strong>წარმოება და მონტაჟი</strong>
                <p className={styles.itemText}>
                  ვამზადებთ, ჩამოგიტანთ და პროფესიონალურად ვამონტაჟებთ — ბოლომდე
                  ვაკონტროლებთ ხარისხს.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Mission + Promise + small highlight card */}
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>ჩვენი მისია და დაპირება</h3>
          <p className={styles.blockText}>
            ჩვენი მიზანია შევქმნათ კომფორტული, თანამედროვე და გამძლე ავეჯი,
            რომელიც ზრდის სივრცის ფუნქციონალს და სახლს აძლევს ახალ, მაღალხარისხოვან იერსახეს.
          </p>

          <p className={styles.blockText}>
            ჩვენთან თანამშრომლობა იწყება სანდოობით და მთავრდება შედეგით, რომელიც
            <span className={styles.highlight}>
              &nbsp;ყოველ დილით შეგახსენებს, რომ სწორი არჩევანი გააკეთე.
            </span>
          </p>

          <p className={styles.blockText}>
            თუ შენთვის მნიშვნელოვანია ხარისხი, სისუფთავე და ადამიანური დამოკიდებულება —
            ჩვენ ზუსტად ის გუნდი ვართ, ვისთანაც ღირს მუშაობა.
          </p>

          <div className={styles.highlightCard}>
            <p className={styles.highlightTitle}>„ჩვენი ძლიერი რეკლამა არის კლიენტის კმაყოფილება.“</p>
            <p className={styles.highlightText}>
              ჩვენი პროექტების დიდი ნაწილი მოდის რეკომენდაციებით — ეს არის მთავარი მაჩვენებელი,
              რომ ხალხი გვენდობა და გვიბრუნდება.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
