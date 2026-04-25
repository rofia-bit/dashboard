/* eslint-disable no-unused-vars */

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpIcon from "@mui/icons-material/Help";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

import { Box, List, ListItem, ListItemIcon, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/resident_app_logo.png";


export const SIDEBAR_COLLAPSED = 64;
export const SIDEBAR_EXPANDED  = 218;

const ADMIN_MENU = {
  appName: "ResiGate",
  sections: [
    {
      label: "General",
      items: [
        { icon: <DashboardIcon sx={{ fontSize: 20 }} />, label: "Dashboard", path: "/dashboard" },
        { icon: <WarningIcon sx={{ fontSize: 20 }} />,   label: "Incidents",  path: "/incidents" },
        { icon: <PeopleIcon sx={{ fontSize: 20 }} />,    label: "Users",      path: "/Edit" },
      ],
    },
    {
      label: "Management",
      items: [
        { icon: <AssignmentOutlinedIcon sx={{ fontSize: 20 }} />, label: "Reports",        path: "/reports" },
        { icon: <PeopleOutlineIcon sx={{ fontSize: 20 }} />,      label: "Guest Requests", path: "/guest-requests" },
      ],
    },
  ],
  settingsItems: [
    { icon: <SettingsIcon sx={{ fontSize: 20 }} />, label: "Settings",       path: "/settings" },
    { icon: <HelpIcon sx={{ fontSize: 20 }} />,     label: "Help & Support", path: "/help" },
  ],
};

const GUARD_MENU = {
  appName: "ResiGate",
  sections: [
    {
      label: "General",
      items: [
        { icon: <DashboardIcon sx={{ fontSize: 20 }} />,     label: "Dashboard",   path: "/guard" },
        { icon: <QrCodeScannerIcon sx={{ fontSize: 20 }} />, label: "QR Scanner",  path: "/guard/qr" },
        { icon: <ListAltIcon sx={{ fontSize: 20 }} />,       label: "Access Logs", path: "/guard/logs" },
        { icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,    label: "My Shifts",   path: "/guard/shifts" },
      ],
    },
  ],
  settingsItems: [
    { icon: <SettingsIcon sx={{ fontSize: 20 }} />, label: "Settings", path: "/settings" },
  ],
};


function NavItem({ item, navigate, active, expanded }) {
  const content = (
    <ListItem
      button
      onClick={() => navigate(item.path)}
      sx={{
        mb: 0.5,
        borderRadius: "10px",
        bgcolor: active ? "#2563eb1a" : "transparent",
        border: active ? "1px solid #2563eb28" : "1px solid transparent",
        "&:hover": {
          bgcolor: active ? "#2563eb22" : "#0d1a36",
          border: "1px solid #162040",
        },
        cursor: "pointer",
        py: 1,
        px: expanded ? 1.2 : 0,
        justifyContent: expanded ? "flex-start" : "center",
        minWidth: 0,
        transition: "all 0.22s ease",
        overflow: "hidden",
      }}
    >
      <ListItemIcon
        sx={{
          color: active ? "#2563eb" : "#64718f",
          minWidth: 0,
          mr: expanded ? 1.4 : 0,
          transition: "margin 0.22s ease, color 0.15s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.icon}
      </ListItemIcon>

      <Typography
        sx={{
          color: active ? "#dce8ff" : "#8494b4",
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          whiteSpace: "nowrap",
          opacity: expanded ? 1 : 0,
          maxWidth: expanded ? 160 : 0,
          overflow: "hidden",
          transition: "opacity 0.18s ease, max-width 0.22s ease",
          letterSpacing: 0.15,
        }}
      >
        {item.label}
      </Typography>
    </ListItem>
  );

  return !expanded ? (
    <Tooltip
      title={item.label}
      placement="right"
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "#090f22",
            color: "#c0cbdf",
            fontSize: 12,
            fontWeight: 500,
            border: "1px solid #162040",
            borderRadius: "8px",
            px: 1.5,
            py: 0.6,
          },
        },
        arrow: { sx: { color: "#162040" } },
      }}
    >
      {content}
    </Tooltip>
  ) : content;
}


function SectionLabel({ label, expanded }) {
  return (
    <Box
      sx={{
        height: expanded ? 20 : 0,
        overflow: "hidden",
        px: 1,
        mb: expanded ? 0.8 : 0,
        transition: "height 0.2s ease, margin 0.2s ease",
      }}
    >
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          color: "#253350",
          textTransform: "uppercase",
          letterSpacing: 1.1,
          whiteSpace: "nowrap",
          opacity: expanded ? 1 : 0,
          transition: "opacity 0.15s ease",
          lineHeight: "20px",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}



//bar
function Sidebar() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const menu     = user.role === "SECURITY_GUARD" ? GUARD_MENU : ADMIN_MENU;
  const [activePath, setActivePath] = useState(
    localStorage.getItem("activeSidebarPath") || menu.sections[0].items[0].path
  );
  const [expanded, setExpanded] = useState(false);

  const handleNavigation = (path) => {
    setActivePath(path);
    localStorage.setItem("activeSidebarPath", path);
    navigate(path);
  };

  return (
    <Box
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      sx={{
        width: expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED,
        height: "100vh",
        backgroundColor: "#060e22",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #0e1b35",
        px: expanded ? 1.5 : 1,
        py: 2.5,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1200,
        transition: "width 0.26s cubic-bezier(0.4,0,0.2,1), padding 0.26s ease",
        overflow: "hidden",
        boxShadow: expanded ? "6px 0 32px rgba(0,0,0,0.5)" : "none",
      }}
    >


      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          px: 0.5,
          minHeight: 36,
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="ResidentApp"
          sx={{
            height: 50,
            width: 50,
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            color: "#2563eb",
            fontWeight: 700,
            fontSize: 14.5,
            letterSpacing: 0.2,
            whiteSpace: "nowrap",
            opacity: expanded ? 1 : 0,
            maxWidth: expanded ? 150 : 0,
            overflow: "hidden",
            transition: "opacity 0.2s ease, max-width 0.26s ease",
          }}
        >
          {menu.appName}
        </Typography>
      </Box>


      <Box sx={{ height: "1px", bgcolor: "#0e1b35", mb: 2.5, mx: 0.5 }} />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": { width: "2px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#162040", borderRadius: 2 },
        }}
      >
        {menu.sections.map((section) => (
          <Box key={section.label} sx={{ mb: 2 }}>
            <SectionLabel label={section.label} expanded={expanded} />
            <List sx={{ px: 0, py: 0 }}>
              {section.items.map((item, i) => (
                <NavItem
                  key={i}
                  item={item}
                  navigate={handleNavigation}
                  active={activePath === item.path}
                  expanded={expanded}
                />
              ))}
            </List>
          </Box>
        ))}
      </Box>


      <Box sx={{ borderTop: "1px solid #0e1b35", pt: 2 }}>
        <SectionLabel label="Settings" expanded={expanded} />
        <List sx={{ px: 0, py: 0, mb: 1 }}>
          {menu.settingsItems.map((item, i) => (
            <NavItem
              key={i}
              item={item}
              navigate={handleNavigation}
              active={activePath === item.path}
              expanded={expanded}
            />
          ))}
        </List>

        {!expanded ? (
          <Tooltip
            title="Log Out"
            placement="right"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "#090f22",
                  color: "#ef4444",
                  fontSize: 12,
                  fontWeight: 500,
                  border: "1px solid #2a1212",
                  borderRadius: "8px",
                  px: 1.5,
                  py: 0.6,
                },
              },
              arrow: { sx: { color: "#2a1212" } },
            }}
          >
            <ListItem
              button
              onClick={() => { localStorage.clear(); navigate("/"); }}
              sx={{
                borderRadius: "10px",
                "&:hover": { bgcolor: "#1a0808" },
                cursor: "pointer",
                py: 1,
                px: 0,
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon sx={{ color: "#ef4444", minWidth: 0 }}>
                <LogoutIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
            </ListItem>
          </Tooltip>
        ) : (
          <ListItem
            button
            onClick={() => { localStorage.clear(); navigate("/"); }}
            sx={{
              borderRadius: "10px",
              "&:hover": { bgcolor: "#1a0808" },
              cursor: "pointer",
              py: 1,
              px: 1.2,
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ color: "#ef4444", minWidth: 0, mr: 1.4 }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <Typography sx={{ color: "#ef4444", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
              Log Out
            </Typography>
          </ListItem>
        )}
      </Box>
    </Box>
  );
}

export default Sidebar;