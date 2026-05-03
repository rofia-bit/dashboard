/* eslint-disable no-unused-vars */
import {
    Box, Typography, Stack, TextField, Button,
    Avatar, Divider, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useState } from "react";

import { UserRepositoryImpl } from "../../data/repositories/users/UserRepositoryImpl.js";
import { UserUseCase } from "../../domain/usecases/users/UserUseCase.js";
import { ShiftRepositoryImpl } from "../../data/repositories/shifts/ShiftRepositoryImpl.js";
import { ShiftUseCase } from "../../domain/usecases/shifts/ShiftUseCase.js";
import { useUpdateProfile } from "../hooks/users/profile/useUpdateProfile.js";
import { useEditPassword } from "../hooks/users/password/useEditPassword.js";
import { useGetMyShifts } from "../hooks/shifts/useGetMyShifts.js";

const userUseCase = new UserUseCase(new UserRepositoryImpl());
const shiftUseCase = new ShiftUseCase(new ShiftRepositoryImpl());

const inputSx = {
    "& .MuiOutlinedInput-root": {
        bgcolor: "#0f1523",
        color: "#fff",
        fontSize: 14,
        "& fieldset": { borderColor: "#2a3a6a" },
        "&:hover fieldset": { borderColor: "#4b5563" },
        "&.Mui-focused fieldset": { borderColor: "#2563eb" },
    },
    "& .MuiInputLabel-root": { color: "#6b7280" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
};

const saveBtnSx = {
    bgcolor: "#2563eb",
    color: "#fff",
    textTransform: "none",
    fontWeight: 600,
    fontSize: 13,
    borderRadius: 1,
    px: 3,
    "&:hover": { bgcolor: "#1d4ed8" },
};

const TABS = [
    { id: "profile", label: "Profile & Security", icon: <ShieldOutlinedIcon fontSize="small" /> },
    { id: "access", label: "Authorized Access", icon: <AccessTimeIcon fontSize="small" /> },
];

function Feedback({ error, success, msg }) {
    if (!error && !success) return null;
    return (
        <Alert
            severity={error ? "error" : "success"}
            icon={error ? undefined : <CheckCircleOutlineIcon fontSize="small" />}
            sx={{
                mb: 2,
                fontSize: 13,
                bgcolor: error ? "#ef444415" : "#22c55e15",
                color: error ? "#ef4444" : "#22c55e",
                border: `1px solid ${error ? "#ef444430" : "#22c55e30"}`,
            }}
        >
            {error || msg}
        </Alert>
    );
}

function ProfileTab() {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");

    const [fullname, setFullname] = useState(stored.fullname || "");
    const [email, setEmail] = useState(stored.email || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirm] = useState("");

    const { updateProfile, loading: pLoad, error: pErr, success: pSuc } = useUpdateProfile(userUseCase);
    const { editPassword, loading: pwLoad, error: pwErr, success: pwSuc } = useEditPassword(userUseCase);

    const dirty = fullname !== stored.fullname || email !== stored.email;
    const mismatch = confirmPassword && newPassword !== confirmPassword;
    const validPass = newPassword.length >= 6 && !mismatch;

    return (
        <Box>

            <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: "#2563eb" }}>
                    {fullname?.charAt(0)?.toUpperCase() || "A"}
                </Avatar>
                <Box>
                    <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                        {fullname}
                    </Typography>
                    <Typography sx={{ color: "#6b7280", fontSize: 13 }}>
                        {email}
                    </Typography>
                </Box>
            </Stack>

            <Typography sx={{ color: "#fff", fontWeight: 600, mb: 2 }}>
                Profile Information
            </Typography>

            <Feedback error={pErr} success={pSuc} msg="Profile updated" />

            <Stack spacing={2}>
                <TextField label="Full Name" value={fullname} onChange={e => setFullname(e.target.value)} fullWidth sx={inputSx} />
                <TextField label="Email Address" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={inputSx} />
            </Stack>

            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={() => updateProfile(fullname, email)} disabled={!dirty || pLoad} sx={saveBtnSx}>
                    Save Changes
                </Button>
            </Box>

            <Divider sx={{ my: 4, borderColor: "#232c4b" }} />

            <Typography sx={{ color: "#fff", fontWeight: 600, mb: 2 }}>
                Change Password
            </Typography>

            <Feedback error={pwErr} success={pwSuc} msg="Password updated" />

            <Stack spacing={2}>
                <TextField label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} sx={inputSx} />
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirm(e.target.value)}
                    error={!!mismatch}
                    helperText={mismatch ? "Passwords do not match" : ""}
                    sx={{ ...inputSx, "& .MuiFormHelperText-root": { color: "#ef4444" } }}
                />
            </Stack>

            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={() => validPass && editPassword(stored.email, newPassword)} disabled={!validPass || pwLoad} sx={saveBtnSx}>
                    Update Password
                </Button>
            </Box>
        </Box>
    );
}

function AccessTab() {
    const { shifts, loading, error } = useGetMyShifts(shiftUseCase);

    const fmt = iso => iso ? new Date(iso).toLocaleString("en-GB") : "—";

    return (
        <Box>
            <Typography sx={{ color: "#fff", fontWeight: 600, mb: 2 }}>
                Authorized Access
            </Typography>

            {loading ? (
                <CircularProgress sx={{ color: "#2563eb" }} />
            ) : (
                <TableContainer sx={{ bgcolor: "#0f1523", borderRadius: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: "#6b7280" }}>ID</TableCell>
                                <TableCell sx={{ color: "#6b7280" }}>Start</TableCell>
                                <TableCell sx={{ color: "#6b7280" }}>End</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shifts.map(s => (
                                <TableRow key={s.assignId}>
                                    <TableCell sx={{ color: "#e2e8f0" }}>{s.shiftId?.slice(0, 6)}</TableCell>
                                    <TableCell sx={{ color: "#e2e8f0" }}>{fmt(s.startTime)}</TableCell>
                                    <TableCell sx={{ color: "#e2e8f0" }}>{fmt(s.endTime)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <Box sx={{ bgcolor: "#0f1523", minHeight: "100vh" }}>

            {/* capsule */}
            <Box sx={{ position: "fixed", top: 20, right: 30 }}>
                <Box sx={{
                    display: "flex",
                    gap: 1,
                    bgcolor: "#131d38",
                    borderRadius: 99,
                    px: 1,
                    py: 0.5,
                    border: "1px solid #2563eb33",
                }}>
                    {TABS.map(tab => {
                        const active = activeTab === tab.id;
                        return (
                            <Box
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 999,
                                    cursor: "pointer",
                                    fontSize: 12,
                                    bgcolor: active ? "#2563eb22" : "transparent",
                                    color: active ? "#60a5fa" : "#94a3b8",
                                }}
                            >
                                {tab.icon}
                                {tab.label}
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {/* LEFT ALIGNED CONTENT */}
            <Box sx={{
                ml: "90px",   // aligns next to sidebar
                pt: 10,
                maxWidth: 700
            }}>
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: 4 }}>
                    Settings
                </Typography>

                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "access" && <AccessTab />}
            </Box>

        </Box>
    );
}