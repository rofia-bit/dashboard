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
                px: 2,
                py: 1.4,
                cursor: notification.read ? "default" : "pointer",
                bgcolor: notification.read ? "transparent" : `${accent}09`,
                borderLeft: `2px solid ${emergency ? "#ef4444" : notification.read ? "transparent" : "#2563eb35"}`,
                transition: "background 0.15s",
                "&:hover": {
                    bgcolor: "rgba(255,255,255,0.05)",
                },
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">

                <Box
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "9px",
                        flexShrink: 0,
                        bgcolor: `${accent}15`,
                        border: `1px solid ${accent}28`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {emergency
                        ? <WarningAmberIcon sx={{ fontSize: 15, color: "#ef4444" }} />
                        : <NotificationsNoneIcon sx={{ fontSize: 15, color: "#2563eb" }} />
                    }
                </Box>


                <Box flex={1} minWidth={0}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.25}>
                        <Typography
                            sx={{
                                fontSize: 11.5,
                                fontWeight: notification.read ? 400 : 600,
                                color: emergency ? "#ef4444" : "rgba(255,255,255,0.85)",
                                letterSpacing: 0.1,
                            }}
                        >
                            {emergency ? "Emergency Alert" : "Notification"}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.3)", flexShrink: 0, ml: 1 }}>
                            {fmtTime(notification.createdAt)}
                        </Typography>
                    </Stack>
                    <Typography
                        sx={{
                            fontSize: 11.5,
                            color: "rgba(255,255,255,0.45)",
                            lineHeight: 1.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {notification.content}
                    </Typography>
                </Box>


                {!notification.read && (
                    <FiberManualRecordIcon sx={{ fontSize: 7, color: accent, flexShrink: 0, mt: 0.6 }} />
                )}
            </Stack>
        </Box>
    );
}


export default function NotificationPanel({ notifications, loading, unreadCount, onRead, onReadAll, onClose }) {
    return (
        <ClickAwayListener onClickAway={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: 320,

                    bgcolor: "rgba(6, 14, 34, 0.82)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "16px",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
                    zIndex: 1300,
                    overflow: "hidden",
                }}
            >

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    py={1.6}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                            sx={{
                                width: 28,
                                height: 28,
                                borderRadius: "8px",
                                bgcolor: "rgba(37,99,235,0.15)",
                                border: "1px solid rgba(37,99,235,0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <NotificationsIcon sx={{ color: "#2563eb", fontSize: 15 }} />
                        </Box>
                        <Typography sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600, fontSize: 13 }}>
                            Notifications
                        </Typography>
                        {unreadCount > 0 && (
                            <Box
                                sx={{
                                    bgcolor: "#ef4444",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    px: 0.7,
                                    py: 0.1,
                                    lineHeight: 1.7,
                                    minWidth: 18,
                                    textAlign: "center",
                                }}
                            >
                                {unreadCount}
                            </Box>
                        )}
                    </Stack>

                    {unreadCount > 0 && (
                        <Tooltip title="Mark all as read">
                            <IconButton
                                size="small"
                                onClick={onReadAll}
                                sx={{
                                    color: "rgba(255,255,255,0.3)",
                                    "&:hover": { color: "#2563eb", bgcolor: "rgba(37,99,235,0.1)" },
                                    borderRadius: "8px",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                <DoneAllIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>


                <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.07)", mx: 2 }} />


                <Box
                    sx={{
                        maxHeight: 360,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": { width: "3px" },
                        "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(255,255,255,0.1)", borderRadius: 2 },
                    }}
                >
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress size={22} sx={{ color: "#2563eb" }} />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box py={5} textAlign="center">
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "12px",
                                    bgcolor: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 1.5,
                                }}
                            >
                                <NotificationsNoneIcon sx={{ color: "rgba(255,255,255,0.2)", fontSize: 22 }} />
                            </Box>
                            <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                                No notifications yet
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((n, i) => (
                            <Box key={n.notificationId}>
                                <NotificationItem notification={n} onRead={onRead} />
                                {i < notifications.length - 1 && (
                                    <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.05)", mx: 2 }} />
                                )}
                            </Box>
                        ))
                    )}
                </Box>


                {notifications.length > 0 && (
                    <>
                        <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.07)", mx: 2 }} />
                        <Box px={2} py={1.2} textAlign="center">
                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: "rgba(37,99,235,0.7)",
                                    cursor: "pointer",
                                    "&:hover": { color: "#2563eb" },
                                    transition: "color 0.15s ease",
                                    fontWeight: 500,
                                }}
                            >
                                View all notifications
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </ClickAwayListener>
    );
}