/* eslint-disable react-refresh/only-export-components */
import { Box, Typography, CircularProgress } from "@mui/material";

export function ChartCard({ title, children, minH = 320 }) {
    return (
        <Box sx={{
            bgcolor: "var(--bg-card)",
            borderRadius: 3,
            border: "1px solid var(--border-color)",
            p: 3,
            height: "100%",
            transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}>
            <Typography sx={{
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: 15,
                mb: 2,
                transition: "color 0.3s ease",
            }}>
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
            bgcolor: "var(--tooltip-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: 1,
            px: 2, py: 1,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}>
            {label && (
                <Typography sx={{ color: "var(--text-secondary)", fontSize: 11, mb: 0.5 }}>
                    {label}
                </Typography>
            )}
            {payload.map((p, i) => (
                <Typography key={i} sx={{ color: p.color || "var(--text-primary)", fontSize: 12 }}>
                    {p.name}: <strong>{p.value}</strong>
                </Typography>
            ))}
        </Box>
    );
}

export function ChartSpinner() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height={320}>
            <CircularProgress sx={{ color: "#2563eb" }} size={28} />
        </Box>
    );
}

export function ChartEmpty({ message = "No data available" }) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height={320}>
            <Typography sx={{ color: "var(--text-muted)", fontSize: 13 }}>{message}</Typography>
        </Box>
    );
}

export const CHART_COLORS  = ["#365fb9","#309fb2","#8b5cf6","#ec4899","#dfae5b","#40b18c"];
export const STATUS_COLORS = { OPEN:"#bd4242", IN_PROGRESS:"#dfae5b", RESOLVED:"#40b18c", CLOSED:"#6b7280" };
export const ROLE_COLORS   = { ADMIN:"#2563eb", RESIDENT:"#06b6d4", SECURITY_GUARD:"#8b5cf6", STAFF:"#dfae5b" };
export const SHIFT_STATUS_COLORS = { Active:"#22c55e", Upcoming:"#2563eb", Ended:"#6b7280" };