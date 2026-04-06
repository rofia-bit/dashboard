/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useEffect } from "react";

/**
 * 
 * @param {{ content: string, emergency: boolean }} toast
 * @param {function} onDismiss
 */
export default function ToastNotification({ toast, onDismiss }) {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onDismiss, toast.emergency ? 8000 : 5000);
        return () => clearTimeout(t);
    }, [toast]);

    if (!toast) return null;

    const accent = toast.emergency ? "#ef4444" : "#2563eb";

    return (
        <Box sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            width: 320,
            bgcolor: "#1a2444",
            border: `1px solid ${accent}50`,
            borderLeft: `4px solid ${accent}`,
            borderRadius: 2,
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${accent}20`,
            p: 2,
            animation: "slideIn 0.3s ease",
            "@keyframes slideIn": {
                from: { transform: "translateX(120%)", opacity: 0 },
                to:   { transform: "translateX(0)",    opacity: 1 },
            },
        }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box sx={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    bgcolor: `${accent}20`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    {toast.emergency
                        ? <WarningAmberIcon sx={{ fontSize: 18, color: "#ef4444" }} />
                        : <NotificationsNoneIcon sx={{ fontSize: 18, color: "#2563eb" }} />
                    }
                </Box>

                <Box flex={1}>
                    <Typography sx={{
                        fontSize: 13, fontWeight: 700,
                        color: toast.emergency ? "#ef4444" : "#fff",
                        mb: 0.3,
                    }}>
                        {toast.emergency ? "🚨 Emergency Alert" : "New Notification"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#a0a9c9", lineHeight: 1.5 }}>
                        {toast.content}
                    </Typography>
                </Box>

                <IconButton size="small" onClick={onDismiss}
                    sx={{ color: "#6b7280", "&:hover": { color: "#fff" }, mt: -0.5 }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Stack>

            {/* progress bar */}
            <Box sx={{
                position: "absolute", bottom: 0, left: 0,
                height: 3, bgcolor: accent, borderRadius: "0 0 2px 2px",
                animation: `shrink ${toast.emergency ? 8 : 5}s linear forwards`,
                "@keyframes shrink": {
                    from: { width: "100%" },
                    to:   { width: "0%" },
                },
            }} />
        </Box>
    );
}