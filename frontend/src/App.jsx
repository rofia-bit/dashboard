import { Routes, Route, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Login from "./presentation/pages/Login";
import Dashboard from "./presentation/pages/Dashboard";
import Edit from "./presentation/pages/Edit";
import Incidents from "./presentation/pages/Incidents";
import Sidebar from "./presentation/components/sidebar.jsx";
import HelpSupport from "./presentation/pages/HelpSupport.jsx";
import Settings from "./presentation/pages/Settings.jsx";

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