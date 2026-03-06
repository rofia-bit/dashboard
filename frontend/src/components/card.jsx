import { Box, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const iconMap = {
  active: <CheckCircleIcon sx={{ fontSize: 24 }} />,
  inactive: <CancelIcon sx={{ fontSize: 24 }} />,
  default: <PeopleIcon sx={{ fontSize: 24 }} />,
};

const colorMap = {
  active: "#10b981",
  inactive: "#ef4444",
  default: "#6b7280",
};

function StatCard({ title, value, icon, type = "default" }) {
  const cardIcon = icon || iconMap[type] || iconMap.default;
  const iconColor = colorMap[type] || colorMap.default;

  
  return (
    <Box
      sx={{
        bgcolor: "#111c44",
        p: 2,
        borderRadius: 2,
        minWidth: 200,
        border: "1px solid #1f2a5a",
        flex: 1,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography sx={{ color: "#a0a9c9", fontSize: 12, fontWeight: 500, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ color: iconColor, opacity: 0.8 }}>{cardIcon}</Box>
      </Box>
    </Box>
  );
}

export default StatCard;