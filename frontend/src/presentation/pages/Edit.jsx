import {
    Box, Typography, Chip, Stack, Avatar,
    MenuItem, Select, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, TableRow, TableCell
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useActivateUser } from "../hooks/users/activate/useActivateUser.js";
import { useState, useEffect, useMemo } from "react";

import { UserRepositoryImpl } from "../../data/repositories/users/UserRepositoryImpl.js";
import { UserUseCase } from "../../domain/usecases/users/UserUseCase.js";
import { useGetUsers } from "../hooks/users/getAllUsers/useGetUsers.js";
import { useRegisterUser } from "../hooks/users/register/useRegisterUser.js";
import { useDeleteUser } from "../hooks/users/delete/useDeleteUser.js";
import { useDeactivateUser } from "../hooks/users/deactivate/useDeactivateUser.js";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

import Header    from "../components/headerPage.jsx";
import Search from "../components/searchBar.jsx";
import MyTable, { cellSx } from "../components/table.jsx";
import ConfirmDialog from "../components/dialog.jsx";

const userRepository = new UserRepositoryImpl();
const userUseCase    = new UserUseCase(userRepository);

const ROLES = ["RESIDENT", "SECURITY_GUARD", "ADMIN", "STAFF"];

const ROLE_STYLE = {
    ADMIN:          { bg: "#2563eb20", color: "#2563eb", label: "Admin" },
    RESIDENT:       { bg: "#06b6d420", color: "#06b6d4", label: "Resident" },
    SECURITY_GUARD: { bg: "#8b5cf620", color: "#8b5cf6", label: "Security Guard" },
    STAFF:          { bg: "#f59e0b20", color: "#f59e0b", label: "Staff" },
};

const COLUMNS = [
    { label: "User" },
    { label: "Email" },
    { label: "Role" },
    { label: "Status" },
    { label: "Actions", align: "right" },
];

const FILTER_OPTIONS = ROLES.map(r => ({ value: r, label: ROLE_STYLE[r].label }));

const styledInput = {
    "& .MuiOutlinedInput-root": {
        bgcolor: "#1f2a5a", color: "#fff",
        borderBottom: "2px solid #2563eb", borderRadius: 0,
        "& fieldset": { border: "none" },
        "& input::placeholder": { color: "#6b7280", opacity: 1 },
    },
    "& .MuiInputLabel-root": { color: "#a0a9c9" },
};


function AddUserDialog({ open, onClose, onAdd, loading }) {
    const [form, setForm] = useState({ fullname: "", email: "", password: "", role: "RESIDENT" });
    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
    const valid = form.fullname && form.email && form.password;

    const handleSubmit = async () => {
        const ok = await onAdd(form);
        if (ok) { setForm({ fullname: "", email: "", password: "", role: "RESIDENT" }); onClose(); }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { bgcolor: "#1a2444", border: "1px solid #2a3a6a", borderRadius: 2 } }}>
            <DialogTitle sx={{ color: "#fff", fontWeight: 700, fontSize: 16, pb: 1 }}>Add User</DialogTitle>
            <DialogContent dividers sx={{ borderColor: "#2a3a6a" }}>
                <Stack spacing={2.5} mt={1}>
                    <TextField label="Full Name" placeholder="John Doe" value={form.fullname}
                        onChange={e => set("fullname", e.target.value)} fullWidth sx={styledInput} />
                    <TextField label="Email" placeholder="example@email.com" value={form.email}
                        onChange={e => set("email", e.target.value)} fullWidth sx={styledInput} />
                    <TextField label="Password" type="password" value={form.password}
                        onChange={e => set("password", e.target.value)} fullWidth sx={styledInput} />
                    <Select value={form.role} onChange={e => set("role", e.target.value)}
                        sx={{
                            bgcolor: "#1f2a5a", color: "#a0a9c9", fontSize: 13, borderRadius: 1,
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a3a6a" },
                            "& .MuiSvgIcon-root": { color: "#a0a9c9" },
                        }}
                        MenuProps={{ PaperProps: { sx: { bgcolor: "#1a2444", color: "#fff" } } }}>
                        {ROLES.map(r => <MenuItem key={r} value={r} sx={{ fontSize: 13 }}>{ROLE_STYLE[r].label}</MenuItem>)}
                    </Select>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ color: "#a0a9c9", textTransform: "none" }}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={!valid || loading} sx={{
                    bgcolor: "#2563eb", color: "#fff", textTransform: "none", fontWeight: 600,
                    "&:hover": { bgcolor: "#1d4ed8" },
                    "&.Mui-disabled": { bgcolor: "#2a3a6a", color: "#6b7280" },
                }}>
                    {loading ? "Adding..." : "Add User"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}


//page
function Users() {
    const { users, loading, error, getUsers }       = useGetUsers(userUseCase);
    const { registerUser, loading: registerLoading } = useRegisterUser(userUseCase);
    const { deleteUser,   loading: deleteLoading }  = useDeleteUser(userUseCase);
    const { deactivateUser, loading: deactivateLoading } = useDeactivateUser(userUseCase);

    const [search, setSearch]             = useState("");
    const [filterRole, setFilterRole]     = useState("ALL");
    const [addOpen, setAddOpen]           = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deactivateTarget, setDeactivateTarget] = useState(null);
    const { activateUser, loading: activateLoading } = useActivateUser(userUseCase);

    const [statusTarget, setStatusTarget] = useState(null);

    useEffect(() => { getUsers(); }, []);

    const handleAdd = async (form) => {
        const result = await registerUser(form.fullname, form.email, form.password, form.role);
        if (result) { await getUsers(); return true; }
        return false;
    };

    const handleDelete = async () => {
        const ok = await deleteUser(deleteTarget.userId);
        if (ok) { await getUsers(); setDeleteTarget(null); }
    };

    const handleToggleActive = async () => {
        if (!statusTarget) return;

        const ok = statusTarget.isActive
            ? await deactivateUser(statusTarget.userId)
            : await activateUser(statusTarget.userId);

        if (ok) {
            await getUsers();
            setStatusTarget(null);
        }
    };

    const filtered = useMemo(() => users.filter(u => {
        const roleMatch = filterRole === "ALL" || u.role?.toUpperCase() === filterRole;
        const searchMatch = !search ||
            u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.userId?.toLowerCase().includes(search.toLowerCase());
        return roleMatch && searchMatch;
    }), [users, search, filterRole]);
   
    return (
        <Box display="flex" flexDirection="column" flex={1}>
            <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
                <Header
                    title="Users"
                    subtitle={`${users.length} total user${users.length !== 1 ? "s" : ""}`}
                    actionLabel="Add User"
                    actionIcon={<AddIcon />}
                    onAction={() => setAddOpen(true)}
                />

                <Search
                    search={search}          onSearch={setSearch}
                    searchPlaceholder="Search by name, email or ID…"
                    filterValue={filterRole} onFilterChange={setFilterRole}
                    filterAllLabel="All Roles"
                    filterOptions={FILTER_OPTIONS}
                />


                <MyTable
                    loading={loading} error={error}
                    columns={COLUMNS}
                    empty={filtered.length === 0}
                    emptyMsg="No users found."
                >
                    {filtered.map(user => {
                        const role = ROLE_STYLE[user.role?.toUpperCase()] ?? { bg: "#2a3a6a", color: "#a0a9c9", label: user.role };
                        return (
                            <TableRow key={user.userId}
                                sx={{ "&:hover": { bgcolor: "#1f2e55" }, transition: "background 0.15s" }}>

                                <TableCell sx={cellSx}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Avatar
                                            src={user.imageUrl ? `http://localhost:8081${user.imageUrl}` : undefined}
                                            sx={{ width: 34, height: 34, fontSize: 13, bgcolor: "#2563eb" }}
                                        >
                                            {user.fullname?.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>
                                                {user.fullname}
                                            </Typography>
                                            <Typography sx={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>
                                                {user.userId?.slice(0, 8)}…
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>

                                <TableCell sx={cellSx}>
                                    <Typography sx={{ fontSize: 13, color: "#a0a9c9" }}>{user.email}</Typography>
                                </TableCell>

                                <TableCell sx={cellSx}>
                                    <Chip label={role.label} size="small" sx={{
                                        bgcolor: role.bg, color: role.color, fontWeight: 600,
                                        fontSize: 11, height: 24, border: `1px solid ${role.color}40`,
                                    }} />
                                </TableCell>

                                <TableCell sx={cellSx}>
                                    <Chip
                                        label={user.isActive ? "Active" : "Inactive"}
                                        size="small"
                                        sx={{
                                            bgcolor: user.isActive ? "#22c55e20" : "#ef444420",
                                            color: user.isActive ? "#22c55e" : "#ef4444",
                                            fontWeight: 600,
                                            fontSize: 11,
                                            height: 24,
                                            border: `1px solid ${user.isActive ? "#22c55e40" : "#ef444440"}`,
                                        }}
                                    />
                                </TableCell>

                                <TableCell sx={cellSx} align="right">
                                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                        <Tooltip title={user.isActive ? "Deactivate user" : "Activate user"}>
                                            <IconButton
                                                size="small"
                                                onClick={() => setStatusTarget(user)}
                                                sx={{
                                                    color: "#6b7280",
                                                    "&:hover": {
                                                        color: user.isActive ? "#f59e0b" : "#22c55e",
                                                        bgcolor: user.isActive ? "#f59e0b15" : "#22c55e15",
                                                    },
                                                }}
                                            >
                                                {user.isActive ? (
                                                    <BlockOutlinedIcon fontSize="small" />
                                                ) : (
                                                    <CheckCircleOutlineIcon fontSize="small" />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete user">
                                            <IconButton size="small" onClick={() => setDeleteTarget(user)}
                                                sx={{ color: "#6b7280", "&:hover": { color: "#ef4444", bgcolor: "#ef444415" } }}>
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </MyTable>
            </Box>

            <AddUserDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} loading={registerLoading} />
            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete User"
                message={`Are you sure you want to permanently delete ${deleteTarget?.fullname}? This action cannot be undone.`}
                loading={deleteLoading}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />

            <ConfirmDialog
                open={!!statusTarget}
                title={statusTarget?.isActive ? "Deactivate User" : "Activate User"}
                message={
                    statusTarget?.isActive
                        ? `Are you sure you want to deactivate ${statusTarget?.fullname}?`
                        : `Are you sure you want to activate ${statusTarget?.fullname}?`
                }
                loading={activateLoading || deactivateLoading}
                onClose={() => setStatusTarget(null)}
                onConfirm={handleToggleActive}
                confirmLabel={statusTarget?.isActive ? "Deactivate" : "Activate"}
            />
        </Box>
    );
}

export default Users;