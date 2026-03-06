import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, Divider, Stack } from "@mui/material";
import { useState } from "react";

function StyledTextField({ label, placeholder, type = "text", value, onChange }) {
  return (
    <Stack spacing={0.5} mb={2.5}>
      <Typography sx={{ color: "#9ca3af", fontSize: 12, fontWeight: 500 }}>{label}</Typography>
      <TextField
        placeholder={placeholder}
        type={type}
        variant="outlined"
        fullWidth
        value={value}
        onChange={onChange}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#1f2a5a",
            border: "1px solid #374151",
            borderRadius: 1,
            color: "#fff",
            fontSize: 13,
            "& fieldset": { borderColor: "#374151" },
            "&:hover fieldset": { borderColor: "#4b5563" },
            "&.Mui-focused fieldset": { borderColor: "#2563eb", borderWidth: 2 },
          },
          "& .MuiOutlinedInput-input": { padding: "10px 12px", fontSize: 13 },
          "& .MuiOutlinedInput-input::placeholder": { color: "#6b7280", opacity: 1 },
        }}
      />
    </Stack>
  );
}



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const buttonStyle = {
    textTransform: "none",
    borderRadius: 2,
    py: 1.2,
    fontWeight: 600,
    fontSize: 14,
  };



  return (
    <Box display="flex" height="100vh">
      {/* hero */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        px={8}
        py={6}
        sx={{ background: "linear-gradient(135deg, #081028 0%, #0a1a3a 100%)" }}
      >
        <Typography sx={{ fontSize: 56, fontWeight: 700, color: "#fff", lineHeight: 1.2, mb: 4 }}>
          Manage Your{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            System
          </Box>{" "}
          With Ease.
        </Typography>
        <Box sx={{ width: 60, height: 4, background: "linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)", borderRadius: 2 }} />
      </Box>



      {/*form */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center" bgcolor="#0f1523" px={6}>
        <Stack spacing={3} sx={{ width: "100%", maxWidth: 380 }}>
          <Box>
            <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>Welcome!</Typography>
            <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>Log in to manage your account.</Typography>
          </Box>


          <StyledTextField label="Email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <StyledTextField label="Password" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />


          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={<Checkbox size="small" sx={{ color: "#6b7280", "&.Mui-checked": { color: "#2563eb" } }} />}
              label="Remember Me"
              sx={{ color: "#a0a9c9", "& .MuiFormControlLabel-label": { fontSize: 12 } }}
            />
            <Typography sx={{ color: "#2563eb", fontSize: 12, fontWeight: 500, cursor: "pointer", "&:hover": { color: "#1d4ed8" } }}>
              Forgot Password?
            </Typography>
          </Box>



          <Button fullWidth sx={{ ...buttonStyle, backgroundColor: "#0099ff", color: "#fff", "&:hover": { backgroundColor: "#1a1a1a" } }}>
            Login
          </Button>



          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Divider sx={{ flex: 1, borderColor: "#374151" }} />
            <Typography sx={{ color: "#a0a9c9", fontSize: 12 }}>OR</Typography>
            <Divider sx={{ flex: 1, borderColor: "#374151" }} />
          </Stack>

          <Box display="flex" justifyContent="center" gap={0.5} mt={1}>
            <Typography sx={{ color: "#a0a9c9", fontSize: 12 }}>Don't have an account?</Typography>
            <Typography sx={{ color: "#2563eb", fontSize: 12, fontWeight: 600, cursor: "pointer", "&:hover": { color: "#1d4ed8" } }}>
              Sign up here
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default Login;