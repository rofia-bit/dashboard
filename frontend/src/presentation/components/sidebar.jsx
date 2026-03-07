import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import InsightsIcon from "@mui/icons-material/Insights";
import HelpIcon from "@mui/icons-material/Help";

import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";



function Sidebar() {
  const navigate = useNavigate();

  const generalItems = [
    { icon: <DashboardIcon />, label: "Dashboard", path: "/Dashboard" },
    { icon: <WarningIcon />, label: "Incidents", path: "/." },
    { icon: <PeopleIcon />, label: "Users", path: "/Edit" },
  ];

  const reportItems = [
    { icon: <InsightsIcon />, label: "Incidents Details", path: "/." },
  ];

  const settingsItems = [
    { icon: <SettingsIcon />, label: "Settings", path: "/." },
    { icon: <HelpIcon />, label: "Help & Support", path: "/." },
  ];


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
         Dashboard
        </Typography>
      </Box>

      {/* bar */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#1f2a5a", borderRadius: 2 },
        }}
      >


        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 1.5,
              px: 1,
            }}
          >
            General
          </Typography>
          <List sx={{ px: 0 }}>
            {generalItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 1.5,
                  "&:hover": { backgroundColor: "#1c264c" },
                  cursor: "pointer",
                  py: 1.2,
                  px: 1,
                }}
              >
                <ListItemIcon sx={{ color: "#a0a9c9", minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ "& .MuiListItemText-primary": { color: "#a0a9c9", fontSize: 13, fontWeight: 500 } }}
                />
              </ListItem>
            ))}
          </List>
        </Box>


        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 1.5,
              px: 1,
            }}
          >
            Reports
          </Typography>
          <List sx={{ px: 0 }}>
            {reportItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 1.5,
                  "&:hover": { backgroundColor: "#1c264c" },
                  cursor: "pointer",
                  py: 1.2,
                  px: 1,
                }}
              >
                <ListItemIcon sx={{ color: "#a0a9c9", minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ "& .MuiListItemText-primary": { color: "#a0a9c9", fontSize: 13, fontWeight: 500 } }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ borderTop: "1px solid #1f2a5a", pt: 3 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            mb: 1.5,
            px: 1,
          }}
        >
          Settings
        </Typography>
        <List sx={{ px: 0, mb: 2 }}>
          {settingsItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => navigate(item.path)}
              sx={{
                mb: 1,
                borderRadius: 1.5,
                "&:hover": { backgroundColor: "#1c264c" },
                cursor: "pointer",
                py: 1.2,
                px: 1,
              }}
            >
              <ListItemIcon sx={{ color: "#a0a9c9", minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ "& .MuiListItemText-primary": { color: "#a0a9c9", fontSize: 13, fontWeight: 500 } }}
              />
            </ListItem>
          ))}
        </List>

       


        <ListItem
          button
          onClick={() => navigate("/.")}
          sx={{
            borderRadius: 1.5,
            "&:hover": { backgroundColor: "#1c264c" },
            cursor: "pointer",
            py: 1.3,
            px: 1,
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