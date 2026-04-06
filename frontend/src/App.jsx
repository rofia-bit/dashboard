import { Routes, Route, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Login from "./presentation/pages/Login";
import Dashboard from "./presentation/pages/Dashboard";
import Edit from "./presentation/pages/Edit";
import Incidents from "./presentation/pages/Incidents";
import Sidebar from "./presentation/components/sidebar.jsx";
import HelpSupport from "./presentation/pages/HelpSupport.jsx";
import Settings from "./presentation/pages/Settings.jsx";
import GuardDashboard from "./presentation/pages/guard/GuardDashboard";
import AccessLogs     from "./presentation/pages/guard/AccessLogs";
import QRScanner      from "./presentation/pages/guard/QRScanner";
import GuardShifts    from "./presentation/pages/guard/GuardShifts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/incidents" element={<Incidents />} />

        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<HelpSupport />} />
      </Route>

      <Route element={<AppLayout />}>
                <Route path="/guard"        element={<GuardDashboard />} />
                <Route path="/guard/logs"   element={<AccessLogs />} />
                <Route path="/guard/qr"     element={<QRScanner />} />
                <Route path="/guard/shifts" element={<GuardShifts />} />
      </Route>

    </Routes>
  );
}

function AppLayout() {
  return (
    <Box display="flex" bgcolor="#0f1523" minHeight="100vh">
      <Sidebar />
      <Box flex={1} ml="200px" display="flex" flexDirection="column">
        <Outlet />
      </Box>
    </Box>
  );
}



export default App;