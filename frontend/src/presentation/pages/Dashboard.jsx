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

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" } },
};

const staggerCards = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08 } },
};

// Residence hero image
const HERO_IMAGE = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1800&q=80&auto=format&fit=crop";

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
        // marginLeft = collapsed sidebar width so content is never hidden behind it
        <Box
            sx={{
                bgcolor: "#060e22",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* ═══════════════════════════════════════════════
                HERO BANNER
            ═══════════════════════════════════════════════ */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: 300,
                    overflow: "hidden",
                    borderRadius: "0 0 20px 20px",
                    mb: 3,
                    flexShrink: 0,
                }}
            >
                {/* Photo */}
                <Box
                    component="img"
                    src={HERO_IMAGE}
                    alt="Residence"
                    sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center 55%",
                        filter: "brightness(0.5) saturate(0.75)",
                    }}
                />

                {/* Gradient — darker bottom-left so cards are legible */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background: `
                            linear-gradient(
                                135deg,
                                rgba(6,14,34,0.72) 0%,
                                rgba(6,14,34,0.1)  55%,
                                rgba(6,14,34,0.55) 100%
                            )
                        `,
                    }}
                />

                {/* Navbar — transparent, floats at top of hero */}
                <Box sx={{ position: "relative", zIndex: 10 }}>
                    <Navbar />
                </Box>

                {/* ── Stat cards — bottom-left of hero ── */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        right: 20,
                        zIndex: 10,
                    }}
                >
                    <motion.div
                        variants={staggerCards}
                        initial="hidden"
                        animate="show"
                        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                    >
                        <Card title="Total Users"    value={usrLoading ? "…" : users.length}   index={0} type="users"    />
                        <Card title="Active Users"   value={usrLoading ? "…" : users.length}   index={1} type="active"   />
                        <Card title="Open Incidents" value={incLoading ? "…" : openIncidents}  index={2} type="inactive" />
                        <Card title="Resolved"       value={incLoading ? "…" : resolved}       index={3} type="active"   />
                    </motion.div>
                </Box>
            </Box>

            {/* ═══════════════════════════════════════════════
                CHARTS
            ═══════════════════════════════════════════════ */}
            <Box px={3} pb={4} flex={1}>

                {/* Top row */}
                <Grid container spacing={2.5} mb={2.5}>
                    <Grid item xs={12} md={5}>
                        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.22 }}>
                            <ChartCard title="Incidents by Status">
                                {incLoading ? <ChartSpinner /> : (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%" cy="50%"
                                                innerRadius={58} outerRadius={96}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {statusData.map((entry, i) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={STATUS_COLORS[entry.name.toUpperCase()] || CHART_COLORS[i % CHART_COLORS.length]}
                                                    />
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
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" />
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

                {/* Bottom row */}
                <Grid container spacing={2.5}>
                    <Grid item xs={12} md={7}>
                        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.38 }}>
                            <ChartCard title="Incident Reports — Last 14 Days" minH={200}>
                                {incLoading ? <ChartSpinner /> : timelineData.length === 0
                                    ? <ChartEmpty message="No timeline data" />
                                    : (
                                        <ResponsiveContainer width="100%" height={200}>
                                            <LineChart data={timelineData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" />
                                                <XAxis dataKey="date" tick={{ fill: "#a0a9c9", fontSize: 11 }} />
                                                <YAxis tick={{ fill: "#a0a9c9", fontSize: 11 }} allowDecimals={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="count"
                                                    name="Incidents"
                                                    stroke="#2563eb"
                                                    strokeWidth={2}
                                                    dot={{ fill: "#2563eb", r: 3 }}
                                                    activeDot={{ r: 5 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                            </ChartCard>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.46 }}>
                            <ChartCard title="Users by Role" minH={200}>
                                {usrLoading ? <ChartSpinner /> : (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={roleData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" horizontal={false} />
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