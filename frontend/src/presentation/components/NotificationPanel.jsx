import {
    Box, Typography, Stack, IconButton, Divider,
    CircularProgress, ClickAwayListener, Tooltip
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function fmtTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60)    return "just now";
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

const EMERGENCY_KEYWORDS = ["emergency", "urgent", "critical", "alert", "sos"];
function isEmergency(content) {
    if (!content) return false;
    return EMERGENCY_KEYWORDS.some(k => content.toLowerCase().includes(k));
}

function NotificationItem({ notification, onRead }) {
    const emergency = isEmergency(notification.content);
    const accent    = emergency ? "#ef4444" : "#2563eb";

    return (
        <Box
            onClick={() => !notification.read && onRead(notification.notificationId)}
            sx={{
                px: 2.5, py: 1.5,
                cursor: notification.read ? "default" : "pointer",
                bgcolor: notification.read ? "transparent" : `${accent}08`,
                borderLeft: emergency ? `3px solid #ef4444` : "3px solid transparent",
                "&:hover": { bgcolor: "#1f2e55" },
                transition: "background 0.15s",
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box sx={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    bgcolor: `${accent}20`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    {emergency
                        ? <WarningAmberIcon sx={{ fontSize: 16, color: "#ef4444" }} />
                        : <NotificationsNoneIcon sx={{ fontSize: 16, color: "#2563eb" }} />
                    }
                </Box>
                <Box flex={1} minWidth={0}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.3}>
                        <Typography sx={{
                            fontSize: 12, fontWeight: notification.read ? 400 : 600,
                            color: emergency ? "#ef4444" : "#e2e8f0",
                        }}>
                            {emergency ? "Emergency Alert" : "Notification"}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "#6b7280", flexShrink: 0, ml: 1 }}>
                            {fmtTime(notification.createdAt)}
                        </Typography>
                    </Stack>
                    <Typography sx={{
                        fontSize: 12, color: "#a0a9c9", lineHeight: 1.5,
                        overflow: "hidden", textOverflow: "ellipsis",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    }}>
                        {notification.content}
                    </Typography>
                </Box>
                {!notification.read && (
                    <FiberManualRecordIcon sx={{ fontSize: 8, color: accent, flexShrink: 0, mt: 0.5 }} />
                )}
            </Stack>
        </Box>
    );
}


//----


export default function NotificationPanel({ notifications, loading, unreadCount, onRead, onReadAll, onClose }) {
    return (
        <ClickAwayListener onClickAway={onClose}>
            <Box sx={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 340,
                bgcolor: "#1a2444",
                border: "1px solid #2a3a6a",
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                zIndex: 1200,
                overflow: "hidden",
            }}>
                {/* header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" px={2.5} py={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <NotificationsIcon sx={{ color: "#2563eb", fontSize: 18 }} />
                        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                            Notifications
                        </Typography>
                        {unreadCount > 0 && (
                            <Box sx={{
                                bgcolor: "#ef4444", color: "#fff", borderRadius: 10,
                                fontSize: 10, fontWeight: 700, px: 0.8, py: 0.1, lineHeight: 1.6,
                            }}>
                                {unreadCount}
                            </Box>
                        )}
                    </Stack>
                    {unreadCount > 0 && (
                        <Tooltip title="Mark all as read">
                            <IconButton size="small" onClick={onReadAll}
                                sx={{ color: "#6b7280", "&:hover": { color: "#2563eb" } }}>
                                <DoneAllIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>

                <Divider sx={{ borderColor: "#2a3a6a" }} />

                {/* body */}
                <Box sx={{ maxHeight: 380, overflowY: "auto",
                    "&::-webkit-scrollbar": { width: 4 },
                    "&::-webkit-scrollbar-thumb": { bgcolor: "#2a3a6a", borderRadius: 2 },
                }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress size={24} sx={{ color: "#2563eb" }} />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box py={5} textAlign="center">
                            <NotificationsNoneIcon sx={{ color: "#2a3a6a", fontSize: 36, mb: 1 }} />
                            <Typography sx={{ color: "#6b7280", fontSize: 13 }}>No notifications yet</Typography>
                        </Box>
                    ) : (
                        notifications.map((n, i) => (
                            <Box key={n.notificationId}>
                                <NotificationItem notification={n} onRead={onRead} />
                                {i < notifications.length - 1 && <Divider sx={{ borderColor: "#2a3a6a20" }} />}
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
        </ClickAwayListener>
    );
}