// app/admin/messages/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/src/Context/AuthContext";
import styles from "./page.module.scss";
import { fetchContactMessages, markContactAsRead, deleteContactMessage } from "@/src/lib/adminContact";
import type { AdminContactMessage } from "@/src/lib/adminContact";

export default function AdminMessagesPage() {
    const router = useRouter();
    const { admin, loading: authLoading } = useAdminAuth();

    const [messages, setMessages] = useState<AdminContactMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);


    // auth check
    useEffect(() => {
        if (!authLoading && !admin) {
            router.push("/auth/login");
        }
    }, [admin, authLoading, router]);

    const loadMessages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchContactMessages();
            setMessages(data);
            if (data.length > 0 && selectedId == null) {
                setSelectedId(data[0].id);
            }
        } catch (err) {
            setError("შეტყობინებების ჩატვირთვა ვერ მოხერხდა.");
        } finally {
            setLoading(false);
        }
    }, [selectedId]);

    useEffect(() => {
        if (!admin) return;
        void loadMessages();
    }, [admin, loadMessages]);

    const selectedMessage = messages.find((m) => m.id === selectedId) ?? null;

    const handleSelect = async (id: number) => {
        setSelectedId(id);

        // თუ იყო წაუკითხავი, გავაგზავნოთ PATCH
        const msg = messages.find((m) => m.id === id);
        if (msg && !msg.isRead) {
            try {
                await markContactAsRead(id);
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === id
                            ? {
                                ...m,
                                isRead: true,
                            }
                            : m,
                    ),
                );
            } catch {

            }
        }
    };

    const handleDelete = (id: number) => {
        setConfirmDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (confirmDeleteId == null) return;

        try {
            await deleteContactMessage(confirmDeleteId);
            setMessages((prev) => prev.filter((m) => m.id !== confirmDeleteId));

            if (selectedId === confirmDeleteId) {
                setSelectedId(null);
            }
        } catch {
            alert("შეტყობინების წაშლა ვერ მოხერხდა.");
        } finally {
            setConfirmDeleteId(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmDeleteId(null);
    };


    if (authLoading || !admin) {
        return (
            <div className={styles.loadingWrap}>
                <p>იტვირთება...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>კლიენტის შეტყობინებები</h1>
                <button className={styles.refreshButton} onClick={loadMessages}>
                    განახლება
                </button>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.layout}>
                {/* LEFT – list */}
                <div className={styles.list}>
                    {loading && <p className={styles.muted}>იტვირთება...</p>}
                    {!loading && messages.length === 0 && (
                        <p className={styles.muted}>ჯერჯერობით შეტყობინებები არ არის.</p>
                    )}

                    {messages.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            className={`${styles.listItem} ${m.id === selectedId ? styles.listItemActive : ""
                                }`}
                            onClick={() => handleSelect(m.id)}
                        >
                            <div className={styles.listItemHeader}>
                                <span className={styles.listName}>{m.name}</span>
                                {!m.isRead && <span className={styles.unreadDot} />}
                            </div>
                            <p className={styles.listMessagePreview}>
                                {m.message.length > 60
                                    ? m.message.slice(0, 60) + "..."
                                    : m.message}
                            </p>
                            <p className={styles.listMeta}>
                                {m.phone} •{" "}
                                {new Date(m.createdAt).toLocaleString("ka-GE", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}
                            </p>
                        </button>
                    ))}
                </div>

                {/* RIGHT – detail */}
                <div className={styles.detail}>
                    {selectedMessage ? (
                        <>
                            <div className={styles.detailHeader}>
                                <div>
                                    <h2 className={styles.detailName}>{selectedMessage.name}</h2>
                                    <p className={styles.detailMeta}>
                                        {selectedMessage.phone}
                                        {selectedMessage.email
                                            ? ` • ${selectedMessage.email}`
                                            : ""}
                                    </p>
                                    <p className={styles.detailMeta}>
                                        {new Date(selectedMessage.createdAt).toLocaleString(
                                            "ka-GE",
                                            {
                                                dateStyle: "short",
                                                timeStyle: "short",
                                            },
                                        )}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(selectedMessage.id)}
                                >
                                    წაშლა
                                </button>
                            </div>

                            {selectedMessage.projectType && (
                                <p className={styles.detailTag}>
                                    პროექტის ტიპი: {selectedMessage.projectType}
                                </p>
                            )}

                            <div className={styles.detailBox}>
                                <p className={styles.detailMessage}>
                                    {selectedMessage.message}
                                </p>
                            </div>

                            <div className={styles.detailPreferences}>
                                {selectedMessage.preferPhone && (
                                    <span>📞 ურჩევნია ზარი ტელეფონზე</span>
                                )}
                                {selectedMessage.preferEmail && (
                                    <span>✉️ ელ–ფოსტაზეც ელოდება პასუხს</span>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className={styles.muted}>აირჩიე შეტყობინება მარცხენა სიიდან.</p>
                    )}
                </div>
            </div>
            {confirmDeleteId !== null && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.confirmBox}>
                        <h3 className={styles.confirmTitle}>გსურს შეტყობინების წაშლა?</h3>
                        <p className={styles.confirmText}>
                            ეს მოქმედება შეუქცევადია. შეტყობინება სამუდამოდ წაიშლება
                            ადმინისტრატორის სიიდან.
                        </p>

                        <div className={styles.confirmActions}>
                            <button
                                type="button"
                                className={styles.confirmDanger}
                                onClick={handleConfirmDelete}
                            >
                                დიახ, წაშალე
                            </button>
                            <button
                                type="button"
                                className={styles.confirmGhost}
                                onClick={handleCancelDelete}
                            >
                                გაუქმება
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
