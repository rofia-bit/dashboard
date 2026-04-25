/* eslint-disable no-unused-vars */
import { Box, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import GroupsIcon from "@mui/icons-material/Groups";
import { motion } from "framer-motion";

const iconMap = {
  active:   <CheckCircleIcon sx={{ fontSize: 17 }} />,
  inactive: <CancelIcon sx={{ fontSize: 17 }} />,
  default:  <PeopleIcon sx={{ fontSize: 17 }} />,
  users:    <GroupsIcon sx={{ fontSize: 17 }} />,
};

const colorMap = {
  active:   "#10b981",
  inactive: "#ef4444",
  default:  "#a0a9c9",
  users:    "#2563eb",
};

function StatCard({ title, value, icon, type = "default", index = 0 }) {
  const cardIcon  = icon || iconMap[type] || iconMap.default;
  const iconColor = colorMap[type] || colorMap.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      style={{ flex: 1, minWidth: 130, maxWidth: 200 }}
    >
      <Box
        sx={{
          bgcolor: "rgba(6, 14, 34, 0.62)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          p: "14px 16px",
          cursor: "default",
          transition: "box-shadow 0.22s ease, border-color 0.22s ease",
        }}
      >

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            width: 10,
            height: 10,
            color: iconColor,
            mb: 1.2,
          }}
        >
          {cardIcon}
        </Box>


        <Typography
          sx={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            mb: 0.4,
            lineHeight: 1,
          }}
        >
          {title}
        </Typography>


        <Box display="flex" alignItems="flex-end" justifyContent="space-between">
          <motion.div
            key={value}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: -0.5,
              }}
            >
              {value}
            </Typography>
          </motion.div>

          <Typography
            sx={{
              color: iconColor,
              opacity: 0.65,
              fontSize: 14,
              pb: 0.2,
              lineHeight: 1,
            }}
          >
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}

export default StatCard;