// app/loading.tsx
import styles from "./loading.module.scss";

export default function LoadingPage() {
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.spinnerWrapper}>
          <span className={styles.spinnerOuter} />
          <span className={styles.spinnerInner} />
        </div>

        <p className={styles.title}>იტვირთება...</p>
        <p className={styles.text}>გთხოვთ, რამდენიმე წამი დაიცადოთ.</p>
      </div>
    </div>
  );
}
