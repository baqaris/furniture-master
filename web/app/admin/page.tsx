// app/admin/page.tsx 

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import styles from "./page.module.scss";

import { useAdminAuth } from "@/src/Context/AuthContext";
import { fetchProjects, type Project } from "@/src/lib/project";
import { fetchCategories, type Category } from "@/src/lib/categories";

type Stats = {
  totalProjects: number;
  publishedProjects: number;
  categoriesCount: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, loading: authLoading } = useAdminAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    publishedProjects: 0,
    categoriesCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // მონაცემების წამოღება (projects + categories)
  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [projectsRes, categoriesRes] = await Promise.all([
          fetchProjects(controller.signal),
          fetchCategories(controller.signal),
        ]);

        setProjects(projectsRes);
        setCategories(categoriesRes);

        const total = projectsRes.length;
        const published = projectsRes.filter((p) => p.isPublished).length;
        const cats = categoriesRes.length;

        setStats({
          totalProjects: total,
          publishedProjects: published,
          categoriesCount: cats,
        });
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(err);
        setError("ვერ წავიკითხე მონაცემები დეშბორდისთვის");
      } finally {
        setLoading(false);
      }
    }

    loadData();

    return () => controller.abort();
  }, []);

  // auth guard
  useEffect(() => {
    if (!authLoading && !admin) {
      router.push("/auth/login");
    }
  }, [admin, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className={styles.page}>
        <p className={styles.centerText}>იტვირთება დეშბორდი...</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className={styles.page}>
        <p className={styles.centerText}>არაავტორიზირებული</p>
      </div>
    );
  }

  // ბოლო 3 ნამუშევარი თარიღით დალაგებული
  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>მთავარი</h1>
          <p className={styles.subtitle}>
            მოკლე შეჯამება შენი ნამუშევრებისა და კატეგორიების შესახებ.
          </p>
        </div>

        <div className={styles.adminInfo}>
          <span className={styles.adminBadge}>Admin</span>
          <p className={styles.adminName}>{admin?.name}</p>
          <p className={styles.adminEmail}>{admin?.email}</p>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {/* სტატისტიკის ბარათები */}
      <section className={styles.statsRow}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>სულ ნამუშევრები</p>
          <p className={styles.statValue}>{stats.totalProjects}</p>
          <button
            type="button"
            className={styles.statLink}
            onClick={() => router.push("/admin/projects")}
          >
            ნახე ყველა ნამუშევარი →
          </button>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>გამოქვეყნებული ნამუშევრები</p>
          <p className={styles.statValue}>{stats.publishedProjects}</p>
          <p className={styles.statHint}>
            დანარჩენი დრაფტებია და მხოლოდ შენ ხედავ admin-ში.
          </p>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>კატეგორიების რაოდენობა</p>
          <p className={styles.statValue}>{stats.categoriesCount}</p>
          <button
            type="button"
            className={styles.statLink}
            onClick={() => router.push("/admin/categories")}
          >
            მართე კატეგორიები →
          </button>
        </div>
      </section>

      {/* ქვედა ბლოკი: ბოლო 3 ნამუშევარი + პატარა Help box */}
      <section className={styles.bottomRow}>
        <div className={styles.recentCard}>
          <div className={styles.recentHeader}>
            <h2 className={styles.sectionTitle}>ბოლო დამატებული ნამუშევრები</h2>
            <button
              type="button"
              className={styles.smallLink}
              onClick={() => router.push("/admin/projects")}
            >
              ყველა ნახვა
            </button>
          </div>

          {recentProjects.length === 0 ? (
            <p className={styles.muted}>
              ჯერ ნამუშევარი არ გაქვს დამატებული. დაიწყე „დამატება ღილაკ“-ით.
            </p>
          ) : (
            <ul className={styles.recentList}>
              {recentProjects.map((project) => (
                <li
                  key={project.id}
                  className={styles.recentItem}
                  onClick={() =>
                    router.push(`/admin/projects/${project.id}/edit`)
                  }
                >
                  <div className={styles.thumbWrapper}>
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className={styles.thumb}
                    />
                  </div>
                  <div className={styles.recentInfo}>
                    <p className={styles.recentTitle}>{project.title}</p>
                    <p className={styles.recentMeta}>
                      დამატებულია{" "}
                      {new Date(project.createdAt).toLocaleDateString("ka-GE")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.editPill}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/projects/${project.id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className={styles.sideCard}>
          <h2 className={styles.sectionTitle}>რჩევა</h2>
          <p className={styles.tipText}>
            რაც უფრო მეტ ნამუშევარს განათავსებ კარგი ფოტოებით, მით მარტივად
            დაინახავს კლიენტი შენი ხელობის ხარისხს.
          </p>
          <p className={styles.tipText}>
            სცადე თითო პროექტზე 3–5 სხვადასხვა კუთხიდან გადაღებული სურათი და
            პატარა აღწერა, რას ურჩევდი ასეთ ავეჯს მომავალ კლიენტს.
          </p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => router.push("/admin/projects/new")}
          >
            + ახალი ნამუშევრის დამატება
          </button>
        </aside>
      </section>
    </div>
  );
}
