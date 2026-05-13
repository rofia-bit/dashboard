import {
    Box, Typography, Stack, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TableRow, TableCell, TextField, Chip,
} from "@mui/material";
import DeleteOutlineIcon    from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon     from "@mui/icons-material/EditOutlined";
import AddIcon              from "@mui/icons-material/Add";
import AccessTimeIcon       from "@mui/icons-material/AccessTime";
import { useState, useMemo } from "react";

import { ShiftRepositoryImpl } from "../../data/repositories/shifts/ShiftRepositoryImpl.js";
import { ShiftUseCase }        from "../../domain/usecases/shifts/ShiftUseCase.js";
import { useGetAllShifts }     from "../hooks/shifts/useGetAllShifts.js";
import { useUpdateShift }      from "../hooks/shifts/useUpdateShift.js";
import { useDeleteShift }      from "../hooks/shifts/useDeleteShift.js";

import Header        from "../components/headerPage.jsx";
import Search        from "../components/searchBar.jsx";
import MyTable, { cellSx } from "../components/table.jsx";
import ConfirmDialog from "../components/dialog.jsx";
import MenuItem from "@mui/material/MenuItem";

import { UserRepositoryImpl } from "../../data/repositories/users/UserRepositoryImpl.js";
import { UserUseCase } from "../../domain/usecases/users/UserUseCase.js";
import { useGetSecurityGuards } from "../hooks/users/useGetSecurityGuards.js";

import { useCreateAndAssignShift } from "../hooks/shifts/useCreateAndAssignShift.js";

const userRepository = new UserRepositoryImpl();
const userUseCase = new UserUseCase(userRepository);
const shiftRepository = new ShiftRepositoryImpl();
const shiftUseCase    = new ShiftUseCase(shiftRepository);

const COLUMNS = [
    { label: "ID" },
    { label: "Date" },
    { label: "Start Time" },
    { label: "End Time" },
    { label: "Duration" },
    { label: "Created At" },
    { label: "Actions", align: "right" },
];

const inputSx = {
    "& .MuiOutlinedInput-root": {
        bgcolor: "#0f1a35",
        color: "#e2e8f0",
        fontSize: 13,
        "& fieldset": { borderColor: "#2a3a6a" },
        "&:hover fieldset": { borderColor: "#3a4a8a" },
        "&.Mui-focused fieldset": { borderColor: "#2563eb" },
    },
    "& .MuiInputLabel-root": { color: "#6b7280", fontSize: 13 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
};

function formatTime(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function calcDuration(start, end) {
    if (!start || !end) return "—";
    const diff = new Date(end) - new Date(start);
    if (diff <= 0) return "—";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function toLocalInput(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const EMPTY_FORM = {
    onDate: "",
    startTime: "",
    endTime: "",
    guardId: "",
};


function ShiftFormDialog({ open,
    onClose,
    onSubmit,
    loading,
    initial,
    guards, }) {
    const [form, setForm] = useState(initial ?? EMPTY_FORM);
    const isEdit = !!initial;

    const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

    const handleSubmit = () => {
        const payload = {
            onDate: form.onDate,
            startTime: form.startTime + ":00",
            endTime: form.endTime + ":00",
            guardId: form.guardId,
        };
        onSubmit(payload);
    };

    const valid =
        form.onDate &&
        form.startTime &&
        form.endTime &&
        (isEdit || form.guardId);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { bgcolor: "#1a2444", border: "1px solid #2a3a6a", borderRadius: 2 } }}>
            <DialogTitle sx={{ color: "#fff", fontWeight: 700, fontSize: 16, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: "#2563eb" }} />
                {isEdit ? "Edit Shift" : "Create New Shift"}
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: "#2a3a6a" }}>
                <Stack spacing={2.5} mt={0.5}>
                    <TextField
                        label="Shift Date"
                        type="date"
                        value={form.onDate ? form.onDate.slice(0, 10) : ""}
                        onChange={e => setForm(prev => ({ ...prev, onDate: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        fullWidth sx={inputSx}
                    />
                    <TextField
                        label="Start Time"
                        type="time"       
        

                        value={form.startTime}          
                        onChange={set("startTime")}
                        InputLabelProps={{ shrink: true }}
                        fullWidth sx={inputSx}
                    />
                    <TextField
                        label="End Time"
                        type="time"
                        value={form.endTime}          
                        onChange={set("endTime")}
                        InputLabelProps={{ shrink: true }}
                        fullWidth sx={inputSx}
                    />

                    {!isEdit && (
                        <TextField
                            select
                            label="Security Guard"
                            value={form.guardId}
                            onChange={set("guardId")}
                            fullWidth
                            sx={inputSx}
                        >
                            {guards?.map((guard) => (
                                <MenuItem
                                    key={guard.userId}
                                    value={guard.userId}
                                >
                                    {guard.fullname}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button onClick={onClose} sx={{ color: "#a0a9c9", textTransform: "none" }}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!valid || loading}
                    variant="contained"
                    sx={{
                        bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" },
                        textTransform: "none", fontWeight: 600, fontSize: 13,
                    }}
                >
                    {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Shift"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function DetailDialog({ shift, onClose }) {
    if (!shift) return null;
    const fields = [
        { label: "Shift ID",    value: shift.shiftId },
        { label: "Date",        value: formatDate(shift.onDate) },
        { label: "Start Time",  value: formatTime(shift.startTime) },
        { label: "End Time",    value: formatTime(shift.endTime) },
        { label: "Duration",    value: calcDuration(shift.startTime, shift.endTime) },
        { label: "Created At",  value: formatDate(shift.createdAt) },
    ];
    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { bgcolor: "#1a2444", border: "1px solid #2a3a6a", borderRadius: 2 } }}>
            <DialogTitle sx={{ color: "#fff", fontWeight: 700, fontSize: 16, pb: 1 }}>
                Shift Details
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: "#2a3a6a" }}>
                <Stack spacing={2}>
                    {fields.map(f => (
                        <Box key={f.label}>
                            <Typography sx={{ color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, mb: 0.3 }}>
                                {f.label}
                            </Typography>
                            <Typography sx={{ color: "#e2e8f0", fontSize: 13, fontFamily: f.label === "Shift ID" ? "monospace" : "inherit", wordBreak: "break-all" }}>
                                {f.value || "—"}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ color: "#a0a9c9", textTransform: "none" }}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function Shifts() {

    const { guards } = useGetSecurityGuards(userUseCase);

    const { shifts, loading, error, refetch } = useGetAllShifts(shiftUseCase);
    const {
        createAndAssignShift,
        loading: createLoading
    } = useCreateAndAssignShift(shiftUseCase);

    const { updateShift, loading: updateLoading } = useUpdateShift(shiftUseCase);
    const { deleteShift, loading: deleteLoading } = useDeleteShift(shiftUseCase);

    const [search, setSearch]           = useState("");
    const [detailTarget, setDetailTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [createOpen, setCreateOpen]   = useState(false);
    const [editTarget, setEditTarget]   = useState(null);

    const handleCreate = async (data) => {
        const ok = await createAndAssignShift(data);
        if (ok) { setCreateOpen(false); refetch(); }
    };

    const handleEdit = async (data) => {
        const ok = await updateShift(editTarget.shiftId, data);
        if (ok) { setEditTarget(null); refetch(); }
    };

    const handleDelete = async () => {
        const ok = await deleteShift(deleteTarget.shiftId);
        if (ok) { setDeleteTarget(null); refetch(); }
    };

    const filtered = useMemo(() => shifts.filter(s =>
        !search || s.shiftId?.toLowerCase().includes(search.toLowerCase()) ||
        formatDate(s.onDate).toLowerCase().includes(search.toLowerCase())
    ), [shifts, search]);

    return (
        <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
                <Header
                    title="Shifts"
                    subtitle={`${shifts.length} total shift${shifts.length !== 1 ? "s" : ""}`}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateOpen(true)}
                    sx={{
                        bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" },
                        textTransform: "none", fontWeight: 600, fontSize: 13,
                        borderRadius: "10px", px: 2.5, py: 1,
                    }}
                >
                    New Shift
                </Button>
            </Box>

            <Search
                search={search}        onSearch={setSearch}
                searchPlaceholder="Search by ID or date…"
                filterValue="ALL"      onFilterChange={() => {}}
                filterAllLabel="All Shifts"
                filterOptions={[]}
            />

            <MyTable
                loading={loading} error={error}
                columns={COLUMNS}
                empty={filtered.length === 0}
                emptyMsg="No shifts found."
            >
                {filtered.map(shift => (
                    <TableRow key={shift.shiftId}
                        sx={{ "&:hover": { bgcolor: "#1f2e55" }, transition: "background 0.15s" }}>

                        <TableCell sx={cellSx}>
                            <Typography sx={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>
                                {shift.shiftId?.slice(0, 8)}…
                            </Typography>
                        </TableCell>

                        <TableCell sx={cellSx}>
                            <Chip
                                label={formatDate(shift.onDate)}
                                size="small"
                                sx={{ bgcolor: "#2563eb18", color: "#2563eb", fontWeight: 600, fontSize: 11, height: 24, border: "1px solid #2563eb30" }}
                            />
                        </TableCell>

                        <TableCell sx={cellSx}>
                            <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                                {formatTime(shift.startTime)}
                            </Typography>
                        </TableCell>

                        <TableCell sx={cellSx}>
                            <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                                {formatTime(shift.endTime)}
                            </Typography>
                        </TableCell>

                        <TableCell sx={cellSx}>
                            <Typography sx={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
                                {calcDuration(shift.startTime, shift.endTime)}
                            </Typography>
                        </TableCell>

                        <TableCell sx={cellSx}>
                            <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                                {formatDate(shift.createdAt)}
                            </Typography>
                        </TableCell>

                        <TableCell sx={cellSx} align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                <Tooltip title="View details">
                                    <IconButton size="small" onClick={() => setDetailTarget(shift)}
                                        sx={{ color: "#6b7280", "&:hover": { color: "#2563eb", bgcolor: "#2563eb15" } }}>
                                        <VisibilityOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit shift">
                                    <IconButton size="small" onClick={() => setEditTarget(shift)}
                                        sx={{ color: "#6b7280", "&:hover": { color: "#f59e0b", bgcolor: "#f59e0b15" } }}>
                                        <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete shift">
                                    <IconButton size="small" onClick={() => setDeleteTarget(shift)}
                                        sx={{ color: "#6b7280", "&:hover": { color: "#ef4444", bgcolor: "#ef444415" } }}>
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </MyTable>

            <ShiftFormDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
                loading={createLoading}
                guards={guards}
            />

            {editTarget && (
                <ShiftFormDialog
                    open
                    onClose={() => setEditTarget(null)}
                    onSubmit={handleEdit}
                    loading={updateLoading}
                    guards={guards}
                    initial={{
                        onDate: editTarget.onDate?.slice(0, 10) ?? "",
                        startTime: editTarget.startTime ?? "",
                        endTime: editTarget.endTime ?? "",
                        guardId: editTarget.guardId ?? "",
                    }}
                />
            )}

            <DetailDialog shift={detailTarget} onClose={() => setDetailTarget(null)} />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Shift"
                message="Are you sure you want to permanently delete this shift? This action cannot be undone."
                loading={deleteLoading}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </Box>
    );
}