import { Box, Typography, Stack, Chip, IconButton, CircularProgress } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState } from "react";
import { ShiftRepositoryImpl } from "../../../data/repositories/shifts/ShiftRepositoryImpl.js";
import { ShiftUseCase } from "../../../domain/usecases/shifts/ShiftUseCase.js";
import { useGetMyShifts } from "../../hooks/shifts/useGetMyShifts.js";

const shiftRepository = new ShiftRepositoryImpl();
const shiftUseCase    = new ShiftUseCase(shiftRepository);

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

function fmtShortDate(date) {
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function fmtTime(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function fmtWeekRange(monday) {
    const sunday = addDays(monday, 6);
    return `${fmtShortDate(monday)} – ${fmtShortDate(sunday)}, ${monday.getFullYear()}`;
}

function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth() &&
           a.getDate()     === b.getDate();
}



function ShiftCard({ shift }) {
    const now    = new Date();
    const start  = new Date(shift.startTime);
    const end    = new Date(shift.endTime);
    const active = now >= start && now <= end;
    const past   = now > end;

    const accent = active ? "#22c55e" : past ? "#6b7280" : "#2563eb";
    const label  = active ? "Active" : past ? "Ended" : "Upcoming";

    return (
        <Box sx={{
            bgcolor: `${accent}15`,
            border: `1px solid ${accent}40`,
            borderLeft: `3px solid ${accent}`,
            borderRadius: 1,
            p: 1,
            mb: 0.5,
        }}>
            <Typography sx={{ color: "#e2e8f0", fontSize: 11, fontWeight: 600, mb: 0.3 }}>
                {fmtTime(shift.startTime)} – {fmtTime(shift.endTime)}
            </Typography>
            <Chip label={label} size="small" sx={{
                bgcolor: `${accent}20`, color: accent,
                fontSize: 10, height: 18, fontWeight: 600,
                border: `1px solid ${accent}40`,
            }} />
        </Box>
    );
}



function GuardShifts() {
    const { shifts, loading, error } = useGetMyShifts(shiftUseCase);
    const [weekStart, setWeekStart]  = useState(getMonday(new Date()));

    const user        = JSON.parse(localStorage.getItem("user") || "{}");
    const weekDays    = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    


    const shiftsByDay = (dayDate) => shifts.filter(s => {
        const d = s.onDate ? new Date(s.onDate) : new Date(s.startTime);
        return isSameDay(d, dayDate);
    });

    const isToday = (date) => isSameDay(date, new Date());

    return (
        <Box display="flex" flexDirection="column" flex={1}>
            <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>


                <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                    <Box>
                        <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>My Shifts</Typography>
                        <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>
                            {user.fullname || "Guard"} — weekly schedule
                        </Typography>
                    </Box>
                    

                </Box>

                {/* week navigator */}
                <Box sx={{ bgcolor: "#1a2444", border: "1px solid #2a3a6a", borderRadius: 2, overflow: "hidden" }}>

                    <Box sx={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        px: 3, py: 2, borderBottom: "1px solid #2a3a6a", bgcolor: "#131d38",
                    }}>
                        <IconButton size="small" onClick={() => setWeekStart(addDays(weekStart, -7))}
                            sx={{ color: "#a0a9c9", "&:hover": { bgcolor: "#2a3a6a" } }}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon sx={{ color: "#2563eb", fontSize: 18 }} />
                            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                                {fmtWeekRange(weekStart)}
                            </Typography>
                        </Stack>
                        <IconButton size="small" onClick={() => setWeekStart(addDays(weekStart, 7))}
                            sx={{ color: "#a0a9c9", "&:hover": { bgcolor: "#2a3a6a" } }}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>



                    {loading ? (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress sx={{ color: "#2563eb" }} />
                        </Box>
                    ) : error ? (
                        <Box p={4} textAlign="center">
                            <Typography sx={{ color: "#ef4444", fontSize: 13 }}>{error}</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", minHeight: 320 }}>
                            {weekDays.map((day, i) => {
                                const dayShifts = shiftsByDay(day);
                                const today     = isToday(day);
                                return (
                                    <Box key={i} sx={{
                                        borderRight: i < 6 ? "1px solid #2a3a6a" : "none",
                                        p: 1.5,
                                        bgcolor: today ? "#1f2e55" : "transparent",
                                    }}>


                                        <Box sx={{ mb: 1.5, textAlign: "center" }}>
                                            <Typography sx={{
                                                fontSize: 11, fontWeight: 700, color: "#6b7280",
                                                textTransform: "uppercase", letterSpacing: 0.8,
                                            }}>
                                                {DAYS[i]}
                                            </Typography>
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: "50%",
                                                bgcolor: today ? "#2563eb" : "transparent",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                mx: "auto", mt: 0.3,
                                            }}>
                                                <Typography sx={{
                                                    fontSize: 13, fontWeight: today ? 700 : 500,
                                                    color: today ? "#fff" : "#a0a9c9",
                                                }}>
                                                    {day.getDate()}
                                                </Typography>
                                            </Box>
                                        </Box>



                                        {dayShifts.length === 0 ? (
                                            <Box sx={{
                                                height: 60, display: "flex", alignItems: "center",
                                                justifyContent: "center",
                                            }}>
                                                <Typography sx={{ color: "#2a3a6a", fontSize: 11 }}>—</Typography>
                                            </Box>
                                        ) : (
                                            dayShifts.map(shift => (
                                                <ShiftCard key={shift.assignId} shift={shift} />
                                            ))
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    )}



                    <Box sx={{
                        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
                        borderTop: "1px solid #2a3a6a", bgcolor: "#131d38",
                    }}>
                        {weekDays.map((day, i) => {
                            const count = shiftsByDay(day).length;
                            return (
                                <Box key={i} sx={{
                                    borderRight: i < 6 ? "1px solid #2a3a6a" : "none",
                                    py: 1, textAlign: "center",
                                }}>
                                    <Typography sx={{ color: "#6b7280", fontSize: 11 }}>
                                        {count > 0 ? `${count} shift${count > 1 ? "s" : ""}` : "—"}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default GuardShifts;