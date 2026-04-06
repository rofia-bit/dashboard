import { Box, Typography, TableRow, TableCell, Chip, Stack } from "@mui/material";
import { useState, useMemo } from "react";
import { LogRepositoryImpl } from "../../../data/repositories/logs/LogRepositoryImpl.js";
import { LogUseCase } from "../../../domain/usecases/logs/LogUseCase.js";
import { useGetLogs } from "../../hooks/logs/useGetLogs.js";
import Header    from "../../components/headerPage.jsx";
import Search    from "../../components/searchBar.jsx";
import MyTable, { cellSx } from "../../components/table.jsx";

const logRepository = new LogRepositoryImpl();
const logUseCase    = new LogUseCase(logRepository);

const ROLE_STYLE = {
    ADMIN:          { bg: "#2563eb20", color: "#2563eb",  label: "Admin" },
    RESIDENT:       { bg: "#06b6d420", color: "#06b6d4",  label: "Resident" },
    SECURITY_GUARD: { bg: "#8b5cf620", color: "#8b5cf6",  label: "Security Guard" },
    STAFF:          { bg: "#f59e0b20", color: "#f59e0b",  label: "Staff" },
};

const COLUMNS = [
    { label: "Person" },
    { label: "Role" },
    { label: "State" },
    { label: "Time" },
];

const FILTER_OPTIONS = Object.entries(ROLE_STYLE).map(([value, s]) => ({ value, label: s.label }));

function AccessLogs() {
    const { logs, loading, error } = useGetLogs(logUseCase);
    const [search, setSearch]       = useState("");
    const [filterRole, setFilterRole] = useState("ALL");

    const filtered = useMemo(() => logs.filter(l => {
        const roleMatch = filterRole === "ALL" || l.userRole?.toUpperCase() === filterRole;
        const searchMatch = !search ||
            l.personFullName?.toLowerCase().includes(search.toLowerCase()) ||
            l.logState?.toLowerCase().includes(search.toLowerCase());
        return roleMatch && searchMatch;
    }), [logs, search, filterRole]);

    return (
        <Box display="flex" flexDirection="column" flex={1}>
            <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
                <Header
                    title="Access Logs"
                    subtitle={`${logs.length} total log${logs.length !== 1 ? "s" : ""}`}
                />

                <Search
                    search={search}           onSearch={setSearch}
                    searchPlaceholder="Search by name or state…"
                    filterValue={filterRole}  onFilterChange={setFilterRole}
                    filterAllLabel="All Roles"
                    filterOptions={FILTER_OPTIONS}
                />

                <MyTable
                    loading={loading} error={error}
                    columns={COLUMNS}
                    empty={filtered.length === 0}
                    emptyMsg="No access logs found."
                >
                    {filtered.map((log, i) => {
                        const role = ROLE_STYLE[log.userRole?.toUpperCase()] ?? { bg: "#2a3a6a", color: "#a0a9c9", label: log.userRole };
                        return (
                            <TableRow key={i}
                                sx={{ "&:hover": { bgcolor: "#1f2e55" }, transition: "background 0.15s" }}>

                                <TableCell sx={cellSx}>
                                    <Typography sx={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>
                                        {log.personFullName || "—"}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={cellSx}>
                                    <Chip label={role.label} size="small" sx={{
                                        bgcolor: role.bg, color: role.color, fontWeight: 600,
                                        fontSize: 11, height: 24, border: `1px solid ${role.color}40`,
                                    }} />
                                </TableCell>

                                <TableCell sx={cellSx}>
                                    <Typography sx={{ fontSize: 13, color: "#a0a9c9" }}>
                                        {log.logState || "—"}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={cellSx}>
                                    <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                                        {log.logTime
                                            ? new Date(log.logTime).toLocaleString("en-GB", {
                                                day: "2-digit", month: "short", year: "numeric",
                                                hour: "2-digit", minute: "2-digit"
                                            })
                                            : "—"}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </MyTable>
            </Box>
        </Box>
    );
}

export default AccessLogs;