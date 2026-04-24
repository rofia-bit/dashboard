/* eslint-disable no-unused-vars */
import { Box, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { motion } from "framer-motion";


const iconMap = {
  active:   <CheckCircleIcon sx={{ fontSize: 24 }} />,
  inactive: <CancelIcon sx={{ fontSize: 24 }} />,
  default:  <PeopleIcon sx={{ fontSize: 24 }} />,
};

const colorMap = {
  active:   "#10b981",
  inactive: "#ef4444",
  default:  "#6b7280",
};

function StatCard({ title, value, icon, type = "default", index = 0 }) {
  const cardIcon  = icon || iconMap[type] || iconMap.default;
  const iconColor = colorMap[type] || colorMap.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ flex: 1, minWidth: 200 }}
    >
      <Box
        sx={{
          bgcolor: "#111c44",
          p: 2,
          borderRadius: 2,
          border: "1px solid #1f2a5a",
          height: "100%",
          transition: "box-shadow 0.2s, border-color 0.2s",
          "&:hover": {
            boxShadow: `0 8px 32px #2563eb22`,
            borderColor: "#2563eb40",
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography sx={{ color: "#a0a9c9", fontSize: 12, fontWeight: 500, mb: 0.5 }}>
              {title}
            </Typography>
            <motion.div
              key={value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>
                {value}
              </Typography>
            </motion.div>
          </Box>
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.6, delay: index * 0.08 + 0.3 }}
          >
            <Box sx={{ color: iconColor, opacity: 0.8 }}>{cardIcon}</Box>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
}

export default StatCard;