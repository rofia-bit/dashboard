import {Box} from "@mui/material";
import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Card from "../components/card.jsx";

function Dashboard() {
    return (
        <Box display="flex" bgcolor="#0f1523">
            <Sidebar/>

            <Box flex={1} display="flex" flexDirection="column" ml="200px">
                <Navbar/>
                <Box display="flex" gap={2} p={2} flexWrap="wrap">
                    <Card title="Total Users" value="560"/>
                    <Card title="Active Users" value="420" type="active"/>
                    <Card title="Deactivated" value="45" type="inactive"/>
                </Box>
            </Box>
        </Box>
    );
}

export default Dashboard;