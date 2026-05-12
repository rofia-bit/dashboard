import {
    Box, Typography, Stack, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Chip, Grid, Select, MenuItem,
    CircularProgress, Alert,
} from "@mui/material";
import DeleteOutlineIcon     from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon      from "@mui/icons-material/EditOutlined";
import AddIcon               from "@mui/icons-material/Add";
import PeopleOutlineIcon     from "@mui/icons-material/PeopleOutline";
import LinkIcon              from "@mui/icons-material/Link";
import BusinessIcon          from "@mui/icons-material/Business";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SearchIcon            from "@mui/icons-material/Search";
import InputAdornment        from "@mui/material/InputAdornment";
import { useState, useMemo } from "react";

import { FacilityRepositoryImpl }  from "../../data/repositories/facilities/FacilityRepositoryImpl.js";
import { FacilityUseCase }         from "../../domain/usecases/facilities/FacilityUseCase.js";
import { useGetAllFacilities }     from "../hooks/facilities/useGetAllFacilities.js";
import { useCreateFacility }       from "../hooks/facilities/useCreateFacility.js";
import { useDeleteFacility }       from "../hooks/facilities/useDeleteFacility.js";
import { useUpdateFacility, useUpdateFacilityStatus } from "../hooks/facilities/useUpdateFacility.js";

import Header        from "../components/headerPage.jsx";
import ConfirmDialog from "../components/dialog.jsx";

const facilityRepository = new FacilityRepositoryImpl();
const facilityUseCase    = new FacilityUseCase(facilityRepository);

const STATUSES = [
    "AVAILABLE",
    "RESERVED",
    "OUT_OF_SERVICE",
];

const STATUS_STYLE = {

    AVAILABLE: {
        bg: "#22c55e20",
        color: "#22c55e",
        label: "Available",
        dot: "#22c55e",
    },

    RESERVED: {
        bg: "#f59e0b20",
        color: "#f59e0b",
        label: "Reserved",
        dot: "#f59e0b",
    },

    OUT_OF_SERVICE: {
        bg: "#ef444420",
        color: "#ef4444",
        label: "Out Of Service",
        dot: "#ef4444",
    },
};

const FILTER_OPTIONS = [
    { value: "ALL", label: "All Statuses" },
    ...STATUSES.map(s => ({ value: s, label: STATUS_STYLE[s]?.label ?? s })),
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

const EMPTY_FORM = {
    name: "",
    capacity: "",
    facilityStatus: "AVAILABLE",
    image: null,
};

function FacilityFormDialog({ open, onClose, onSubmit, loading, initial }) {
    const [form, setForm] = useState(initial ?? EMPTY_FORM);
    const isEdit = !!initial;
    const set = k => e =>
        setForm(prev => ({
            ...prev,
            [k]: e.target.value,
        }));

    const setImage = e => {
        const file = e.target.files?.[0] ?? null;

        setForm(prev => ({
            ...prev,
            image: file,
        }));
    };
    const valid = form.name && form.capacity;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { bgcolor: "#1a2444", border: "1px solid #2a3a6a", borderRadius: 2 } }}>
            <DialogTitle sx={{ color: "#fff", fontWeight: 700, fontSize: 16, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <BusinessIcon sx={{ fontSize: 18, color: "#2563eb" }} />
                {isEdit ? "Edit Facility" : "Create Facility"}
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: "#2a3a6a" }}>
                <Stack spacing={2.5} mt={0.5}>
                    <TextField label="Facility Name" value={form.name} onChange={set("name")} fullWidth sx={inputSx} />
                    <TextField
                        label="Capacity" type="number" value={form.capacity} onChange={set("capacity")}
                        inputProps={{ min: 1 }} fullWidth sx={inputSx}
                    />
                    <Box>
                        <Typography sx={{ color: "#6b7280", fontSize: 12, mb: 1 }}>
                            Facility Image
                        </Typography>

                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{
                                borderColor: "#2a3a6a",
                                color: "#e2e8f0",
                                textTransform: "none",
                                justifyContent: "flex-start",
                                py: 1.2,
                                "&:hover": {
                                    borderColor: "#2563eb",
                                    bgcolor: "#2563eb10",
                                },
                            }}
                        >
                            Upload Image

                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={setImage}
                            />
                        </Button>

                        {form.image && (
                            <Typography sx={{ color: "#22c55e", fontSize: 12, mt: 1 }}>
                                Selected: {form.image.name}
                            </Typography>
                        )}
                    </Box>
                    <Box>
                        <Typography sx={{ color: "#6b7280", fontSize: 12, mb: 0.8 }}>Status</Typography>
                        <Select
                            value={form.facilityStatus}
                            onChange={set("facilityStatus")}
                            fullWidth size="small"
                            sx={{
                                bgcolor: "#0f1a35", color: "#e2e8f0", fontSize: 13,
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a3a6a" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3a4a8a" },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                                "& .MuiSvgIcon-root": { color: "#6b7280" },
                            }}
                            MenuProps={{ PaperProps: { sx: { bgcolor: "#1a2444", color: "#fff" } } }}
                        >
                            {STATUSES.map(s => (
                                <MenuItem key={s} value={s} sx={{ fontSize: 13 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <FiberManualRecordIcon sx={{ fontSize: 8, color: STATUS_STYLE[s]?.dot }} />
                                        <span>{STATUS_STYLE[s]?.label ?? s}</span>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button onClick={onClose} sx={{ color: "#a0a9c9", textTransform: "none" }}>Cancel</Button>
                <Button
                    onClick={() =>
                        onSubmit({
                            name: form.name,
                            capacity: Number(form.capacity),
                            facilityStatus: form.facilityStatus,
                            image: form.image,
                        })
                    }
                    disabled={!valid || loading}
                    variant="contained"
                    sx={{
                        bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" },
                        textTransform: "none", fontWeight: 600, fontSize: 13,
                    }}
                >
                    {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Facility"}
                </Button>
            </DialogActions>
        </Dialog>
        
    );
}

function FacilityCard({ facility, onEdit, onDelete, onStatusChange, statusLoading }) {
    const status = facility.facilityStatus?.toUpperCase() ?? "AVAILABLE";
    const style  = STATUS_STYLE[status] ?? STATUS_STYLE.AVAILABLE;

    const API_BASE = "http://localhost:8081";
    const imageSrc = facility.imageUrl
        ? `${API_BASE}${facility.imageUrl}`
        : null;


    return (
        <Box sx={{
            bgcolor: "#111827",
            border: "1px solid #1e2d4e",
            borderRadius: "16px",
            overflow: "hidden",
            transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
            "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                borderColor: "#2a3a6a",
            },
        }}>
            {/* Image / placeholder */}
            <Box sx={{
                height: 140,
                bgcolor: "#0d1526",
                position: "relative",
                overflow: "hidden",
                backgroundImage: imageSrc ? `url("${imageSrc}")` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
                {!facility.imageUrl && (
                    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BusinessIcon sx={{ fontSize: 44, color: "#1e2d4e" }} />
                    </Box>
                )}
                {/* Gradient overlay */}
                <Box sx={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, #111827cc 0%, transparent 60%)",
                }} />
                {/* Status badge top-right */}
                <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                    <Select
                        value={status}
                        onChange={e => onStatusChange(facility.facilityId, e.target.value)}
                        disabled={statusLoading}
                        size="small"
                        sx={{
                            fontSize: 11, fontWeight: 700,
                            color: style.color,
                            bgcolor: style.bg,
                            backdropFilter: "blur(4px)",
                            border: `1px solid ${style.color}40`,
                            borderRadius: "8px",
                            minWidth: 110,
                            height: 28,
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                            "& .MuiSvgIcon-root": { color: style.color, fontSize: 14 },
                            "& .MuiSelect-select": { py: 0, px: 1 },
                        }}
                        MenuProps={{ PaperProps: { sx: { bgcolor: "#1a2444", color: "#fff" } } }}
                        renderValue={v => (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <FiberManualRecordIcon sx={{ fontSize: 7, color: style.dot }} />
                                <span>{STATUS_STYLE[v]?.label ?? v}</span>
                            </Stack>
                        )}
                    >
                        {STATUSES.map(s => (
                            <MenuItem key={s} value={s} sx={{ fontSize: 12 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <FiberManualRecordIcon sx={{ fontSize: 8, color: STATUS_STYLE[s]?.dot }} />
                                    <span>{STATUS_STYLE[s]?.label}</span>
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ p: 2 }}>
                <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15, mb: 0.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {facility.name || "Unnamed Facility"}
                </Typography>
                <Typography sx={{ color: "#6b7280", fontSize: 11, fontFamily: "monospace", mb: 1.5 }}>
                    {facility.facilityId?.slice(0, 16)}…
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <PeopleOutlineIcon sx={{ fontSize: 14, color: "#2563eb" }} />
                    <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                        Capacity: <Box component="span" sx={{ color: "#e2e8f0", fontWeight: 600 }}>{facility.capacity ?? "—"}</Box>
                    </Typography>
                </Stack>

                <Box sx={{ height: "1px", bgcolor: "#1e2d4e", mb: 1.5 }} />

                <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                    <Tooltip title="Edit facility">
                        <IconButton size="small" onClick={() => onEdit(facility)}
                            sx={{ color: "#6b7280", "&:hover": { color: "#f59e0b", bgcolor: "#f59e0b15" } }}>
                            <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete facility">
                        <IconButton size="small" onClick={() => onDelete(facility)}
                            sx={{ color: "#6b7280", "&:hover": { color: "#ef4444", bgcolor: "#ef444415" } }}>
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
        </Box>
    );
}

export default function Facilities() {
    const { facilities, loading, error, refetch } = useGetAllFacilities(facilityUseCase);
    const { createFacility, loading: createLoading } = useCreateFacility(facilityUseCase);
    const { updateFacility, loading: updateLoading } = useUpdateFacility(facilityUseCase);
    const { updateFacilityStatus, loading: statusLoading } = useUpdateFacilityStatus(facilityUseCase);
    const { deleteFacility, loading: deleteLoading } = useDeleteFacility(facilityUseCase);

    const [search, setSearch]           = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [createOpen, setCreateOpen]   = useState(false);
    const [editTarget, setEditTarget]   = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [localStatuses, setLocalStatuses] = useState({});

    const handleCreate = async (data) => {
        const ok = await createFacility(data);
        if (ok) { setCreateOpen(false); refetch(); }
    };

    const handleEdit = async (data) => {
        const ok = await updateFacility(editTarget.facilityId, data);
        if (ok) { setEditTarget(null); refetch(); }
    };

    const handleStatusChange = async (facilityId, newStatus) => {
        setLocalStatuses(prev => ({ ...prev, [facilityId]: newStatus }));
        const ok = await updateFacilityStatus(facilityId, newStatus);
        if (!ok) setLocalStatuses(prev => { const c = { ...prev }; delete c[facilityId]; return c; });
    };

    const handleDelete = async () => {
        const ok = await deleteFacility(deleteTarget.facilityId);
        if (ok) { setDeleteTarget(null); refetch(); }
    };

    const filtered = useMemo(() => facilities
        .map(f => ({ ...f, facilityStatus: localStatuses[f.facilityId] ?? f.facilityStatus }))
        .filter(f => {
            const statusMatch = filterStatus === "ALL" || f.facilityStatus?.toUpperCase() === filterStatus;
            const searchMatch = !search || f.name?.toLowerCase().includes(search.toLowerCase());
            return statusMatch && searchMatch;
        }), [facilities, search, filterStatus, localStatuses]);

    // Stats bar
    const stats = useMemo(() => STATUSES.map(s => ({
        ...STATUS_STYLE[s],
        key: s,
        count: facilities.filter(f => (localStatuses[f.facilityId] ?? f.facilityStatus)?.toUpperCase() === s).length,
    })), [facilities, localStatuses]);

    return (
        <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
            {/* Header row */}
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
                <Header
                    title="Facilities"
                    subtitle={`${facilities.length} total facilit${facilities.length !== 1 ? "ies" : "y"}`}
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
                    New Facility
                </Button>
            </Box>

            {/* Stats row */}
            <Grid container spacing={1.5} mb={3}>
                {stats.map(s => (
                    <Grid item xs={6} sm={3} key={s.key}>
                        <Box sx={{
                            bgcolor: "#111827", border: "1px solid #1e2d4e",
                            borderRadius: "12px", p: 1.5,
                            cursor: "pointer",
                            outline: filterStatus === s.key ? `1px solid ${s.color}50` : "none",
                            transition: "all 0.15s",
                            "&:hover": { borderColor: "#2a3a6a" },
                        }} onClick={() => setFilterStatus(prev => prev === s.key ? "ALL" : s.key)}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <FiberManualRecordIcon sx={{ fontSize: 8, color: s.dot }} />
                                <Typography sx={{ color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.7 }}>
                                    {s.label}
                                </Typography>
                            </Stack>
                            <Typography sx={{ color: s.color, fontWeight: 700, fontSize: 22, mt: 0.5, lineHeight: 1 }}>
                                {s.count}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Search bar */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    placeholder="Search facilities…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                    sx={{ flex: 1, ...inputSx }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#6b7280" }} /></InputAdornment>
                    }}
                />
                <Select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    size="small"
                    sx={{
                        minWidth: 150, bgcolor: "#0f1a35", color: "#e2e8f0", fontSize: 13,
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a3a6a" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3a4a8a" },
                        "& .MuiSvgIcon-root": { color: "#6b7280" },
                    }}
                    MenuProps={{ PaperProps: { sx: { bgcolor: "#1a2444", color: "#fff" } } }}
                >
                    {FILTER_OPTIONS.map(o => <MenuItem key={o.value} value={o.value} sx={{ fontSize: 13 }}>{o.label}</MenuItem>)}
                </Select>
            </Box>

            {/* Content */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress size={32} sx={{ color: "#2563eb" }} />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ bgcolor: "#2a0e0e", color: "#ef4444", border: "1px solid #ef444430", mb: 3 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && filtered.length === 0 && (
                <Box sx={{ textAlign: "center", py: 10 }}>
                    <BusinessIcon sx={{ fontSize: 48, color: "#1e2d4e", mb: 2 }} />
                    <Typography sx={{ color: "#6b7280", fontSize: 14 }}>No facilities found.</Typography>
                </Box>
            )}

            {!loading && filtered.length > 0 && (
                <Grid container spacing={2.5}>
                    {filtered.map(facility => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={facility.facilityId}>
                            <FacilityCard
                                facility={facility}
                                onEdit={setEditTarget}
                                onDelete={setDeleteTarget}
                                onStatusChange={handleStatusChange}
                                statusLoading={statusLoading}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <FacilityFormDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
                loading={createLoading}
            />

            {editTarget && (
                <FacilityFormDialog
                    open
                    onClose={() => setEditTarget(null)}
                    onSubmit={handleEdit}
                    loading={updateLoading}
                    initial={{
                        name: editTarget.name ?? "",
                        capacity: editTarget.capacity ?? "",
                        image: null,
                        facilityStatus: editTarget.facilityStatus ?? "AVAILABLE",
                    }}
                />
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Facility"
                message="Are you sure you want to permanently delete this facility? This action cannot be undone."
                loading={deleteLoading}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </Box>
    );
}