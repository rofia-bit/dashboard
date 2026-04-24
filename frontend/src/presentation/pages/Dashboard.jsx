/* eslint-disable no-unused-vars */

import { Box, Grid } from "@mui/material";
import Navbar from "../components/navbar.jsx";
import Card from "../components/card.jsx";
import { motion } from "framer-motion";

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line, Legend
} from "recharts";
import { useMemo, useEffect } from "react";
 
import { IncidentRepositoryImpl } from "../../data/repositories/incidents/IncidentRepositoryImpl.js";
import { IncidentUseCase } from "../../domain/usecases/incidents/IncidentUseCase.js";
import { UserRepositoryImpl } from "../../data/repositories/users/UserRepositoryImpl.js";
import { UserUseCase } from "../../domain/usecases/users/UserUseCase.js";
import { useGetAllIncidents } from "../hooks/incidents/useGetAllIncidents.js";
import { useGetUsers } from "../hooks/users/getAllUsers/useGetUsers.js";
import { ChartCard, CustomTooltip, ChartSpinner, ChartEmpty, CHART_COLORS, STATUS_COLORS } from "../components/chartCard.jsx";
 

const incidentRepository = new IncidentRepositoryImpl();
const incidentUseCase    = new IncidentUseCase(incidentRepository);
const userRepository     = new UserRepositoryImpl();
const userUseCase        = new UserUseCase(userRepository);

// Shared animation variants
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const staggerContainer = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.1 } },
};

function Dashboard() {
    const { incidents, loading: incLoading } = useGetAllIncidents(incidentUseCase);
    const { users, loading: usrLoading, getUsers } = useGetUsers(userUseCase);

    useEffect(() => { getUsers(); }, []);

    const openIncidents = incidents.filter(i => i.status?.toUpperCase() === "OPEN").length;
    const resolved      = incidents.filter(i => i.status?.toUpperCase() === "RESOLVED").length;

    const statusData = useMemo(() => {
        const counts = {};
        incidents.forEach(i => { const s = i.status || "UNKNOWN"; counts[s] = (counts[s] || 0) + 1; });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [incidents]);

    const categoryData = useMemo(() => {
        const counts = {};
        incidents.forEach(i => { const c = i.categoryName || "Uncategorized"; counts[c] = (counts[c] || 0) + 1; });
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value).slice(0, 8);
    }, [incidents]);

    const timelineData = useMemo(() => {
        const counts = {};
        incidents.forEach(i => {
            if (!i.reportedAt) return;
            const day = new Date(i.reportedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
            counts[day] = (counts[day] || 0) + 1;
        });
        return Object.entries(counts).map(([date, count]) => ({ date, count })).slice(-14);
    }, [incidents]);

    const roleData = useMemo(() => {
        const counts = {};
        users.forEach(u => { const r = u.role || "UNKNOWN"; counts[r] = (counts[r] || 0) + 1; });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [users]);

    return (
        <Box display="flex" flexDirection="column" flex={1}>
            <Navbar />
            <Box p={3}>

                {/* ── Stat Cards ── */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}
                >
                    <Card title="Total Users"    value={usrLoading ? "…" : users.length}        index={0} />
                    <Card title="Active Users"   value={usrLoading ? "…" : users.length}        index={1} type="active" />
                    <Card title="Open Incidents" value={incLoading ? "…" : openIncidents}       index={2} type="inactive" />
                    <Card title="Resolved"       value={incLoading ? "…" : resolved}            index={3} type="active" />
                </motion.div>

                {/* ── Top Charts Row ── */}
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={5}>
                        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
                            <ChartCard title="Incidents by Status">
                                {incLoading ? <ChartSpinner /> : (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                                                {statusData.map((entry, i) => (
                                                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name.toUpperCase()] || CHART_COLORS[i % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend formatter={v => <span style={{ color: "#a0a9c9", fontSize: 12 }}>{v}</span>} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </ChartCard>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.3 }}>
                            <ChartCard title="Incidents by Category">
                                {incLoading ? <ChartSpinner /> : (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <BarChart data={categoryData} margin={{ top: 0, right: 10, left: -20, bottom: 40 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a6a" />
                                            <XAxis dataKey="name" tick={{ fill: "#a0a9c9", fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                                            <YAxis tick={{ fill: "#a0a9c9", fontSize: 11 }} allowDecimals={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="value" name="Incidents" radius={[4, 4, 0, 0]}>
                                                {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </ChartCard>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* ── Bottom Charts Row ── */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.4 }}>
                            <ChartCard title="Incident Reports — Last 14 Days" minH={200}>
                                {incLoading ? <ChartSpinner /> : timelineData.length === 0
                                    ? <ChartEmpty message="No timeline data" />
                                    : (
                                        <ResponsiveContainer width="100%" height={200}>
                                            <LineChart data={timelineData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#2a3a6a" />
                                                <XAxis dataKey="date" tick={{ fill: "#a0a9c9", fontSize: 11 }} />
                                                <YAxis tick={{ fill: "#a0a9c9", fontSize: 11 }} allowDecimals={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Line type="monotone" dataKey="count" name="Incidents" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb", r: 3 }} activeDot={{ r: 5 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                            </ChartCard>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.5 }}>
                            <ChartCard title="Users by Role" minH={200}>
                                {usrLoading ? <ChartSpinner /> : (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={roleData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a6a" horizontal={false} />
                                            <XAxis type="number" tick={{ fill: "#a0a9c9", fontSize: 11 }} allowDecimals={false} />
                                            <YAxis type="category" dataKey="name" tick={{ fill: "#a0a9c9", fontSize: 11 }} width={110} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="value" name="Users" radius={[0, 4, 4, 0]}>
                                                {roleData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </ChartCard>
                        </motion.div>
                    </Grid>
                </Grid>

            </Box>
        </Box>
    );
}

export default Dashboard;