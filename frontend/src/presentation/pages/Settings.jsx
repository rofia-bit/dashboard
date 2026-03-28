import { Box, Typography, Stack, Divider } from "@mui/material";

// header

// success/error alerts


// user profile: pfp, name, email
function ProfileSection() {
    return <Box />;
}


// security / new password, confirm, update
function PasswordSection() {
    return <Box />;
}

 // authorized access: assigned shifts table
function AccessSection() {
    return <Box />;
}



export default function Settings() {
    return (
        <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
            <Box mb={4}>
                <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>Settings</Typography>
                <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>Manage your account</Typography>
            </Box>

            <Stack spacing={3}>
                <ProfileSection />
                <Divider sx={{ borderColor: "#2a3a6a" }} />
                <PasswordSection />
                <Divider sx={{ borderColor: "#2a3a6a" }} />
                <AccessSection />
            </Stack>
        </Box>
    );
}