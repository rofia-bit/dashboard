import {
    Box, Typography, Chip, Stack,
    MenuItem, Select, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TableRow, TableCell
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState, useMemo } from "react";

import { IncidentRepositoryImpl } from "../../data/repositories/incidents/IncidentRepositoryImpl.js";
import { IncidentUseCase } from "../../domain/usecases/incidents/IncidentUseCase.js";
import { useGetAllIncidents } from "../hooks/incidents/useGetAllIncidents.js";
import { useUpdateIncidentStatus } from "../hooks/incidents/useUpdateIncidentStatus.js";
import { useDeleteIncident } from "../hooks/incidents/useDeleteIncident.js";

import Header    from "../components/headerPage.jsx";
import Search from "../components/searchBar.jsx";
import MyTable, { cellSx } from "../components/table.jsx";
import ConfirmDialog from "../components/dialog.jsx";

const incidentRepository = new IncidentRepositoryImpl();
const incidentUseCase    = new IncidentUseCase(incidentRepository);

const STATUSES = [
    "PENDING",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "CANCELED",
];

const STATUS_STYLE = {
    PENDING: {
        bg: "#ef444420",
        color: "#ef4444",
        label: "Pending",
    },

    ASSIGNED: {
        bg: "#3b82f620",
        color: "#3b82f6",
        label: "Assigned",
    },

    IN_PROGRESS: {
        bg: "#f59e0b20",
        color: "#f59e0b",
        label: "In Progress",
    },

    RESOLVED: {
        bg: "#22c55e20",
        color: "#22c55e",
        label: "Resolved",
    },

    CANCELED: {
        bg: "#6b728020",
        color: "#6b7280",
        label: "Canceled",
    },
};

const COLUMNS = [
    { label: "ID" },
    { label: "Description" },
    { label: "Category" },
    { label: "Reported At" },
    { label: "Status" },
    { label: "Actions", align: "right" },
];

const FILTER_OPTIONS = STATUSES.map(s => ({ value: s, label: STATUS_STYLE[s].label }));

function DetailDialog({ incident, onClose }) {
    if (!incident) return null;
    const fields = [
        { label: "ID",          value: incident.incidentId },
        { label: "Category",    value: incident.categoryName },
        { label: "Status",      value: incident.status },
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
                    {fields.map(f => {
                        const style = STATUS_STYLE[f.value?.toUpperCase()];
                        return (
                            <Box key={f.label}>
                                <Typography sx={{ color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, mb: 0.3 }}>
                                    {f.label}
                                </Typography>
                                {style ? (
                                    <Chip label={style.label} size="small" sx={{
                                        bgcolor: style.bg, color: style.color, fontWeight: 600,
                                        fontSize: 11, height: 24, border: `1px solid ${style.color}40`,
                                    }} />
                                ) : (
                                    <Typography sx={{ color: "#e2e8f0", fontSize: 13, wordBreak: "break-all" }}>
                                        {f.value || "—"}
                                    </Typography>
                                )}
                            </Box>
                        );
                    })}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ color: "#a0a9c9", textTransform: "none" }}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function Incidents() {
    const { incidents, loading, error, refetch } = useGetAllIncidents(incidentUseCase);
    const { updateStatus, loading: statusLoading } = useUpdateIncidentStatus(incidentUseCase);
    const { deleteIncident, loading: deleteLoading } = useDeleteIncident(incidentUseCase);

    const [search, setSearch]               = useState("");
    const [filterStatus, setFilterStatus]   = useState("ALL");
    const [detailTarget, setDetailTarget]   = useState(null);
    const [deleteTarget, setDeleteTarget]   = useState(null);

    const handleStatusChange = async (incidentId, newStatus) => {
        const result = await updateStatus(incidentId, newStatus);

        if (result) {
            await refetch(); // refresh list after success
        }
    };

    const handleDelete = async () => {
        const ok = await deleteIncident(deleteTarget.incidentId);
        if (ok) { setDeleteTarget(null); refetch(); }
    };

    const filtered = useMemo(() => incidents.filter(i => {
        const statusMatch = filterStatus === "ALL" || i.status?.toUpperCase() === filterStatus;
        const searchMatch = !search ||
            i.incidentDescription?.toLowerCase().includes(search.toLowerCase()) ||
            i.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
            i.incidentId?.toLowerCase().includes(search.toLowerCase());
        return statusMatch && searchMatch;
    }), [incidents, search, filterStatus]);

    return (
        <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
            <Header
                title="Incidents"
                subtitle={`${incidents.length} total incident${incidents.length !== 1 ? "s" : ""}`}
            />

            <Search
                search={search}            onSearch={setSearch}
                searchPlaceholder="Search by description, category or ID…"
                filterValue={filterStatus} onFilterChange={setFilterStatus}
                filterAllLabel="All Statuses"
                filterOptions={FILTER_OPTIONS}
            />

            <MyTable
                loading={loading} error={error}
                columns={COLUMNS}
                empty={filtered.length === 0}
                emptyMsg="No incidents found."
            >
                {filtered.map(incident => {
                    const currentStatus =
                        (incident.status ?? "PENDING").toUpperCase();
                    const style = STATUS_STYLE[currentStatus] ?? STATUS_STYLE.PENDING;
                    return (
                        <TableRow key={incident.incidentId}
                            sx={{ "&:hover": { bgcolor: "#1f2e55" }, transition: "background 0.15s" }}>

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
                                    value={currentStatus}
                                    onChange={e => handleStatusChange(incident.incidentId, e.target.value)}
                                    disabled={statusLoading}
                                    size="small"
                                    sx={{
                                        fontSize: 12, fontWeight: 600, minWidth: 130,
                                        color: style.color ?? "#a0a9c9",
                                        bgcolor: style.bg ?? "#2a3a6a",
                                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                        "& .MuiSvgIcon-root": { color: style.color ?? "#a0a9c9" },
                                    }}
                                    MenuProps={{ PaperProps: { sx: { bgcolor: "#1a2444", color: "#fff" } } }}
                                >
                                    {STATUSES.map(s => (
                                        <MenuItem key={s} value={s} sx={{ fontSize: 12 }}>
                                            {STATUS_STYLE[s]?.label ?? s}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </TableCell>

                            <TableCell sx={cellSx} align="right">
                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                    <Tooltip title="View details">
                                        <IconButton size="small" onClick={() => setDetailTarget(incident)}
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
                })}
            </MyTable>

            <DetailDialog incident={detailTarget} onClose={() => setDetailTarget(null)} />
            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Incident"
                message="Are you sure you want to permanently delete this incident? This action cannot be undone."
                loading={deleteLoading}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </Box>
    );
}