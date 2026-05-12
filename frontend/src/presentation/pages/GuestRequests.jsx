import {
    Box, Typography, Chip, Stack, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TableRow, TableCell, MenuItem, Select,
} from "@mui/material";
import DeleteOutlineIcon      from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PersonOutlineIcon      from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon      from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useState, useMemo } from "react";

import { GuestRequestRepositoryImpl }    from "../../data/repositories/guestRequests/GuestRequestRepositoryImpl.js";
import { GuestRequestUseCase }           from "../../domain/usecases/guestRequests/GuestRequestUseCase.js";
import { useGetAllGuestRequests }        from "../hooks/guestRequests/useGetAllGuestRequests.js";
import { useUpdateGuestRequestStatus }   from "../hooks/guestRequests/useUpdateGuestRequestStatus.js";
import { useDeleteGuestRequest }         from "../hooks/guestRequests/useDeleteGuestRequest.js";

import Header        from "../components/headerPage.jsx";
import Search        from "../components/searchBar.jsx";
import MyTable, { cellSx } from "../components/table.jsx";
import ConfirmDialog from "../components/dialog.jsx";

const guestRequestRepository = new GuestRequestRepositoryImpl();
const guestRequestUseCase    = new GuestRequestUseCase(guestRequestRepository);

// ── Status config ──────────────────────────────────────────────────────────────
const STATUSES = [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "CANCELED",
    "EXPIRED",
];

const STATUS_STYLE = {

    PENDING: {
        bg: "#f59e0b20",
        color: "#f59e0b",
        label: "Pending",
    },

    APPROVED: {
        bg: "#22c55e20",
        color: "#22c55e",
        label: "Approved",
    },

    REJECTED: {
        bg: "#ef444420",
        color: "#ef4444",
        label: "Rejected",
    },

    CANCELED: {
        bg: "#6b728020",
        color: "#6b7280",
        label: "Canceled",
    },

    EXPIRED: {
        bg: "#7c3aed20",
        color: "#7c3aed",
        label: "Expired",
    },
};
const FILTER_OPTIONS = STATUSES.map(s => ({ value: s, label: STATUS_STYLE[s].label }));

// ── Detail Dialog ──────────────────────────────────────────────────────────────
function GuestDetailDialog({ request, onClose }) {
    if (!request) return null;

    const fields = [
        { icon: <PersonOutlineIcon sx={{ fontSize: 15 }} />,  label: "Full Name",   value: request.guestFullName },
        { icon: <EmailOutlinedIcon sx={{ fontSize: 15 }} />,  label: "Email",       value: request.guestEmail },
        { icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 15 }} />, label: "Visit Date", value: request.guestDate ? new Date(request.guestDate).toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }) : "—" },
        { icon: <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} />, label: "Start Time", value: request.startTime ? new Date(request.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—" },
        { icon: <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} />, label: "End Time",   value: request.endTime   ? new Date(request.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—" },
    ];

    return (
        <Dialog open onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { bgcolor: "#1a2444", border: "1px solid #2a3a6a", borderRadius: 2 } }}>
            <DialogTitle sx={{ color: "#fff", fontWeight: 700, fontSize: 16, pb: 1 }}>
                Guest Request Details
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: "#2a3a6a" }}>
                <Stack spacing={2}>
                    {/* ID */}
                    <Box>
                        <Typography sx={labelSx}>Request ID</Typography>
                        <Typography sx={{ color: "#6b7280", fontSize: 11, fontFamily: "monospace" }}>
                            {request.requestId || request.userId}
                        </Typography>
                    </Box>

                    {fields.map(f => (
                        <Box key={f.label}>
                            <Typography sx={labelSx}>{f.label}</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.8}>
                                <Box sx={{ color: "#2563eb" }}>{f.icon}</Box>
                                <Typography sx={{ color: "#e2e8f0", fontSize: 13 }}>{f.value || "—"}</Typography>
                            </Stack>
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

const labelSx = { color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, mb: 0.3 };

// ── Columns ────────────────────────────────────────────────────────────────────
const COLUMNS = [
    { label: "Guest Name" },
    { label: "Email" },
    { label: "Visit Date" },
    { label: "Time Slot" },
    { label: "Status" },
    { label: "Actions", align: "right" },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function GuestRequests() {
    const { guestRequests, loading, error, refetch }          = useGetAllGuestRequests(guestRequestUseCase);
    const { updateStatus, loading: statusLoading }            = useUpdateGuestRequestStatus(guestRequestUseCase);
    const { deleteGuestRequest, loading: deleteLoading }      = useDeleteGuestRequest(guestRequestUseCase);

    const [search,        setSearch]        = useState("");
    const [filterStatus,  setFilterStatus]  = useState("ALL");
    const [detailTarget,  setDetailTarget]  = useState(null);
    const [deleteTarget,  setDeleteTarget]  = useState(null);
    const [localStatuses, setLocalStatuses] = useState({});

    const handleStatusChange = async (requestId, newStatus) => {
        setLocalStatuses(prev => ({ ...prev, [requestId]: newStatus }));
        const result = await updateStatus(requestId, newStatus);
        if (!result) {
            setLocalStatuses(prev => { const c = { ...prev }; delete c[requestId]; return c; });
        }
    };

    const handleDelete = async () => {
        const id = deleteTarget.requestId || deleteTarget.userId;
        const ok = await deleteGuestRequest(id);
        if (ok) { setDeleteTarget(null); refetch(); }
    };

    const filtered = useMemo(() => guestRequests.filter(r => {
        const id = r.requestId || r.userId || "";
        const statusMatch = filterStatus === "ALL" || (localStatuses[id] ?? r.status ?? "PENDING").toUpperCase() === filterStatus;
        const searchMatch = !search ||
            r.guestFullName?.toLowerCase().includes(search.toLowerCase()) ||
            r.guestEmail?.toLowerCase().includes(search.toLowerCase());
        return statusMatch && searchMatch;
    }), [guestRequests, search, filterStatus, localStatuses]);

    return (
        <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
            <Header
                title="Guest Requests"
                subtitle={`${guestRequests.length} total request${guestRequests.length !== 1 ? "s" : ""}`}
            />

            <Search
                search={search}             onSearch={setSearch}
                searchPlaceholder="Search by name or email…"
                filterValue={filterStatus}  onFilterChange={setFilterStatus}
                filterAllLabel="All Statuses"
                filterOptions={FILTER_OPTIONS}
            />

            <MyTable
                loading={loading} error={error}
                columns={COLUMNS}
                empty={filtered.length === 0}
                emptyMsg="No guest requests found."
            >
                {filtered.map(request => {
                    const id = request.requestId || request.userId || "";
                    const currentStatus = (localStatuses[id] ?? request.status ?? "PENDING").toUpperCase();
                    const style = STATUS_STYLE[currentStatus] ?? STATUS_STYLE.PENDING;

                    return (
                        <TableRow key={id}
                            sx={{ "&:hover": { bgcolor: "#1f2e55" }, transition: "background 0.15s" }}>

                            {/* Guest Name */}
                            <TableCell sx={cellSx}>
                                <Typography sx={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>
                                    {request.guestFullName || "—"}
                                </Typography>
                            </TableCell>

                            {/* Email */}
                            <TableCell sx={{ ...cellSx, maxWidth: 220 }}>
                                <Typography sx={{
                                    fontSize: 12, color: "#a0a9c9",
                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                }}>
                                    {request.guestEmail || "—"}
                                </Typography>
                            </TableCell>

                            {/* Visit Date */}
                            <TableCell sx={cellSx}>
                                <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                                    {request.guestDate
                                        ? new Date(request.guestDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                        : "—"}
                                </Typography>
                            </TableCell>

                            {/* Time Slot */}
                            <TableCell sx={cellSx}>
                                <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                                    {request.startTime && request.endTime
                                        ? `${new Date(request.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${new Date(request.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                                        : "—"}
                                </Typography>
                            </TableCell>

                            {/* Status dropdown */}
                            <TableCell sx={cellSx}>
                                <Select
                                    value={currentStatus}
                                    onChange={e => handleStatusChange(id, e.target.value)}
                                    disabled={statusLoading}
                                    size="small"
                                    sx={{
                                        fontSize: 12, fontWeight: 600, minWidth: 120,
                                        color: style.color,
                                        bgcolor: style.bg,
                                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                        "& .MuiSvgIcon-root": { color: style.color },
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

                            {/* Actions */}
                            <TableCell sx={cellSx} align="right">
                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                    <Tooltip title="View details">
                                        <IconButton size="small" onClick={() => setDetailTarget(request)}
                                            sx={{ color: "#6b7280", "&:hover": { color: "#2563eb", bgcolor: "#2563eb15" } }}>
                                            <VisibilityOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete request">
                                        <IconButton size="small" onClick={() => setDeleteTarget(request)}
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

            <GuestDetailDialog request={detailTarget} onClose={() => setDetailTarget(null)} />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Guest Request"
                message="Are you sure you want to permanently delete this guest request? This action cannot be undone."
                loading={deleteLoading}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </Box>
    );
}