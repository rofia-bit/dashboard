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

import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const ADMIN_MENU = {
    title: "Dashboard",
    sections: [
        {
            label: "General",
            items: [
                { icon: <DashboardIcon />, label: "Dashboard",  path: "/dashboard" },
                { icon: <WarningIcon />,   label: "Incidents",  path: "/incidents" },
                { icon: <PeopleIcon />,    label: "Users",      path: "/Edit" },
            ],
        },
        {
            label: "Management",
            items: [
                { icon: <AssignmentOutlinedIcon />,  label: "Reports",         path: "/reports" },
                { icon: <PeopleOutlineIcon />,       label: "Guest Requests",  path: "/guest-requests" },
            ],
        },
    ],
    settingsItems: [
        { icon: <SettingsIcon />, label: "Settings",      path: "/settings" },
        { icon: <HelpIcon />,     label: "Help & Support", path: "/help" },
    ],
};
 
const GUARD_MENU = {
    title: "Guard Board",
    sections: [
        {
            label: "General",
            items: [
                { icon: <DashboardIcon />,    label: "Dashboard",   path: "/guard" },
                { icon: <QrCodeScannerIcon />, label: "QR Scanner",  path: "/guard/qr" },
                { icon: <ListAltIcon />,       label: "Access Logs", path: "/guard/logs" },
                { icon: <AccessTimeIcon />,    label: "My Shifts",   path: "/guard/shifts" },
            ],
        },
    ],
    settingsItems: [
        { icon: <SettingsIcon />, label: "Settings",      path: "/settings" },
        //{ icon: <HelpIcon />,     label: "Help & Support", path: "/help" },
    ],
};
 

function NavItem({ item, navigate, active }) {
    return (
        <ListItem
            button
            onClick={() => navigate(item.path)}
            sx={{
                mb: 1, borderRadius: 1.5,
                bgcolor: active ? "#2563eb20" : "transparent",
                border: active ? "1px solid #2563eb40" : "1px solid transparent",
                "&:hover": { backgroundColor: active ? "#2563eb20" : "#1c264c" },
                cursor: "pointer", py: 1.2, px: 1,
            }}
        >
            <ListItemIcon sx={{ color: active ? "#2563eb" : "#a0a9c9", minWidth: 36 }}>
                {item.icon}
            </ListItemIcon>
            <ListItemText
                primary={item.label}
                sx={{ "& .MuiListItemText-primary": { color: active ? "#2563eb" : "#a0a9c9", fontSize: 13, fontWeight: active ? 600 : 500 } }}
            />
        </ListItem>
    );
}

//------

function Sidebar() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const menu = user.role === "SECURITY_GUARD" ? GUARD_MENU : ADMIN_MENU;
  //const menu = GUARD_MENU;
  const [activePath, setActivePath] = useState(localStorage.getItem("activeSidebarPath") || menu.sections[0].items[0].path);

  const handleNavigation = (path) => {
    setActivePath(path);
    localStorage.setItem("activeSidebarPath", path);
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: 200,
        height: "100vh",
        backgroundColor: "#081028",
        color: "#e0e0e0",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1f2a5a",
        px: 2,
        py: 3,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >


      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: "#2563eb",
            letterSpacing: 1,
          }}
        >
         {menu.title}
        </Typography>
      </Box>


      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#1f2a5a", borderRadius: 2 },
        }}
      >


        {menu.sections.map((section) => (
                    <Box key={section.label} sx={{ mb: 4 }}>
                        <Typography sx={{
                            fontSize: 11, fontWeight: 700, color: "#6b7280",
                            textTransform: "uppercase", letterSpacing: 0.5, mb: 1.5, px: 1,
                        }}>
                            {section.label}
                        </Typography>
                        <List sx={{ px: 0 }}>
                            {section.items.map((item, i) => (
                                <NavItem key={i} item={item} navigate={handleNavigation} active={activePath === item.path} />
                            ))}
                        </List>
                    </Box>
                ))}
            </Box>


            <Box sx={{ borderTop: "1px solid #1f2a5a", pt: 3 }}>
                <Typography sx={{
                    fontSize: 11, fontWeight: 700, color: "#6b7280",
                    textTransform: "uppercase", letterSpacing: 0.5, mb: 1.5, px: 1,
                }}>
                    Settings
                </Typography>
                <List sx={{ px: 0, mb: 2 }}>
                    {menu.settingsItems.map((item, i) => (
                        <NavItem key={i} item={item} navigate={handleNavigation} active={activePath === item.path} />
                    ))}
                </List>

                <ListItem
                    button
                    onClick={() => { localStorage.clear(); navigate("/"); }}
                    sx={{
                        borderRadius: 1.5,
                        "&:hover": { backgroundColor: "#1c264c" },
                        cursor: "pointer", py: 1.3, px: 1,
                    }}
                >
                    <ListItemIcon sx={{ color: "#ef4444", minWidth: 36 }}>
                        <LogoutIcon sx={{ fontSize: 21 }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Log Out"
                        sx={{ "& .MuiListItemText-primary": { color: "#ef4444", fontSize: 14, fontWeight: 500 } }}
                    />
                </ListItem>
            </Box>
        </Box>
    );
}

export default Sidebar;