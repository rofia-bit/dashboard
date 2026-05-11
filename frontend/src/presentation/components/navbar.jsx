import { Box, InputBase, IconButton, Typography, Badge } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/notifications/useNotifications.js";
import NotificationPanel from "./NotificationPanel.jsx";
import ToastNotification from "./ToastNotification.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

function Navbar() {
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  const [userData] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return { fullname: "", role: "" };
    try {
      return JSON.parse(storedUser) || {};
    } catch {
      return {};
    }
  });

  const isGuard = userData.role === "SECURITY_GUARD";
  const dashTitle = isGuard ? "Guard Dashboard" : "Admin Dashboard";

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
        px={3}
        py={1.8}
        sx={{
          backgroundColor: "transparent",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Title */}
        <Box display="flex" flexDirection="column" gap={0.3}>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: 0.3,
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            {dashTitle}
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 12,
              fontWeight: 400,
              textShadow: "0 1px 6px rgba(0,0,0,0.5)",
            }}
          >
            {userData.fullname ? `Logged in as ${userData.fullname}` : "Loading..."}
          </Typography>
        </Box>

        {/* Search */}
        <Box
          display="flex"
          alignItems="center"
          sx={{
            bgcolor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "12px",
            px: 2,
            py: 0.9,
            flex: 1,
            maxWidth: 380,
            mx: 4,
            transition: "all 0.2s ease",
            "&:focus-within": {
              bgcolor: "rgba(255,255,255,0.13)",
            },
          }}
        >
          <SearchIcon sx={{ color: "rgba(255,255,255,0.45)", mr: 1, fontSize: 18 }} />
          <InputBase
            placeholder="Search here…"
            sx={{
              flex: 1,
              color: "#fff",
              fontSize: 13,
              "& input::placeholder": { color: "rgba(255,255,255,0.4)", opacity: 1 },
            }}
          />
          <Typography
            sx={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 11,
              fontFamily: "monospace",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "5px",
              px: 0.8,
              py: 0.2,
              lineHeight: 1.4,
            }}
          >
            (●'◡'●)
          </Typography>
        </Box>

        {/* Right */}
        <Box display="flex" gap={1} sx={{ position: "relative" }}>

          {/* Theme toggle */}
          <IconButton
            onClick={toggle}
            sx={{
              color: "rgba(255,255,255,0.7)",
              bgcolor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              width: 38,
              height: 38,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.14)",
                color: "#fff",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isDark
              ? <LightModeIcon sx={{ fontSize: 18 }} />
              : <DarkModeIcon  sx={{ fontSize: 18 }} />
            }
          </IconButton>

          {/* Settings */}
          <IconButton
            onClick={() => navigate("/settings")}
            sx={{
              color: "rgba(255,255,255,0.7)",
              bgcolor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              width: 38,
              height: 38,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.14)",
                color: "#fff",
              },
              transition: "all 0.2s ease",
            }}
          >
            <SettingsIcon sx={{ fontSize: 18 }} />
          </IconButton>

          {/* Notifications */}
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setPanelOpen((prev) => !prev)}
              sx={{
                color: unreadCount > 0 ? "#fff" : "rgba(255,255,255,0.7)",
                bgcolor: unreadCount > 0
                  ? "rgba(37,99,235,0.55)"
                  : "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${unreadCount > 0 ? "rgba(37,99,235,0.6)" : "rgba(255,255,255,0.12)"}`,
                width: 38,
                height: 38,
                "&:hover": {
                  bgcolor: unreadCount > 0
                    ? "rgba(37,99,235,0.7)"
                    : "rgba(255,255,255,0.14)",
                  color: "#fff",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Badge
                badgeContent={unreadCount}
                max={99}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#ef4444",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    minWidth: 15,
                    height: 15,
                    padding: "0 3px",
                  },
                }}
              >
                <NotificationsIcon sx={{ fontSize: 18 }} />
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