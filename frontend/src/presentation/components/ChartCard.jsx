/* eslint-disable react-refresh/only-export-components */
import { Box, Typography, CircularProgress } from "@mui/material";

/**
 * ChartCard
 * @param {string}  title
 * @param {number}  [minH=260]
 * @param {node}    children
 */

export function ChartCard({ title, children, minH = 260 }) {
    return (
        <Box sx={{
            bgcolor: "#1a2444",
            borderRadius: 2,
            border: "1px solid #2a3a6a",
            p: 3,
            height: "100%",
        }}>

        
            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 15, mb: 2 }}>
                {title}
            </Typography>
            <Box sx={{ minHeight: minH }}>
                {children}
            </Box>
        </Box>
    );
}


export function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <Box sx={{
            bgcolor: "#0f1523",
            border: "1px solid #2a3a6a",
            borderRadius: 1,
            px: 2, py: 1,
        }}>
            {label && (
                <Typography sx={{ color: "#a0a9c9", fontSize: 11, mb: 0.5 }}>
                    {label}
                </Typography>
            )}
            {payload.map((p, i) => (
                <Typography key={i} sx={{ color: p.color || "#fff", fontSize: 12 }}>
                    {p.name}: <strong>{p.value}</strong>
                </Typography>
            ))}
        </Box>
    );
}



export function ChartSpinner() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress sx={{ color: "#2563eb" }} size={28} />
        </Box>
    );
}


export function ChartEmpty({ message = "No data available" }) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography sx={{ color: "#6b7280", fontSize: 13 }}>{message}</Typography>
        </Box>
    );
}


export const CHART_COLORS = ["#2563eb", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e"];

export const STATUS_COLORS = {
    OPEN:        "#ef4444",
    IN_PROGRESS: "#f59e0b",
    RESOLVED:    "#22c55e",
    CLOSED:      "#6b7280",
};

export const ROLE_COLORS = {
    ADMIN:          "#2563eb",
    RESIDENT:       "#06b6d4",
    SECURITY_GUARD: "#8b5cf6",
    STAFF:          "#f59e0b",
};

export const SHIFT_STATUS_COLORS = {
    Active:   "#22c55e",
    Upcoming: "#2563eb",
    Ended:    "#6b7280",
};