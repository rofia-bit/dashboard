// make a reusable delete confirmation dialog that pop up.
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

/**
 * @param {boolean}  open
 * @param {string}   title
 * @param {string}   message
 * @param {string}   [confirmLabel]
 * @param {boolean}  loading
 * @param {function} onClose
 * @param {function} onConfirm
 */
export default function diaglog({
    open, title, message,
    confirmLabel = "Delete",
    loading, onClose, onConfirm,
}) {
    if (!open) return null;
    return (
        <Dialog open onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { bgcolor: "#1a2444", border: "1px solid #ef444440", borderRadius: 2 } }}>
            <DialogTitle sx={{ color: "#ef4444", fontWeight: 700, fontSize: 15 }}>{title}</DialogTitle>
            <DialogContent>
                <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>{message}</Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading} sx={{ color: "#a0a9c9", textTransform: "none" }}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} disabled={loading} sx={{
                    bgcolor: "#ef4444", color: "#fff", textTransform: "none", fontWeight: 600,
                    "&:hover": { bgcolor: "#dc2626" },
                }}>
                    {loading ? "Deleting..." : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}