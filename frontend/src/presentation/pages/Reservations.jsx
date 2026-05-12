import {
    Box, Typography, Chip, Stack, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TableRow, TableCell, MenuItem, Select,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

import { useMemo, useState } from "react";

import Header from "../components/headerPage.jsx";
import Search from "../components/searchBar.jsx";
import MyTable, { cellSx } from "../components/table.jsx";
import ConfirmDialog from "../components/dialog.jsx";

import { ReservationRepositoryImpl } from "../../data/repositories/reservation/ReservationRepositoryImpl.js";
import { ReservationUseCase } from "../../domain/usecases/reservation/ReservationUseCase.js";
import { useGetAllReservations } from "../hooks/reservation/useGetAllReservations.js";
import { useUpdateReservationStatus } from "../hooks/reservation/useUpdateReservationStatus.js";
import { useDeleteReservation } from "../hooks/reservation/useDeleteReservation.js";

const reservationRepository = new ReservationRepositoryImpl();
const reservationUseCase = new ReservationUseCase(reservationRepository);


const ACTIONABLE_STATUSES = ["PENDING", "CONFIRMED"];

const STATUS_STYLE = {
    PENDING: {
        bg: "#f59e0b20",
        color: "#f59e0b",
        label: "Pending",
    },
    CONFIRMED: {
        bg: "#22c55e20",
        color: "#22c55e",
        label: "Confirmed",
    },
    CANCELED: {
        bg: "#ef444420",
        color: "#ef4444",
        label: "Canceled",
    },
    COMPLETED: {
        bg: "#3b82f620",
        color: "#3b82f6",
        label: "Completed",
    },
};

const ALL_STATUSES = ["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"];
const FILTER_OPTIONS = ALL_STATUSES.map(s => ({ value: s, label: STATUS_STYLE[s].label }));

const COLUMNS = [
    { label: "Reservation ID" },
    { label: "User ID" },
    { label: "Date" },
    { label: "Time Slot" },
    { label: "Guests" },
    { label: "Status" },
    { label: "Actions", align: "right" },
];

const labelSx = {
    color: "#6b7280",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    mb: 0.3,
};

function ReservationDetailDialog({ reservation, onClose }) {
    if (!reservation) return null;

    const fields = [
        {
            icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 15 }} />,
            label: "Reservation Date",
            value: reservation.reservationDate
                ? new Date(reservation.reservationDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })
                : "—",
        },
        {
            icon: <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} />,
            label: "Start Time",
            value: reservation.startTime
                ? new Date(reservation.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "—",
        },
        {
            icon: <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} />,
            label: "End Time",
            value: reservation.endTime
                ? new Date(reservation.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "—",
        },
        {
            icon: <PeopleOutlineIcon sx={{ fontSize: 15 }} />,
            label: "Number Of Guests",
            value: reservation.numberOfGuests ?? 0,
        },
    ];

    const status = reservation.status?.toUpperCase() ?? "PENDING";
    const style = STATUS_STYLE[status] ?? STATUS_STYLE.PENDING;

    return (
        <Dialog open onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { bgcolor: "#1a2444", border: "1px solid #2a3a6a", borderRadius: 2 } }}>
            <DialogTitle sx={{ color: "#fff", fontWeight: 700, fontSize: 16, pb: 1 }}>
                Reservation Details
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: "#2a3a6a" }}>
                <Stack spacing={2}>
                    <Box>
                        <Typography sx={labelSx}>Reservation ID</Typography>
                        <Typography sx={{ color: "#6b7280", fontSize: 11, fontFamily: "monospace" }}>
                            {reservation.reservationId}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography sx={labelSx}>User ID</Typography>
                        <Typography sx={{ color: "#6b7280", fontSize: 11, fontFamily: "monospace" }}>
                            {reservation.userId}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography sx={labelSx}>Status</Typography>
                        <Chip label={style.label} size="small" sx={{
                            bgcolor: style.bg, color: style.color, fontWeight: 600,
                            fontSize: 11, height: 24, border: `1px solid ${style.color}40`,
                        }} />
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

                    <Box>
                        <Typography sx={labelSx}>Created At</Typography>
                        <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>
                            {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : "—"}
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ color: "#a0a9c9", textTransform: "none" }}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function Reservations() {
    const { reservations, loading, error, refetch }     = useGetAllReservations(reservationUseCase);
    const { updateStatus, loading: statusLoading }      = useUpdateReservationStatus(reservationUseCase);
    const { deleteReservation, loading: deleteLoading } = useDeleteReservation(reservationUseCase);

    const [search,        setSearch]        = useState("");
    const [filterStatus,  setFilterStatus]  = useState("ALL");
    const [detailTarget,  setDetailTarget]  = useState(null);
    const [deleteTarget,  setDeleteTarget]  = useState(null);
    const [localStatuses, setLocalStatuses] = useState({});

    const handleStatusChange = async (reservationId, newStatus) => {
        setLocalStatuses(prev => ({ ...prev, [reservationId]: newStatus }));
        const result = await updateStatus(reservationId, newStatus);
        if (result) {
            await refetch();
        } else {
            setLocalStatuses(prev => {
                const copy = { ...prev };
                delete copy[reservationId];
                return copy;
            });
        }
    };

    const handleDelete = async () => {
        const ok = await deleteReservation(deleteTarget.reservationId, deleteTarget.userId);
        if (ok) { setDeleteTarget(null); await refetch(); }
    };

    const filtered = useMemo(() => reservations.filter(r => {
        const currentStatus = (localStatuses[r.reservationId] ?? r.status ?? "PENDING").toUpperCase();
        const statusMatch   = filterStatus === "ALL" || currentStatus === filterStatus;
        const q             = search.toLowerCase();
        const searchMatch   = !search ||
            r.reservationId?.toLowerCase().includes(q) ||
            r.userId?.toLowerCase().includes(q) ||
            r.status?.toLowerCase().includes(q);
        return statusMatch && searchMatch;
    }), [reservations, search, filterStatus, localStatuses]);

    return (
        <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
            <Header
                title="Reservations"
                subtitle={`${reservations.length} total reservation${reservations.length !== 1 ? "s" : ""}`}
            />

            <Search
                search={search}
                onSearch={setSearch}
                searchPlaceholder="Search by reservation ID, user ID or status…"
                filterValue={filterStatus}
                onFilterChange={setFilterStatus}
                filterAllLabel="All Statuses"
                filterOptions={FILTER_OPTIONS}
            />

            <MyTable
                loading={loading} error={error}
                columns={COLUMNS}
                empty={filtered.length === 0}
                emptyMsg="No reservations found."
            >
                {filtered.map(reservation => {
                    const currentStatus =
                        (localStatuses[reservation.reservationId] ?? reservation.status ?? "PENDING").toUpperCase();
                    const style = STATUS_STYLE[currentStatus] ?? STATUS_STYLE.PENDING;

                    const isActionable = ACTIONABLE_STATUSES.includes(currentStatus);

                    return (
                        <TableRow key={reservation.reservationId}
                            sx={{ "&:hover": { bgcolor: "#1f2e55" }, transition: "background 0.15s" }}>

                            <TableCell sx={cellSx}>
                                <Typography sx={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>
                                    {reservation.reservationId?.slice(0, 8)}…
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography sx={{ fontSize: 11, color: "#a0a9c9", fontFamily: "monospace" }}>
                                    {reservation.userId?.slice(0, 8)}…
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                                    {reservation.reservationDate
                                        ? new Date(reservation.reservationDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                        : "—"}
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                                    {reservation.startTime && reservation.endTime
                                        ? `${new Date(reservation.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${new Date(reservation.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                                        : "—"}
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography sx={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>
                                    {reservation.numberOfGuests ?? 0}
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                {isActionable ? (
                                    <Select
                                        value={currentStatus}
                                        onChange={e => handleStatusChange(reservation.reservationId, e.target.value)}
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
                                    <Tooltip title="View details">
                                        <IconButton size="small" onClick={() => setDetailTarget(reservation)}
                                            sx={{ color: "#6b7280", "&:hover": { color: "#2563eb", bgcolor: "#2563eb15" } }}>
                                            <VisibilityOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete reservation">
                                        <IconButton size="small" onClick={() => setDeleteTarget(reservation)}
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

            <ReservationDetailDialog reservation={detailTarget} onClose={() => setDetailTarget(null)} />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Reservation"
                message="Are you sure you want to permanently delete this reservation? This action cannot be undone."
                loading={deleteLoading}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </Box>
    );
}