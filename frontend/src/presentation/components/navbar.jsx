import { Box, InputBase, IconButton, Typography, Badge } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import {useState} from "react";

import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/notifications/useNotifications.js";
import NotificationPanel from "./NotificationPanel.jsx";
import ToastNotification from "./ToastNotification.jsx";

const iconStyle = {
  color: "#a0a9c9",
  backgroundColor: "#1f2a5a",
  "&:hover": { backgroundColor: "#2a3a6a" },
  width: 40,
  height: 40,
};

function Navbar() {
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);

  const [fullName] = useState(() => {

    const storedUser = localStorage.getItem("user");

    console.log("storedUser", storedUser);

    if (!storedUser) return "";
        try {
            return JSON.parse(storedUser).fullname || "";
        } catch {
            return "";
        }
    });

    const {
        notifications, loading,
        unreadCount,
        markAsRead, markAllAsRead,
        toast, dismissToast,
    } = useNotifications();

  return (
    <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      bgcolor="#0f1523"
      borderBottom="1px solid #1f2a5a"
      flexWrap="wrap"
      gap={2}
    >
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
          Welcome!
        </Typography>
        <Typography sx={{ color: "#a0a9c9", fontSize: 12 }}>
          {fullName ? `Logged in as ${fullName}` : "Loading..."}
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        bgcolor="#1f2a5a"
        borderRadius={2}
        px={2}
        py={1}
        flex={1}
        maxWidth={350}
      >
        <SearchIcon sx={{ color: "#6b7280", mr: 1 }} />
        <InputBase
          placeholder="Search Here"
          sx={{
            flex: 1,
            color: "#fff",
            fontSize: 14,
            "& input::placeholder": { color: "#6b7280", opacity: 1 },
          }}
        />
      </Box>

      <Box display="flex" gap={1} sx={{ position: "relative" }}>

                    <IconButton sx={iconStyle} onClick={() => navigate("/settings")}>
                        <SettingsIcon fontSize="small" />
                    </IconButton>

                    {/* first */}
                    <Box sx={{ position: "relative" }}>
                        <IconButton
                            sx={{
                                ...iconStyle,
                                ...(unreadCount > 0 && { color: "#fff", backgroundColor: "#2563eb",
                                    "&:hover": { backgroundColor: "#1d4ed8" } }),
                            }}
                            onClick={() => setPanelOpen(prev => !prev)}
                        >
                            <Badge
                                badgeContent={unreadCount}
                                max={99}
                                sx={{
                                    "& .MuiBadge-badge": {
                                        bgcolor: "#ef4444", color: "#fff",
                                        fontSize: 10, fontWeight: 700,
                                        minWidth: 16, height: 16, padding: "0 4px",
                                    },
                                }}
                            >
                                <NotificationsIcon fontSize="small" />
                            </Badge>
                        </IconButton>
 
                        {panelOpen && (
                            <NotificationPanel
                                notifications={notifications}
                                loading={loading}
                                unreadCount={unreadCount}
                                onRead={markAsRead}
                                onReadAll={markAllAsRead}
                                onClose={() => setPanelOpen(false)}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
            <ToastNotification toast={toast} onDismiss={dismissToast} />
    </>
  );
}

export default Navbar;