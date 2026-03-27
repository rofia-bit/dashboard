import {
    Box, Typography, Stack, CircularProgress, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    MenuItem, Select, IconButton, Tooltip, TextField, InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState, useMemo } from "react";
import { IncidentRepositoryImpl } from "../../data/repositories/incidents/IncidentRepositoryImpl.js";
import { IncidentUseCase } from "../../domain/usecases/incidents/IncidentUseCase.js";
import { useGetAllIncidents } from "../hooks/incidents/useGetAllIncidents.js";
import { useUpdateIncidentStatus } from "../hooks/incidents/useUpdateIncidentStatus.js";
import { useDeleteIncident } from "../hooks/incidents/useDeleteIncident.js";

const incidentRepository = new IncidentRepositoryImpl();
const incidentUseCase = new IncidentUseCase(incidentRepository);

// status
const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const STATUS_STYLE = {
    OPEN:        { bg: "#ef444420", color: "#ef4444", label: "Open" },
    IN_PROGRESS: { bg: "#f59e0b20", color: "#f59e0b", label: "In Progress" },
    RESOLVED:    { bg: "#22c55e20", color: "#22c55e", label: "Resolved" },
    CLOSED:      { bg: "#6b728020", color: "#6b7280", label: "Closed" },
};

function StatusChip({ status }) {
    const s = STATUS_STYLE[status?.toUpperCase()] ?? { bg: "#2a3a6a", color: "#a0a9c9", label: status };
    return (
        <Chip
            label={s.label}
            size="small"
            sx={{
                bgcolor: s.bg,
                color: s.color,
                fontWeight: 600,
                fontSize: 11,
                height: 24,
                border: `1px solid ${s.color}40`,
            }}
        />
    );
}



function IncidentDetailDialog({ incident, onClose }) {
    if (!incident) return null;
    const rows = [
        { label: "ID", value: incident.incidentId },
        { label: "Category", value: incident.categoryName },
        { label: "Status", value: <StatusChip status={incident.status} /> },
        { label: "Reported At", value: incident.reportedAt ? new Date(incident.reportedAt).toLocaleString() : "—" },
        { label: "Description", value: incident.incidentDescription },
    ];
    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { bgcolor: "#1a2444", border: "1px solid #2a3a6a", borderRadius: 2 } }}>
            <DialogTitle sx={{ color: "#fff", fontWeight: 700, fontSize: 16, pb: 1 }}>
                Incident Details
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: "#2a3a6a" }}>
                <Stack spacing={2}>
                    {rows.map(r => (
                        <Box key={r.label}>
                            <Typography sx={{ color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, mb: 0.3 }}>
                                {r.label}
                            </Typography>
                            {typeof r.value === "string" ? (
                                <Typography sx={{ color: "#e2e8f0", fontSize: 13, wordBreak: "break-all" }}>{r.value}</Typography>
                            ) : r.value}
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




function ConfirmDeleteDialog({ incident, onClose, onConfirm, loading }) {
    if (!incident) return null;
    return (
        <Dialog open onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { bgcolor: "#1a2444", border: "1px solid #ef444440", borderRadius: 2 } }}>
            <DialogTitle sx={{ color: "#ef4444", fontWeight: 700, fontSize: 15 }}>Delete Incident</DialogTitle>
            <DialogContent>
                <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>
                    Are you sure you want to permanently delete this incident? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading} sx={{ color: "#a0a9c9", textTransform: "none" }}>Cancel</Button>
                <Button
                    onClick={onConfirm}
                    disabled={loading}
                    sx={{
                        bgcolor: "#ef4444",
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#dc2626" }
                    }}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}




export default function Incidents() {
    const { incidents, loading, error, refetch } = useGetAllIncidents(incidentUseCase);
    const { updateStatus, loading: statusLoading } = useUpdateIncidentStatus(incidentUseCase);
    const { deleteIncident, loading: deleteLoading } = useDeleteIncident(incidentUseCase);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [detailIncident, setDetailIncident] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);



    const [localStatuses, setLocalStatuses] = useState({});


    const handleStatusChange = async (incidentId, newStatus) => {
        setLocalStatuses(prev => ({ ...prev, [incidentId]: newStatus }));
        const result = await updateStatus(incidentId, newStatus);
        if (!result) {

            setLocalStatuses(prev => {
                const copy = { ...prev };
                delete copy[incidentId];
                return copy;
            });
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const ok = await deleteIncident(deleteTarget.incidentId);
        if (ok) {
            setDeleteTarget(null);
            refetch();
        }
    };

    const filtered = useMemo(() => {
        return incidents.filter(i => {
            const statusMatch = filterStatus === "ALL" || (i.status?.toUpperCase() === filterStatus);
            const searchMatch = search === "" ||
                i.incidentDescription?.toLowerCase().includes(search.toLowerCase()) ||
                i.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
                i.incidentId?.toLowerCase().includes(search.toLowerCase());
            return statusMatch && searchMatch;
        });
    }, [incidents, search, filterStatus]);

    const cellSx = { color: "#e2e8f0", fontSize: 13, borderColor: "#2a3a6a", py: 1.5 };
    const headCellSx = { color: "#6b7280", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, borderColor: "#2a3a6a", bgcolor: "#131d38" };

    return (
        <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
            {/* header */}
            <Box mb={3}>
                <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>Incidents</Typography>
                <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>
                    {incidents.length} total incident{incidents.length !== 1 ? "s" : ""}
                </Typography>
            </Box>

            {/* bar */}
            <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
                <TextField
                    placeholder="Search by description, category or ID…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                    sx={{
                        flex: 1,
                        minWidth: 220,
                        "& .MuiOutlinedInput-root": {
                            bgcolor: "#1a2444",
                            color: "#fff",
                            fontSize: 13,
                            "& fieldset": { borderColor: "#2a3a6a" },
                            "&:hover fieldset": { borderColor: "#4b5563" },
                            "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                        },
                        "& input::placeholder": { color: "#6b7280", opacity: 1 },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#6b7280", fontSize: 18 }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <Select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    size="small"
                    sx={{
                        minWidth: 150,
                        bgcolor: "#1a2444",
                        color: "#fff",
                        fontSize: 13,
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a3a6a" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4b5563" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                        "& .MuiSvgIcon-root": { color: "#6b7280" },
                    }}
                    MenuProps={{ PaperProps: { sx: { bgcolor: "#1a2444", color: "#fff" } } }}
                >
                    <MenuItem value="ALL">All Statuses</MenuItem>
                    {STATUSES.map(s => (
                        <MenuItem key={s} value={s}>{STATUS_STYLE[s]?.label ?? s}</MenuItem>
                    ))}
                </Select>
            </Stack>

            {/*  !! error edit later */}
            {error && (
                <Typography sx={{ color: "#ef4444", fontSize: 13, mb: 2 }}>{error}</Typography>
            )}



            {loading ? (
                <Box display="flex" justifyContent="center" pt={8}>
                    <CircularProgress sx={{ color: "#2563eb" }} />
                </Box>
            ) : (
                <TableContainer sx={{ bgcolor: "#1a2444", borderRadius: 2, border: "1px solid #2a3a6a" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={headCellSx}>ID</TableCell>
                                <TableCell sx={headCellSx}>Description</TableCell>
                                <TableCell sx={headCellSx}>Category</TableCell>
                                <TableCell sx={headCellSx}>Reported At</TableCell>
                                <TableCell sx={headCellSx}>Status</TableCell>
                                <TableCell sx={headCellSx} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ ...cellSx, textAlign: "center", color: "#6b7280", py: 6 }}>
                                        No incidents found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map(incident => {
                                    const currentStatus = localStatuses[incident.incidentId] ?? incident.status ?? "OPEN";
                                    return (
                                        <TableRow
                                            key={incident.incidentId}
                                            sx={{ "&:hover": { bgcolor: "#1f2e55" }, transition: "background 0.15s" }}
                                        >


                                            <TableCell sx={cellSx}>
                                                <Typography sx={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>
                                                    {incident.incidentId?.slice(0, 8)}…
                                                </Typography>
                                            </TableCell>


                                            <TableCell sx={{ ...cellSx, maxWidth: 260 }}>
                                                <Typography sx={{ fontSize: 13, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {incident.incidentDescription || "—"}
                                                </Typography>
                                            </TableCell>


                                            <TableCell sx={cellSx}>
                                                <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                                                    {incident.categoryName || "—"}
                                                </Typography>
                                            </TableCell>


                                            <TableCell sx={cellSx}>
                                                <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                                                    {incident.reportedAt
                                                        ? new Date(incident.reportedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                                        : "—"}
                                                </Typography>
                                            </TableCell>


                                            <TableCell sx={cellSx}>
                                                <Select
                                                    value={currentStatus.toUpperCase()}
                                                    onChange={e => handleStatusChange(incident.incidentId, e.target.value)}
                                                    disabled={statusLoading}
                                                    size="small"
                                                    sx={{
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        color: STATUS_STYLE[currentStatus.toUpperCase()]?.color ?? "#a0a9c9",
                                                        bgcolor: STATUS_STYLE[currentStatus.toUpperCase()]?.bg ?? "#2a3a6a",
                                                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                                        "& .MuiSvgIcon-root": { color: STATUS_STYLE[currentStatus.toUpperCase()]?.color ?? "#a0a9c9" },
                                                        minWidth: 130,
                                                    }}
                                                    MenuProps={{ PaperProps: { sx: { bgcolor: "#1a2444", color: "#fff" } } }}
                                                >
                                                    {STATUSES.map(s => (
                                                        <MenuItem key={s} value={s} sx={{ fontSize: 12 }}>
                                                            {STATUS_STYLE[s].label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>


                                            <TableCell sx={cellSx} align="right">
                                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                    <Tooltip title="View details">
                                                        <IconButton size="small" onClick={() => setDetailIncident(incident)}
                                                            sx={{ color: "#6b7280", "&:hover": { color: "#2563eb", bgcolor: "#2563eb15" } }}>
                                                            <VisibilityOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete incident">
                                                        <IconButton size="small" onClick={() => setDeleteTarget(incident)}
                                                            sx={{ color: "#6b7280", "&:hover": { color: "#ef4444", bgcolor: "#ef444415" } }}>
                                                            <DeleteOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}



            <IncidentDetailDialog incident={detailIncident} onClose={() => setDetailIncident(null)} />
            <ConfirmDeleteDialog
                incident={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />
        </Box>
    );
}