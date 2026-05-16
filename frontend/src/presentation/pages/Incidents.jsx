import {
    Box, Typography, Chip, Stack,
    MenuItem, Select, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TableRow, TableCell
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState, useMemo, useEffect } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { IncidentRepositoryImpl } from "../../data/repositories/incidents/IncidentRepositoryImpl.js";
import { IncidentUseCase } from "../../domain/usecases/incidents/IncidentUseCase.js";
import { useGetAllIncidents } from "../hooks/incidents/useGetAllIncidents.js";
import { useUpdateIncidentStatus } from "../hooks/incidents/useUpdateIncidentStatus.js";
import { useDeleteIncident } from "../hooks/incidents/useDeleteIncident.js";
import { useAssignIncidentToStaff } from "../hooks/incidents/useAssignIncidentToStaff.js";

import { UserRepositoryImpl } from "../../data/repositories/users/UserRepositoryImpl.js";
import { UserUseCase } from "../../domain/usecases/users/UserUseCase.js";
import { useGetUsers } from "../hooks/users/getAllUsers/useGetUsers.js";


import Header        from "../components/headerPage.jsx";
import Search        from "../components/searchBar.jsx";
import MyTable, { cellSx } from "../components/table.jsx";
import ConfirmDialog from "../components/dialog.jsx";

const incidentRepository = new IncidentRepositoryImpl();
const incidentUseCase    = new IncidentUseCase(incidentRepository);

const userRepository = new UserRepositoryImpl();
const userUseCase = new UserUseCase(userRepository);

const ACTIONABLE_STATUSES = ["PENDING"];

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

function AssignIncidentDialog({
    incident,
    staffUsers,
    selectedStaffId,
    setSelectedStaffId,
    loading,
    onClose,
    onConfirm
}) {
    if (!incident) return null;

    return (
        <Dialog
            open
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: "#1a2444",
                    border: "1px solid #2a3a6a",
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle sx={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
                Assign Incident
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: "#2a3a6a" }}>
                <Typography sx={{ color: "#a0a9c9", fontSize: 13, mb: 2 }}>
                    Select a staff member to handle this incident.
                </Typography>

                <Select
                    fullWidth
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    size="small"
                    displayEmpty
                    sx={{
                        color: "#fff",
                        bgcolor: "#0f1523",
                        fontSize: 13,
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#2a3a6a",
                        },
                        "& .MuiSvgIcon-root": {
                            color: "#fff",
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: { bgcolor: "#1a2444", color: "#fff" },
                        },
                    }}
                >
                    <MenuItem value="" disabled>
                        Select staff
                    </MenuItem>

                    {staffUsers.map((staff) => (
                        <MenuItem key={staff.userId} value={staff.userId}>
                            {staff.fullname} - {staff.email}
                        </MenuItem>
                    ))}
                </Select>

                {staffUsers.length === 0 && (
                    <Typography sx={{ color: "#ef4444", fontSize: 12, mt: 1 }}>
                        No active staff users found.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{ color: "#a0a9c9", textTransform: "none" }}
                >
                    Cancel
                </Button>

                <Button
                    onClick={onConfirm}
                    disabled={!selectedStaffId || loading}
                    variant="contained"
                    sx={{ textTransform: "none" }}
                >
                    {loading ? "Assigning..." : "Assign"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}


const FILTER_OPTIONS = ACTIONABLE_STATUSES.map(s => ({ value: s, label: STATUS_STYLE[s].label }));

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

    const { users, loading: usersLoading, getUsers } = useGetUsers(userUseCase);

    useEffect(() => {
        getUsers();
    }, []);

    
    

    const staffUsers = useMemo(() => {
        return (users || []).filter(user =>
            user.role === "STAFF" && user.isActive === true
        );
    }, [users]);

    const [search, setSearch]               = useState("");
    const [filterStatus, setFilterStatus]   = useState("ALL");
    const [detailTarget, setDetailTarget]   = useState(null);
    const [deleteTarget, setDeleteTarget]   = useState(null);

    const [assignTarget, setAssignTarget] = useState(null);
    const [selectedStaffId, setSelectedStaffId] = useState("");

    const { assignIncident, loading: assignLoading } =
        useAssignIncidentToStaff(incidentUseCase);
    

    const handleStatusChange = async (incidentId, newStatus) => {
        const result = await updateStatus(incidentId, newStatus);
        if (result) await refetch();
    };

    const handleDelete = async () => {
            const ok = await deleteIncident(deleteTarget.incidentId);
            if (ok) { setDeleteTarget(null); refetch(); }
    };

    const handleAssignIncident = async () => {
        if (!assignTarget || !selectedStaffId) return;

        const result = await assignIncident(
            assignTarget.incidentId,
            selectedStaffId
        );

        if (result) {
            setAssignTarget(null);
            setSelectedStaffId("");
            await refetch();
        }
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
                    const currentStatus = (incident.status ?? "PENDING").toUpperCase();
                    const style = STATUS_STYLE[currentStatus] ?? STATUS_STYLE.PENDING;


                    const isActionable = ACTIONABLE_STATUSES.includes(currentStatus);

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
                                {isActionable ? (
                                    <Select
                                        value={currentStatus}
                                        onChange={e => handleStatusChange(incident.incidentId, e.target.value)}
                                        disabled={statusLoading}
                                        size="small"
                                        sx={{
                                            fontSize: 12, fontWeight: 600, minWidth: 130,
                                            color: style.color,
                                            bgcolor: style.bg,
                                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                            "& .MuiSvgIcon-root": { color: style.color },
                                        }}
                                        MenuProps={{ PaperProps: { sx: { bgcolor: "#1a2444", color: "#fff" } } }}
                                    >
                                        {ACTIONABLE_STATUSES.map(s => (
                                            <MenuItem key={s} value={s} sx={{ fontSize: 12 }}>
                                                {STATUS_STYLE[s].label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                ) : (

                                    <Chip
                                        label={style.label}
                                        size="small"
                                        sx={{
                                            bgcolor: style.bg,
                                            color: style.color,
                                            fontWeight: 600,
                                            fontSize: 11,
                                            height: 24,
                                            border: `1px solid ${style.color}40`,
                                        }}
                                    />
                                )}
                            </TableCell>

                            <TableCell sx={cellSx} align="right">
                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                    {currentStatus === "PENDING" && (
                                        <Tooltip title="Assign to staff">
                                            <IconButton
                                                size="small"
                                                onClick={() => setAssignTarget(incident)}
                                                sx={{ color: "#6b7280", "&:hover": { color: "#3b82f6", bgcolor: "#3b82f615" } }}
                                            >
                                                <AssignmentIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}

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

            <AssignIncidentDialog
                incident={assignTarget}
                staffUsers={staffUsers}
                selectedStaffId={selectedStaffId}
                setSelectedStaffId={setSelectedStaffId}
                loading={assignLoading}
                onClose={() => {
                    setAssignTarget(null);
                    setSelectedStaffId("");
                }}
                onConfirm={handleAssignIncident}
            />
        </Box>
    );
}