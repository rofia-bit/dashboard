import { Box, Button, Typography, Chip, InputBase, MenuItem, Select, Dialog, DialogContent, TextField, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const columns = [
  { field: "id", headerName: "ID", width: 100, headerAlign: "left", align: "left" },
  { field: "name", headerName: "Name", width: 150, headerAlign: "left", align: "left" },
  { field: "email", headerName: "Email", width: 220, headerAlign: "left", align: "left" },
  { field: "role", headerName: "Role", width: 140, headerAlign: "left", align: "left" },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <Chip
        label={params.value}
        sx={{
          backgroundColor: params.value === "Active" ? "#10b981" : "#ef4444",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          height: 24,
        }}
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 240,
    headerAlign: "center",
    align: "center",
    sortable: false,
    renderCell: (params) => (
      <Box display="flex" gap={1} justifyContent="center">
        <Button
          size="small"
          sx={{
            color: "#2563eb",
            border: "1px solid #2563eb",
            textTransform: "none",
            fontSize: 12,
            padding: "4px 12px",
            minWidth: "auto",
            "&:hover": { backgroundColor: "rgba(37, 99, 235, 0.1)" },
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          sx={{
            color: "#ef4444",
            border: "1px solid #ef4444",
            textTransform: "none",
            fontSize: 12,
            padding: "4px 12px",
            minWidth: "auto",
            "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
          }}
        >
          Delete
        </Button>
        <Button
          size="small"
          sx={{
            color: params.row.status === "Active" ? "#ef4444" : "#10b981",
            border: `1px solid ${params.row.status === "Active" ? "#ef4444" : "#10b981"}`,
            textTransform: "none",
            fontSize: 12,
            padding: "4px 12px",
            minWidth: "auto",
            "&:hover": {
              backgroundColor:
                params.row.status === "Active"
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(16, 185, 129, 0.1)",
            },
          }}
        >
          {params.row.status === "Active" ? "Deactivate" : "Activate"}
        </Button>
      </Box>
    ),
  },
];



const rows = [
  { id: 1, name: "Rofia", email: "d@gmail.com", role: "Resident", status: "Active" },
  { id: 2, name: "rndm", email: "g@gmail.com", role: "Guard", status: "Inactive" },
];



function Users() {
  const [pageSize, setPageSize] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Resident",
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ fullName: "", email: "", role: "Resident" });
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddUser = () => {
    if (formData.fullName && formData.email) {
      console.log("Adding user:", formData);
      handleCloseModal();
    }
  };

  return (
    <Box display="flex" bgcolor="#0f1523" minHeight="100vh">
      <Sidebar />

      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        ml="220px"
        pt={3}
        px={3}
      >
        <Navbar />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Box display="flex" gap={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
              sx={{
                backgroundColor: "#2563eb",
                color: "#fff",
                textTransform: "none",
                borderRadius: 1,
                fontSize: 14,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              Add User
            </Button>
            <Typography sx={{ color: "#a0a9c9", fontSize: 14 }}>All</Typography>
          </Box>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              sx={{
                width: 60,
                height: 32,
                backgroundColor: "#1f2a5a",
                color: "#a0a9c9",
                fontSize: 13,
                borderRadius: 1,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a3a6a" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3a4a7a" },
                "& .MuiSvgIcon-root": { color: "#a0a9c9" },
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
            </Select>

            <Box display="flex" alignItems="center" bgcolor="#1f2a5a" borderRadius={1} px={2} py={1} width={200}>
              <InputBase
                placeholder="Search..."
                sx={{
                  flex: 1,
                  color: "#fff",
                  fontSize: 13,
                  "& input::placeholder": { color: "#6b7280", opacity: 1 },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: "#111c44",
            borderRadius: 2,
            border: "1px solid #1f2a5a",
            "& .MuiDataGrid-root": { border: "none", backgroundColor: "#111c44", fontSize: 13 },
            "& .MuiDataGrid-cell": { color: "#e0e0e0", borderColor: "#1f2a5a", padding: "12px 8px" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#0a1526", borderColor: "#1f2a5a" },
            "& .MuiDataGrid-columnHeaderTitle": { color: "#a0a9c9", fontWeight: 600, fontSize: 12 },
            "& .MuiDataGrid-row:hover": { backgroundColor: "#1a2749 !important" },
            "& .MuiDataGrid-row": { backgroundColor: "#111c44" },
            "& .MuiTablePagination-root": { color: "#a0a9c9", fontSize: 12 },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize } } }}
            sx={{ "& .MuiCheckbox-root": { color: "#2563eb" }, height: 500 }}
          />
        </Box>
      </Box>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{
          sx: { backgroundColor: "#0a1f4d", borderRadius: 2, minWidth: 500, border: "1px solid #1f2a5a" },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" p={3} borderBottom="1px solid #1f2a5a">
          <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>Add User</Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: "#a0a9c9", "&:hover": { backgroundColor: "#1f2a5a" } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Full Name"
              placeholder="Name"
              value={formData.fullName}
              onChange={(e) => handleFormChange("fullName", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  borderBottom: "2px solid #2563eb",
                  borderRadius: 0,
                  color: "#fff",
                  "& fieldset": { border: "none" },
                  "& input::placeholder": { color: "#6b7280", opacity: 1 },
                },
              }}
            />
            <TextField
              label="Email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  borderBottom: "2px solid #2563eb",
                  borderRadius: 0,
                  color: "#fff",
                  "& fieldset": { border: "none" },
                  "& input::placeholder": { color: "#6b7280", opacity: 1 },
                },
              }}
            />
            <Select
              value={formData.role}
              onChange={(e) => handleFormChange("role", e.target.value)}
              sx={{
                backgroundColor: "#1f2a5a",
                color: "#a0a9c9",
                fontSize: 13,
                borderRadius: 2,
                "& .MuiSvgIcon-root": { color: "#a0a9c9" },
              }}
            >
              <MenuItem value="Resident">Resident</MenuItem>
              <MenuItem value="Guard">Guard</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
            </Select>
          </Box>

          <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
            <Button
              onClick={handleCloseModal}
              sx={{
                backgroundColor: "#4b5563",
                color: "#fff",
                textTransform: "none",
                borderRadius: 2,
                fontSize: 13,
                fontWeight: 600,
                px: 3,
                py: 1,
                "&:hover": { backgroundColor: "#5b6573" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              sx={{
                backgroundColor: "#2563eb",
                color: "#fff",
                textTransform: "none",
                borderRadius: 2,
                fontSize: 13,
                fontWeight: 600,
                px: 3,
                py: 1,
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              Add
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Users;