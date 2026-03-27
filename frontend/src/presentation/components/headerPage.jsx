import { Box, Typography, Button } from "@mui/material";
//ts for title + subtitle + optional action button / delete later on !!

/**
 * @param {string}   title
 * @param {string}   subtitle
 * @param {string}   [actionLabel]
 * @param {node}     [actionIcon]
 * @param {function} [onAction]
 */

export default function headerPage ({ title, subtitle, actionLabel, actionIcon, onAction }) {
    return (
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box>
                <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>{title}</Typography>
                <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>{subtitle}</Typography>
            </Box>
            {actionLabel && (
                <Button
                    startIcon={actionIcon}
                    onClick={onAction}
                    sx={{
                        bgcolor: "#2563eb", color: "#fff", textTransform: "none",
                        fontWeight: 600, fontSize: 13, borderRadius: 1,
                        "&:hover": { bgcolor: "#1d4ed8" },
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}