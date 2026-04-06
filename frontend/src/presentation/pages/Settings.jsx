/* eslint-disable no-unused-vars */
import {
    Box, Typography, Stack, TextField, Button,
    Avatar, Divider, Chip, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    List, ListItem, ListItemText, ListItemIcon,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useState, useEffect } from "react";
 
import { UserRepositoryImpl } from "../../data/repositories/users/UserRepositoryImpl.js";
import { UserUseCase } from "../../domain/usecases/users/UserUseCase.js";
import { ShiftRepositoryImpl } from "../../data/repositories/shifts/ShiftRepositoryImpl.js";
import { ShiftUseCase } from "../../domain/usecases/shifts/ShiftUseCase.js";
import { useUpdateProfile } from "../hooks/users/profile/useUpdateProfile.js";
import { useEditPassword } from "../hooks/users/password/useEditPassword.js";
import { useGetMyShifts } from "../hooks/shifts/useGetMyShifts.js";

const userRepository  = new UserRepositoryImpl();
const userUseCase     = new UserUseCase(userRepository);
const shiftRepository = new ShiftRepositoryImpl();
const shiftUseCase    = new ShiftUseCase(shiftRepository);


const sectionCard = {
    bgcolor: "#1a2444", borderRadius: 2,
    border: "1px solid #2a3a6a", p: 3, mb: 3,
};
 
const inputSx = {
    "& .MuiOutlinedInput-root": {
        bgcolor: "#0f1523", color: "#fff", fontSize: 14,
        "& fieldset": { borderColor: "#2a3a6a" },
        "&:hover fieldset": { borderColor: "#4b5563" },
        "&.Mui-focused fieldset": { borderColor: "#2563eb" },
    },
    "& .MuiInputLabel-root": { color: "#6b7280" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
};
 
const saveBtnSx = {
    bgcolor: "#2563eb", color: "#fff", textTransform: "none",
    fontWeight: 600, fontSize: 13, borderRadius: 1, px: 3,
    "&:hover": { bgcolor: "#1d4ed8" },
    "&.Mui-disabled": { bgcolor: "#2a3a6a", color: "#6b7280" },
};
 
const cellSx     = { color: "#e2e8f0", fontSize: 13, borderColor: "#2a3a6a", py: 1.5 };
const headCellSx = { color: "#6b7280", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, borderColor: "#2a3a6a", bgcolor: "#131d38" };



const TABS = [
    { id: "profile",       label: "Profile & Security", icon: <ShieldOutlinedIcon fontSize="small" /> },
    { id: "access",        label: "Authorized Access",  icon: <AccessTimeIcon fontSize="small" /> },
];


function SectionHeader({ icon, title, subtitle }) {
    return (
        <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
            <Box sx={{ color: "#2563eb" }}>{icon}</Box>
            <Box>
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{title}</Typography>
                {subtitle && <Typography sx={{ color: "#6b7280", fontSize: 12 }}>{subtitle}</Typography>}
            </Box>
        </Stack>
    );
}


function Feedback({ error, success, successMsg = "Saved successfully" }) {
    if (!error && !success) return null;
    return (
        <Alert
            severity={error ? "error" : "success"}
            icon={error ? undefined : <CheckCircleOutlineIcon fontSize="small" />}
            sx={{
                mb: 2, fontSize: 13,
                bgcolor: error ? "#ef444415" : "#22c55e15",
                color: error ? "#ef4444" : "#22c55e",
                border: `1px solid ${error ? "#ef444430" : "#22c55e30"}`,
                "& .MuiAlert-icon": { color: error ? "#ef4444" : "#22c55e" },
            }}
        >
            {error || successMsg}
        </Alert>
    );
}


function ProfileTab() {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    const [fullname, setFullname] = useState(stored.fullname || "");
    const [email, setEmail]       = useState(stored.email || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirm] = useState("");

    const { updateProfile, loading: profileLoading, error: profileError, success: profileSuccess } = useUpdateProfile(userUseCase);
    const { editPassword,  loading: passLoading,    error: passError,    success: passSuccess }    = useEditPassword(userUseCase);

    const dirty    = fullname !== stored.fullname || email !== stored.email;
    const mismatch = confirmPassword && newPassword !== confirmPassword;
    const validPass = newPassword.length >= 6 && !mismatch;

    const handleSaveProfile = () => updateProfile(fullname, email);
    const handleSavePass = async () => {
        if (!validPass) return;
        await editPassword(stored.email, newPassword);
        setNewPassword(""); setConfirm("");
    };

    return (
        <Box>

            <Box sx={sectionCard}>
                <SectionHeader icon={<PersonOutlineIcon />} title="Profile Information" subtitle="Update your name and email address" />
                <Stack direction="row" spacing={3} alignItems="center" mb={3}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: "#2563eb", fontSize: 24, fontWeight: 700 }}>
                        {fullname?.charAt(0)?.toUpperCase() || "A"}
                    </Avatar>
                    <Box>
                        <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{fullname || "—"}</Typography>
                        <Chip label={stored.role || "ADMIN"} size="small" sx={{
                            bgcolor: "#2563eb20", color: "#2563eb", fontWeight: 600,
                            fontSize: 11, height: 22, border: "1px solid #2563eb40", mt: 0.5,
                        }} />
                    </Box>
                </Stack>
                <Feedback error={profileError} success={profileSuccess} successMsg="Profile updated successfully" />
                <Stack spacing={2.5} mb={4}>
                    <TextField label="Full Name" value={fullname} onChange={e => setFullname(e.target.value)} fullWidth sx={inputSx} />
                    <TextField label="Email Address" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={inputSx} />
                    <Box display="flex" justifyContent="flex-end">
                        <Button onClick={handleSaveProfile} disabled={!dirty || profileLoading} sx={saveBtnSx}>
                            {profileLoading ? "Saving…" : "Save Changes"}
                        </Button>
                    </Box>
                </Stack>

                <Divider sx={{ borderColor: "#2a3a6a", my: 3 }} />

                <SectionHeader icon={<LockOutlinedIcon />} title="Change Password" subtitle="Choose a strong password of at least 6 characters" />
                <Feedback error={passError} success={passSuccess} successMsg="Password changed successfully" />
                <Stack spacing={2.5}>
                    <TextField label="New Password" type="password" value={newPassword}
                        onChange={e => setNewPassword(e.target.value)} fullWidth sx={inputSx} />
                    <TextField label="Confirm Password" type="password" value={confirmPassword}
                        onChange={e => setConfirm(e.target.value)}
                        error={!!mismatch} helperText={mismatch ? "Passwords do not match" : ""}
                        fullWidth sx={{ ...inputSx, "& .MuiFormHelperText-root": { color: "#ef4444" } }} />
                    <Box display="flex" justifyContent="flex-end">
                        <Button onClick={handleSavePass} disabled={!validPass || passLoading} sx={saveBtnSx}>
                            {passLoading ? "Updating…" : "Update Password"}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}


function AccessTab() {
    const { shifts, loading, error } = useGetMyShifts(shiftUseCase);

    const fmt     = iso => iso ? new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
    const fmtDate = iso => iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
        <Box sx={sectionCard}>
            <SectionHeader icon={<AccessTimeIcon />} title="Authorized Access" subtitle="Your assigned shifts and access windows" />
            {error && <Typography sx={{ color: "#ef4444", fontSize: 13, mb: 2 }}>{error}</Typography>}
            {loading ? (
                <Box display="flex" justifyContent="center" py={4}><CircularProgress sx={{ color: "#2563eb" }} size={28} /></Box>
            ) : shifts.length === 0 ? (
                <Box sx={{ bgcolor: "#0f1523", borderRadius: 1.5, p: 3, textAlign: "center" }}>
                    <Typography sx={{ color: "#6b7280", fontSize: 13 }}>No assigned shifts found.</Typography>
                </Box>
            ) : (
                <TableContainer sx={{ bgcolor: "#0f1523", borderRadius: 1.5, border: "1px solid #2a3a6a" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={headCellSx}>Shift ID</TableCell>
                                <TableCell sx={headCellSx}>Date</TableCell>
                                <TableCell sx={headCellSx}>Start</TableCell>
                                <TableCell sx={headCellSx}>End</TableCell>
                                <TableCell sx={headCellSx} align="center">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shifts.map(shift => {
                                const now = new Date();
                                const isActive = now >= new Date(shift.startTime) && now <= new Date(shift.endTime);
                                const isPast   = now > new Date(shift.endTime);
                                const status   = isActive ? "Active" : isPast ? "Ended" : "Upcoming";
                                const color    = { Active: "#22c55e", Ended: "#6b7280", Upcoming: "#2563eb" }[status];
                                return (
                                    <TableRow key={shift.assignId} sx={{ "&:hover": { bgcolor: "#1a2444" } }}>
                                        <TableCell sx={cellSx}>
                                            <Typography sx={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>
                                                {shift.shiftId?.slice(0, 8)}…
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={cellSx}>{fmtDate(shift.onDate)}</TableCell>
                                        <TableCell sx={cellSx}>{fmt(shift.startTime)}</TableCell>
                                        <TableCell sx={cellSx}>{fmt(shift.endTime)}</TableCell>
                                        <TableCell sx={cellSx} align="center">
                                            <Chip label={status} size="small" sx={{
                                                bgcolor: `${color}20`, color, fontWeight: 600,
                                                fontSize: 11, height: 22, border: `1px solid ${color}40`,
                                            }} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}


export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setShowSidebar(true));
    }, []);

    const renderContent = () => {
        if (activeTab === "profile") return <ProfileTab />;
        if (activeTab === "access")  return <AccessTab />;
    };

    return (
        <Box sx={{ display: "flex", bgcolor: "#0f1523", minHeight: "100vh" }}>

            {/* sidebar two */}
            <Box sx={{
                width: 220, flexShrink: 0,
                bgcolor: "#081028",
                borderRight: "1px solid #1f2a5a",
                px: 2, py: 3,
                position: "fixed",
                top: 0,
                left: "200px",
                height: "100vh",
                overflowY: "auto",
                zIndex: 11,
                transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
                opacity: showSidebar ? 1 : 0,
                transition: "transform 0.35s ease, opacity 0.35s ease",
            }}>
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 16, mb: 0.5 }}>Settings</Typography>
                <Typography sx={{ color: "#6b7280", fontSize: 12, mb: 3 }}>Manage your account</Typography>

                <Typography sx={{
                    fontSize: 10, fontWeight: 700, color: "#6b7280",
                    textTransform: "uppercase", letterSpacing: 0.8, mb: 1.5, px: 1,
                }}>
                    Preferences
                </Typography>

                <List sx={{ px: 0 }}>
                    {TABS.map(tab => {
                        const active = activeTab === tab.id;
                        return (
                            <ListItem
                                button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                sx={{
                                    mb: 0.5, borderRadius: 1.5, py: 1.2, px: 1.5,
                                    bgcolor: active ? "#2563eb20" : "transparent",
                                    border: active ? "1px solid #2563eb40" : "1px solid transparent",
                                    "&:hover": { bgcolor: active ? "#2563eb20" : "#1c264c" },
                                    cursor: "pointer",
                                }}
                            >
                                <ListItemIcon sx={{ color: active ? "#2563eb" : "#6b7280", minWidth: 32 }}>
                                    {tab.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={tab.label}
                                    sx={{ "& .MuiListItemText-primary": {
                                        color: active ? "#2563eb" : "#a0a9c9",
                                        fontSize: 13, fontWeight: active ? 600 : 400,
                                    }}}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </Box>



            <Box sx={{ flex: 1, p: 4, overflowY: "auto", ml: "220px", minHeight: "100vh" }}>
                <Box sx={{ maxWidth: "100%" }}>
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
}