/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import Navbar from "../../components/navbar.jsx";
import Card from "../../components/card.jsx";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    AreaChart, Area
} from "recharts";
import { useMemo } from "react";

import { LogRepositoryImpl } from "../../../data/repositories/logs/LogRepositoryImpl.js";
import { LogUseCase } from "../../../domain/usecases/logs/LogUseCase.js";
import { ShiftRepositoryImpl } from "../../../data/repositories/shifts/ShiftRepositoryImpl.js";
import { ShiftUseCase } from "../../../domain/usecases/shifts/ShiftUseCase.js";
import { useGetLogs } from "../../hooks/logs/useGetLogs.js";
import { useGetMyShifts } from "../../hooks/shifts/useGetMyShifts.js";
import { ChartCard, CustomTooltip, ChartSpinner, ChartEmpty, CHART_COLORS, ROLE_COLORS, SHIFT_STATUS_COLORS } from "../../components/chartCard.jsx";

const logRepository   = new LogRepositoryImpl();
const logUseCase      = new LogUseCase(logRepository);
const shiftRepository = new ShiftRepositoryImpl();
const shiftUseCase    = new ShiftUseCase(shiftRepository);

function GuardDashboard() {
    const { logs,   loading: logsLoading }   = useGetLogs(logUseCase);
    const { shifts, loading: shiftsLoading } = useGetMyShifts(shiftUseCase);

    const now          = new Date();
    const activeShifts = shifts.filter(s => now >= new Date(s.startTime) && now <= new Date(s.endTime)).length;
    const todayLogs    = logs.filter(l => l.logTime && new Date(l.logTime).toDateString() === now.toDateString()).length;

    const shiftStatusData = useMemo(() => {
        const active   = shifts.filter(s => now >= new Date(s.startTime) && now <= new Date(s.endTime)).length;
        const upcoming = shifts.filter(s => new Date(s.startTime) > now).length;
        const ended    = shifts.filter(s => new Date(s.endTime) < now).length;
        return [
            { name: "Active",   value: active },
            { name: "Upcoming", value: upcoming },
            { name: "Ended",    value: ended },
        ].filter(d => d.value > 0);
    }, [shifts, now]);

    const shiftsByDay = useMemo(() => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const counts = Object.fromEntries(days.map(d => [d, 0]));
        shifts.forEach(s => {
            const d = new Date(s.onDate || s.startTime);
            counts[days[(d.getDay() + 6) % 7]]++;
        });
        return days.map(day => ({ day, shifts: counts[day] }));
    }, [shifts]);

    const logsTimeline = useMemo(() => {
        const counts = {};
        logs.forEach(l => {
            if (!l.logTime) return;
            const day = new Date(l.logTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
            counts[day] = (counts[day] || 0) + 1;
        });
        return Object.entries(counts).map(([date, count]) => ({ date, count })).slice(-14);
    }, [logs]);

    const logsByRole = useMemo(() => {
        const counts = {};
        logs.forEach(l => { const r = l.userRole || "UNKNOWN"; counts[r] = (counts[r] || 0) + 1; });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [logs]);

    const axisColor = "var(--text-secondary)";
    const gridColor = "var(--chart-grid)";

    return (
        <Box sx={{
            bgcolor: "var(--bg-base)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            transition: "background-color 0.3s ease",
            width: "100%",
        }}>
            <Navbar />

            <Box sx={{ px: 3, pb: 4, flex: 1, display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>

                {/* Stat cards */}
                <Box display="flex" gap={2} flexWrap="wrap">
                    <Card title="Active Shifts" value={shiftsLoading ? "…" : activeShifts} type="active"   />
                    <Card title="Total Shifts"  value={shiftsLoading ? "…" : shifts.length}               />
                    <Card title="Logs Today"    value={logsLoading   ? "…" : todayLogs}     type="active"   />
                    <Card title="Total Logs"    value={logsLoading   ? "…" : logs.length}                  />
                </Box>

                {/* Row 1: pie (33%) | bar (67%) */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 3, width: "100%" }}>
                    <ChartCard title="My Shifts by Status" minH={260}>
                        {shiftsLoading ? <ChartSpinner /> : shiftStatusData.length === 0
                            ? <ChartEmpty message="No shift data" />
                            : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={shiftStatusData} cx="50%" cy="50%"
                                            innerRadius={65} outerRadius={105}
                                            paddingAngle={3} dataKey="value">
                                            {shiftStatusData.map(entry => (
                                                <Cell key={entry.name} fill={SHIFT_STATUS_COLORS[entry.name]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend formatter={v => <span style={{ color: axisColor, fontSize: 12 }}>{v}</span>} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                    </ChartCard>

                    <ChartCard title="Shifts per Day of Week" minH={260}>
                        {shiftsLoading ? <ChartSpinner /> : (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={shiftsByDay} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 12 }} />
                                    <YAxis tick={{ fill: axisColor, fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="shifts" name="Shifts" radius={[4, 4, 0, 0]}>
                                        {shiftsByDay.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </ChartCard>
                </Box>

                {/* Row 2: area (67%) | pie (33%) */}
                <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 3, width: "100%" }}>
                    <ChartCard title="Access Logs — Last 14 Days" minH={260}>
                        {logsLoading ? <ChartSpinner /> : logsTimeline.length === 0
                            ? <ChartEmpty message="No log data" />
                            : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <AreaChart data={logsTimeline} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="logGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                        <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 11 }} />
                                        <YAxis tick={{ fill: axisColor, fontSize: 11 }} allowDecimals={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="count" name="Logs"
                                            stroke="#2563eb" strokeWidth={2}
                                            fill="url(#logGrad)"
                                            dot={{ fill: "#2563eb", r: 3 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                    </ChartCard>

                    <ChartCard title="Logs by Role" minH={260}>
                        {logsLoading ? <ChartSpinner /> : logsByRole.length === 0
                            ? <ChartEmpty message="No log data" />
                            : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={logsByRole} cx="50%" cy="50%"
                                            outerRadius={95} dataKey="value">
                                            {logsByRole.map(entry => (
                                                <Cell key={entry.name} fill={ROLE_COLORS[entry.name] || "#6b7280"} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend formatter={v => <span style={{ color: axisColor, fontSize: 11 }}>{v}</span>} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                    </ChartCard>
                </Box>
            </Box>
        </Box>
    );
}

export default GuardDashboard;