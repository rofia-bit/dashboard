import {
    Box, Typography, Chip, Stack, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, TableRow, TableCell, Avatar,
} from "@mui/material";
import DeleteOutlineIcon    from "@mui/icons-material/DeleteOutline";
import ReplyOutlinedIcon    from "@mui/icons-material/ReplyOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState, useMemo } from "react";

import { ReportRepositoryImpl }  from "../../data/repositories/reports/ReportRepositoryImpl.js";
import { ReportUseCase }         from "../../domain/usecases/reports/ReportUseCase.js";
import { useGetAllReports }      from "../hooks/reports/useGetAllReports.js";
import { usePatchReport }        from "../hooks/reports/usePatchReport.js";
import { useDeleteReport }       from "../hooks/reports/useDeleteReport.js";

import Header        from "../components/headerPage.jsx";
import Search        from "../components/searchBar.jsx";
import MyTable, { cellSx } from "../components/table.jsx";
import ConfirmDialog from "../components/dialog.jsx";

const reportRepository = new ReportRepositoryImpl();
const reportUseCase    = new ReportUseCase(reportRepository);

// ── Detail + Reply Dialog ──────────────────────────────────────────────────────
function ReportDetailDialog({ report, onClose, onReply, replyLoading }) {
    const [adminResponse, setAdminResponse] = useState("");
    const [replySent,     setReplySent]     = useState(false);

    if (!report) return null;

    const handleReply = async () => {
        if (!adminResponse.trim()) return;
        const ok = await onReply(report.reportId, adminResponse.trim());
        if (ok) { setReplySent(true); setAdminResponse(""); }
    };

    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { bgcolor: "#1a2444", border: "1px solid #2a3a6a", borderRadius: 2 } }}>
            <DialogTitle sx={{ color: "#fff", fontWeight: 700, fontSize: 16, pb: 1 }}>
                Report Details
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: "#2a3a6a" }}>
                <Stack spacing={2.5}>
                    {/* ID */}
                    <Box>
                        <Typography sx={labelSx}>Report ID</Typography>
                        <Typography sx={{ color: "#6b7280", fontSize: 12, fontFamily: "monospace" }}>
                            {report.reportId}
                        </Typography>
                    </Box>

                    {/* Content */}
                    <Box>
                        <Typography sx={labelSx}>Content</Typography>
                        <Typography sx={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7 }}>
                            {report.content || "—"}
                        </Typography>
                    </Box>

                    {/* Image */}
                    {report.imageUrl && (
                        <Box>
                            <Typography sx={labelSx}>Attached Image</Typography>
                            <Box
                                component="img"
                                src={report.imageUrl}
                                alt="report attachment"
                                sx={{ mt: 0.5, maxWidth: "100%", borderRadius: 1.5, border: "1px solid #2a3a6a" }}
                            />
                        </Box>
                    )}

                    {/* Sent At */}
                    <Box>
                        <Typography sx={labelSx}>Sent At</Typography>
                        <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>
                            {report.sentAt ? new Date(report.sentAt).toLocaleString() : "—"}
                        </Typography>
                    </Box>

                    {/* Existing admin response */}
                    {report.adminResponse && (
                        <Box sx={{ bgcolor: "#0f1523", borderRadius: 1.5, p: 1.5, border: "1px solid #2a3a6a" }}>
                            <Typography sx={{ ...labelSx, mb: 0.5 }}>Admin Response</Typography>
                            <Typography sx={{ color: "#22c55e", fontSize: 13, lineHeight: 1.6 }}>
                                {report.adminResponse}
                            </Typography>
                            {report.repliedAt && (
                                <Typography sx={{ color: "#6b7280", fontSize: 11, mt: 0.5 }}>
                                    Replied {new Date(report.repliedAt).toLocaleString()}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Reply textarea */}
                    {replySent ? (
                        <Box sx={{ bgcolor: "#22c55e18", border: "1px solid #22c55e40", borderRadius: 1.5, p: 1.5 }}>
                            <Typography sx={{ color: "#22c55e", fontSize: 13 }}>
                                ✓ Response sent successfully.
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Typography sx={labelSx}>
                                {report.adminResponse ? "Update Response" : "Write a Response"}
                            </Typography>
                            <TextField
                                multiline minRows={3}
                                fullWidth
                                placeholder="Type your admin response…"
                                value={adminResponse}
                                onChange={e => setAdminResponse(e.target.value)}
                                sx={{
                                    mt: 0.5,
                                    "& .MuiOutlinedInput-root": {
                                        color: "#e2e8f0", fontSize: 13,
                                        bgcolor: "#0f1523",
                                        "& fieldset": { borderColor: "#2a3a6a" },
                                        "&:hover fieldset": { borderColor: "#2563eb60" },
                                        "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button onClick={onClose} sx={{ color: "#a0a9c9", textTransform: "none" }}>
                    Close
                </Button>
                {!replySent && (
                    <Button
                        onClick={handleReply}
                        disabled={!adminResponse.trim() || replyLoading}
                        variant="contained"
                        startIcon={<ReplyOutlinedIcon />}
                        sx={{
                            textTransform: "none", bgcolor: "#2563eb", fontSize: 13,
                            "&:hover": { bgcolor: "#1d4ed8" },
                            "&.Mui-disabled": { bgcolor: "#2a3a6a", color: "#6b7280" },
                        }}
                    >
                        {replyLoading ? "Sending…" : "Send Response"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

const labelSx = { color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, mb: 0.3 };

// ── Columns ────────────────────────────────────────────────────────────────────
const COLUMNS = [
    { label: "ID" },
    { label: "Content" },
    { label: "Sent At" },
    { label: "Replied" },
    { label: "Actions", align: "right" },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Reports() {
    const { reports, loading, error, refetch }        = useGetAllReports(reportUseCase);
    const { patchReport, loading: replyLoading }      = usePatchReport(reportUseCase);
    const { deleteReport, loading: deleteLoading }    = useDeleteReport(reportUseCase);

    const [search,       setSearch]       = useState("");
    const [detailTarget, setDetailTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleReply = async (reportId, adminResponse) => {
        const result = await patchReport(reportId, adminResponse);
        if (result) refetch();
        return !!result;
    };

    const handleDelete = async () => {
        const ok = await deleteReport(deleteTarget.reportId);
        if (ok) { setDeleteTarget(null); refetch(); }
    };

    const filtered = useMemo(() => reports.filter(r => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            r.content?.toLowerCase().includes(q) ||
            r.reportId?.toLowerCase().includes(q)
        );
    }), [reports, search]);

    return (
        <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
            <Header
                title="Reports"
                subtitle={`${reports.length} total report${reports.length !== 1 ? "s" : ""}`}
            />

            <Search
                search={search}         onSearch={setSearch}
                searchPlaceholder="Search by content or ID…"
                filterValue="ALL"       onFilterChange={() => {}}
                filterAllLabel="All Reports"
                filterOptions={[]}
            />

            <MyTable
                loading={loading} error={error}
                columns={COLUMNS}
                empty={filtered.length === 0}
                emptyMsg="No reports found."
            >
                {filtered.map(report => (
                    <TableRow key={report.reportId}
                        sx={{ "&:hover": { bgcolor: "#1f2e55" }, transition: "background 0.15s" }}>

                        {/* ID */}
                        <TableCell sx={cellSx}>
                            <Typography sx={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>
                                {report.reportId?.slice(0, 8)}…
                            </Typography>
                        </TableCell>

                        {/* Content */}
                        <TableCell sx={{ ...cellSx, maxWidth: 300 }}>
                            <Typography sx={{
                                fontSize: 13, color: "#e2e8f0",
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                                {report.content || "—"}
                            </Typography>
                        </TableCell>

                        {/* Sent At */}
                        <TableCell sx={cellSx}>
                            <Typography sx={{ fontSize: 12, color: "#a0a9c9" }}>
                                {report.sentAt
                                    ? new Date(report.sentAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                    : "—"}
                            </Typography>
                        </TableCell>

                        {/* Replied badge */}
                        <TableCell sx={cellSx}>
                            {report.adminResponse ? (
                                <Chip label="Replied" size="small" sx={{
                                    bgcolor: "#22c55e20", color: "#22c55e", fontWeight: 600,
                                    fontSize: 11, height: 22, border: "1px solid #22c55e40",
                                }} />
                            ) : (
                                <Chip label="Pending" size="small" sx={{
                                    bgcolor: "#f59e0b20", color: "#f59e0b", fontWeight: 600,
                                    fontSize: 11, height: 22, border: "1px solid #f59e0b40",
                                }} />
                            )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell sx={cellSx} align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                <Tooltip title="View & Reply">
                                    <IconButton size="small" onClick={() => setDetailTarget(report)}
                                        sx={{ color: "#6b7280", "&:hover": { color: "#2563eb", bgcolor: "#2563eb15" } }}>
                                        <VisibilityOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete report">
                                    <IconButton size="small" onClick={() => setDeleteTarget(report)}
                                        sx={{ color: "#6b7280", "&:hover": { color: "#ef4444", bgcolor: "#ef444415" } }}>
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </MyTable>

            <ReportDetailDialog
                report={detailTarget}
                onClose={() => setDetailTarget(null)}
                onReply={handleReply}
                replyLoading={replyLoading}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Report"
                message="Are you sure you want to permanently delete this report? This action cannot be undone."
                loading={deleteLoading}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </Box>
    );
}