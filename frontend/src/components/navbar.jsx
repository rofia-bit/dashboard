import { Box, InputBase, IconButton, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";

const iconStyle = {
  color: "#a0a9c9",
  backgroundColor: "#1f2a5a",
  "&:hover": { backgroundColor: "#2a3a6a" },
  width: 40,
  height: 40,
};

function Navbar() {
  return (
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
          talk talk talk
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

      <Box display="flex" gap={1}>
        <IconButton sx={iconStyle}>
          <SettingsIcon fontSize="small" />
        </IconButton>
        <IconButton sx={iconStyle}>
          <NotificationsIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Navbar;