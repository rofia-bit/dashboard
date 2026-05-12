import { Box, Typography, Chip, TableRow, TableCell } from "@mui/material";
import { useMemo, useState, useCallback } from "react";
import Header from "../components/headerPage.jsx";
import Search from "../components/searchBar.jsx";
import MyTable, { cellSx } from "../components/table.jsx";

import { LogRepositoryImpl } from "../../data/repositories/logs/LogRepositoryImpl.js";
import { LogUseCase } from "../../domain/usecases/logs/LogUseCase.js";
import { useGetLogs } from "../hooks/logs/useGetLogs.js";
import { useLogsWebSocket } from "../hooks/logs/useLogsWebSocket.js";

const logRepository = new LogRepositoryImpl();
const logUseCase = new LogUseCase(logRepository);

const COLUMNS = [
    { label: "Person" },
    { label: "Email" },
    { label: "Type" },
    { label: "Result" },
    { label: "Reason" },
    { label: "Scanned At" },
];

export default function Logs() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || "ADMIN";

    const { logs, setLogs, loading, error } = useGetLogs(logUseCase, role);

    const [search, setSearch] = useState("");
    const [filterResult, setFilterResult] = useState("ALL");

    const FILTER_OPTIONS = [
        { value: "ALLOWED", label: "Allowed" },
        { value: "DENIED", label: "Denied" },
    ];

    const handleLogReceived = useCallback((newLog) => {
        setLogs(prev => {
            const exists = prev.some(log => log.logId === newLog.logId);

            if (exists) return prev;

            return [newLog, ...prev];
        });
    }, [setLogs]);

    useLogsWebSocket({
        role,
        guardId: user.userId || user.id,
        onLogReceived: handleLogReceived,
    });

    const filtered = useMemo(() => {
        return logs.filter(log => {
            const resultMatch =
                filterResult === "ALL" || log.result?.toUpperCase() === filterResult;

            const q = search.toLowerCase();

            const searchMatch =
                !search ||
                log.personName?.toLowerCase().includes(q) ||
                log.personEmail?.toLowerCase().includes(q) ||
                log.targetType?.toLowerCase().includes(q) ||
                log.reason?.toLowerCase().includes(q);

            return resultMatch && searchMatch;
        });
    }, [logs, search, filterResult]);

    return (
        <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
            <Header title="Access Logs" subtitle={`${filtered.length} total logs`} />

            <Search
                search={search}
                onSearch={setSearch}
                searchPlaceholder="Search by person, email, type or reason…"
                filterValue={filterResult}
                onFilterChange={setFilterResult}
                filterAllLabel="All Results"
                filterOptions={FILTER_OPTIONS}
            />

            <MyTable
                loading={loading}
                error={error}
                columns={COLUMNS}
                empty={filtered.length === 0}                
                emptyMsg="No logs found."
            >
                {filtered.map(log => (
                    <TableRow key={log.logId}>
                        <TableCell sx={cellSx}>
                            <Typography sx={{ color: "#e2e8f0", fontSize: 13 }}>
                                {log.personName || "—"}
                            </Typography>
                        </TableCell>

                        <TableCell sx={cellSx}>
                            <Typography sx={{ color: "#a0a9c9", fontSize: 12 }}>
                                {log.personEmail || "—"}
                            </Typography>
                        </TableCell>

                        <TableCell sx={cellSx}>
                            <Typography sx={{ color: "#a0a9c9", fontSize: 12 }}>
                                {log.targetType || "—"}
                            </Typography>
                        </TableCell>

                        <TableCell sx={cellSx}>
                            <Chip
                                label={log.result || "—"}
                                size="small"
                                sx={{
                                    bgcolor: log.result === "ALLOWED" ? "#22c55e20" : "#ef444420",
                                    color: log.result === "ALLOWED" ? "#22c55e" : "#ef4444",
                                    fontWeight: 600,
                                }}
                            />
                        </TableCell>

                        <TableCell sx={cellSx}>
                            <Typography sx={{ color: "#a0a9c9", fontSize: 12 }}>
                                {log.reason || "—"}
                            </Typography>
                        </TableCell>

                        <TableCell sx={cellSx}>
                            <Typography sx={{ color: "#a0a9c9", fontSize: 12 }}>
                                {log.scannedAt ? new Date(log.scannedAt).toLocaleString() : "—"}
                            </Typography>
                        </TableCell>
                    </TableRow>
                ))}
            </MyTable>
        </Box>
    );
}