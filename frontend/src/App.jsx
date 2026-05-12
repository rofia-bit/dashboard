/* eslint-disable no-unused-vars */
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import Login         from "./presentation/pages/Login";
import Dashboard     from "./presentation/pages/Dashboard";
import Edit          from "./presentation/pages/Edit";
import Incidents     from "./presentation/pages/Incidents";
import Reports       from "./presentation/pages/Reports";
import GuestRequests from "./presentation/pages/GuestRequests";
import Sidebar       from "./presentation/components/sidebar.jsx";
import HelpSupport   from "./presentation/pages/HelpSupport.jsx";
import Settings      from "./presentation/pages/Settings.jsx";
import Shifts        from "./presentation/pages/Shifts.jsx";
import Facilities    from "./presentation/pages/Facilities.jsx";
import GuardDashboard from "./presentation/pages/guard/GuardDashboard";
import QRScanner      from "./presentation/pages/guard/QRScanner";
import GuardShifts    from "./presentation/pages/guard/GuardShifts";
import Reservations from "./presentation/pages/Reservations.jsx";
import Logs from "./presentation/pages/Logs.jsx";

const pageTransition = {
    initial:  { opacity: 0, y: 14 },
    animate:  { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit:     { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
};

function AnimatedPage({ children }) {
    return (
        <motion.div
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
            {children}
        </motion.div>
    );
}

function App() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Login />} />

                <Route element={<AppLayout />}>
                    <Route path="/dashboard"      element={<AnimatedPage><Dashboard /></AnimatedPage>} />
                    <Route path="/edit"           element={<AnimatedPage><Edit /></AnimatedPage>} />
                    <Route path="/incidents"      element={<AnimatedPage><Incidents /></AnimatedPage>} />
                    <Route path="/reports"        element={<AnimatedPage><Reports /></AnimatedPage>} />
                    <Route path="/guest-requests" element={<AnimatedPage><GuestRequests /></AnimatedPage>} />
                    <Route path="/settings"       element={<AnimatedPage><Settings /></AnimatedPage>} />
                    <Route path="/help"           element={<AnimatedPage><HelpSupport /></AnimatedPage>} />
                    <Route path="/shifts"         element={<AnimatedPage><Shifts /></AnimatedPage>} />
                    <Route path="/facilities"     element={<AnimatedPage><Facilities /></AnimatedPage>} />
                    <Route path="/reservations"     element={<AnimatedPage><Reservations /></AnimatedPage>} />
                    <Route path="/logs" element={<AnimatedPage><Logs /></AnimatedPage>} />
                </Route>

                <Route element={<AppLayout />}>
                    <Route path="/guard"        element={<AnimatedPage><GuardDashboard /></AnimatedPage>} />
                    <Route path="/guard/logs"   element={<AnimatedPage><Logs /></AnimatedPage>} />
                    <Route path="/guard/qr"     element={<AnimatedPage><QRScanner /></AnimatedPage>} />
                    <Route path="/guard/shifts" element={<AnimatedPage><GuardShifts /></AnimatedPage>} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

function AppLayout() {
    return (
        <Box display="flex" sx={{ bgcolor: "var(--bg-base)", minHeight: "100vh" }}>
            <Sidebar />
            <Box flex={1} ml="64px" display="flex" flexDirection="column">
                <Outlet />
            </Box>
        </Box>
    );
}

export default App;