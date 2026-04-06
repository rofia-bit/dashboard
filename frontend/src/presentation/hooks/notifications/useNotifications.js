/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from "react";
import { NotificationRepositoryImpl } from "../../../data/repositories/notifications/NotificationRepositoryImpl.js";
import { NotificationUseCase } from "../../../domain/usecases/notifications/NotificationUseCase.js";

const notificationRepository = new NotificationRepositoryImpl();
const notificationUseCase    = new NotificationUseCase(notificationRepository);

const POLL_INTERVAL = 30000;

const EMERGENCY_KEYWORDS = ["emergency", "urgent", "critical", "alert", "sos"];

function isEmergency(content) {
    if (!content) return false;
    const lower = content.toLowerCase();
    return EMERGENCY_KEYWORDS.some(k => lower.includes(k));
}

export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast]                 = useState(null);
    const [loading, setLoading]             = useState(true);
    const knownIds                          = useRef(new Set());
    const user                              = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchNotifications = useCallback(async () => {
        if (!user.userId) return;
        try {
            const data = await notificationUseCase.getNotifications(user.userId);
            const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            sorted.forEach(n => {
                if (!knownIds.current.has(n.notificationId) && knownIds.current.size > 0) {


                    setToast({
                        content: n.content,
                        emergency: isEmergency(n.content),
                        id: n.notificationId,
                    });
                }
                knownIds.current.add(n.notificationId);
            });

            setNotifications(sorted);
        } catch (_) {
            
        } finally {
            setLoading(false);
        }
    }, [user.userId]);



    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = async (notificationId) => {
        try {
            await notificationUseCase.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.notificationId === notificationId ? { ...n, read: true } : n)
            );
        } catch (_) {}
    };

    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.read);
        await Promise.allSettled(unread.map(n => notificationUseCase.markAsRead(n.notificationId)));
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const dismissToast = () => setToast(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications, loading,
        unreadCount,
        markAsRead, markAllAsRead,
        toast, dismissToast,
        refetch: fetchNotifications,
    };
}