import { Box, Typography, Stack, Button, TextField, Chip } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import { LogRepositoryImpl } from "../../../data/repositories/logs/LogRepositoryImpl.js";
import { LogUseCase } from "../../../domain/usecases/logs/LogUseCase.js";

const logRepository = new LogRepositoryImpl();
const logUseCase    = new LogUseCase(logRepository);

function QRScanner() {
    const [scanned, setScanned]   = useState("");
    const [status, setStatus]     = useState(null);
    const [message, setMessage]   = useState("");
    const [loading, setLoading]   = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleConfirm = async () => {
        if (!scanned.trim()) return;
        setLoading(true);
        setStatus(null);
        try {
            await logUseCase.createLog(user.fullname, user.role, `QR_SCAN: ${scanned}`);
            setStatus("success");
            setMessage(`Access logged for: ${scanned}`);
            setScanned("");
        } catch (err) {
            setStatus("error");
            setMessage(err.message || "Failed to log access");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" flex={1}>
            <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
                <Box mb={4}>
                    <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>QR Scanner</Typography>
                    <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>Scan a QR code to record access</Typography>
                </Box>

                <Box sx={{
                    maxWidth: 480,
                    bgcolor: "#1a2444",
                    borderRadius: 2,
                    border: "1px solid #2a3a6a",
                    p: 4,
                }}>
                    {/* cam later */}
                    <Box sx={{
                        width: "100%",
                        height: 260,
                        bgcolor: "#0f1523",
                        borderRadius: 2,
                        border: "2px dashed #2a3a6a",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        gap: 1.5,
                    }}>
                        <QrCodeScannerIcon sx={{ fontSize: 56, color: "#2563eb", opacity: 0.7 }} />
                        <Typography sx={{ color: "#6b7280", fontSize: 13 }}>
                            Camera feed
                        </Typography>
                        <Chip
                            label="Camera integration coming soon"
                            size="small"
                            sx={{ bgcolor: "#2563eb20", color: "#2563eb", fontSize: 11, border: "1px solid #2563eb30" }}
                        />
                    </Box>

                    {/* manual input fallback */}
                    <Typography sx={{ color: "#6b7280", fontSize: 12, mb: 1.5, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>
                        Manual Entry
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            placeholder="Enter QR code value manually…"
                            value={scanned}
                            onChange={e => setScanned(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleConfirm()}
                            fullWidth
                            size="small"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "#0f1523", color: "#fff", fontSize: 13,
                                    "& fieldset": { borderColor: "#2a3a6a" },
                                    "&:hover fieldset": { borderColor: "#4b5563" },
                                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                                },
                                "& input::placeholder": { color: "#6b7280", opacity: 1 },
                            }}
                        />

                        <Button
                            onClick={handleConfirm}
                            disabled={!scanned.trim() || loading}
                            startIcon={<CheckCircleOutlineIcon />}
                            sx={{
                                bgcolor: "#2563eb", color: "#fff", textTransform: "none",
                                fontWeight: 600, fontSize: 13, borderRadius: 1,
                                "&:hover": { bgcolor: "#1d4ed8" },
                                "&.Mui-disabled": { bgcolor: "#2a3a6a", color: "#6b7280" },
                            }}
                        >
                            {loading ? "Logging…" : "Confirm & Log Access"}
                        </Button>

                        {status && (
                            <Typography sx={{
                                fontSize: 13,
                                color: status === "success" ? "#22c55e" : "#ef4444",
                                bgcolor: status === "success" ? "#22c55e15" : "#ef444415",
                                border: `1px solid ${status === "success" ? "#22c55e30" : "#ef444430"}`,
                                borderRadius: 1, px: 2, py: 1,
                            }}>
                                {message}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

export default QRScanner;