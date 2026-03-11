import {
    Box,
    Button,
    Typography,
    Chip,
    InputBase,
    MenuItem,
    Select,
    Dialog,
    DialogContent,
    TextField,
    IconButton
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {useEffect, useState} from "react";
import {UserRepositoryImpl} from "../../data/repositories/users/UserRepositoryImpl.js";
import {UserUseCase} from "../../domain/usecases/users/UserUseCase.js";
import {useGetUsers} from "../hooks/users/getAllUsers/useGetUsers.js";
import {useRegisterUser} from "../hooks/users/register/useRegisterUser.js";
import {useDeleteUser} from "../hooks/users/delete/useDeleteUser.js";

const userRepository = new UserRepositoryImpl();
const userUseCase = new UserUseCase(userRepository);


function Users() {
    const [pageSize, setPageSize] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        role: "Resident",
    });

    const {users, loading, error, getUsers} = useGetUsers(userUseCase);
    const { registerUser } = useRegisterUser(userUseCase);
    const { deleteUser } = useDeleteUser(userUseCase);

    useEffect(() => {
        getUsers();
    }, []);

    if (loading) {
        return (
            <Box p={5}>
                <Typography>Loading users...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={5}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const columns = [
        {
            field: "imageUrl",
            headerName: "Avatar",
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" height="100%">
                    <img
                        src={`http://localhost:8081${params.value}`}
                        alt="user"
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />
                </Box>
            ),
        },
        {field: "userId", headerName: "ID", flex: 0.5, minWidth: 70, headerAlign: "left", align: "left"},
        {field: "fullName", headerName: "Name", flex: 1, minWidth: 120, headerAlign: "left", align: "left"},
        {field: "email", headerName: "Email", flex: 1.5, minWidth: 180, headerAlign: "left", align: "left"},
        {field: "role", headerName: "Role", flex: 1, minWidth: 110, headerAlign: "left", align: "left"},
        {
            field: "status",
            headerName: "Status",
            flex: 0.8,
            minWidth: 110,
            headerAlign: "left",
            align: "left",
            renderCell: (params) => (
                <Box display="flex" alignItems="center" height="100%">
                    <Chip
                        label={params.value}
                        sx={{
                            backgroundColor: params.value === "Active" ? "#10b981" : "#ef4444",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 600,
                            height: 26,
                            borderRadius: "13px",
                        }}
                    />
                </Box>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1.8,
            minWidth: 240,
            headerAlign: "center",
            align: "center",
            sortable: false,
            renderCell: (params) => (
                <Box display="flex" gap={1} justifyContent="center" alignItems="center" height="100%">
                    <Button
                        size="small"
                        sx={{
                            color: "#2563eb",
                            border: "1px solid #2563eb",
                            textTransform: "none",
                            fontSize: 12,
                            padding: "3px 12px",
                            minWidth: "unset",
                            lineHeight: 1.5,
                            "&:hover": {backgroundColor: "rgba(37, 99, 235, 0.1)"},
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        onClick={() => handleDeleteUser(params.row.userId)}
                        sx={{
                            color: "#ef4444",
                            border: "1px solid #ef4444",
                            textTransform: "none",
                            fontSize: 12,
                            padding: "3px 12px",
                            minWidth: "unset",
                            lineHeight: 1.5,
                            "&:hover": {backgroundColor: "rgba(239, 68, 68, 0.1)"},
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
                            padding: "3px 12px",
                            minWidth: "unset",
                            lineHeight: 1.5,
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

    const rows = users.map(user => ({
        userId: user.userId,
        fullName: user.fullname,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
        status: "Active"
    }));

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setOpenModal(false);
        setFormData({fullName: "", email: "", role: "RESIDENT" , password: ""});
    };

    const handleFormChange = (field, value) => {
        setFormData({...formData, [field]: value});
    };

    const handleAddUser = async () => {

        if (!formData.fullname || !formData.email || !formData.password) return;

        const result = await registerUser(
            formData.fullname,
            formData.email,
            formData.password,
            formData.role
        );

        if (result) {

            await getUsers();

            handleCloseModal();
        }
    };

    const handleDeleteUser = async (userId) => {

        const confirmed = window.confirm("Are you sure you want to delete this user?");

        if (!confirmed) return;

        const success = await deleteUser(userId);

        if (success) {
            getUsers();
        }
    };

    return (
        <Box display="flex" bgcolor="#0f1523" minHeight="100vh">
            <Sidebar/>

            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                ml="220px"
                pt={3}
                px={3}
            >
                <Navbar/>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                    <Box display="flex" gap={2} alignItems="center">
                        <Button
                            variant="contained"
                            startIcon={<AddIcon/>}
                            onClick={handleOpenModal}
                            sx={{
                                backgroundColor: "#2563eb",
                                color: "#fff",
                                textTransform: "none",
                                borderRadius: 1,
                                fontSize: 14,
                                fontWeight: 600,
                                "&:hover": {backgroundColor: "#1d4ed8"},
                            }}
                        >
                            Add User
                        </Button>
                        <Typography sx={{color: "#a0a9c9", fontSize: 14}}>All</Typography>
                    </Box>

                    <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                        <Select
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value)}
                            sx={{
                                width: 70,
                                height: 36,
                                backgroundColor: "#1f2a5a",
                                color: "#a0a9c9",
                                fontSize: 13,
                                borderRadius: 1,
                                "& .MuiOutlinedInput-notchedOutline": {borderColor: "#2a3a6a"},
                                "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: "#3a4a7a"},
                                "& .MuiSvgIcon-root": {color: "#a0a9c9"},
                            }}
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                        </Select>

                        <Box
                            display="flex"
                            alignItems="center"
                            bgcolor="#1f2a5a"
                            borderRadius={1}
                            px={2}
                            height={36}
                            width={200}
                            sx={{border: "1px solid #2a3a6a"}}
                        >
                            <InputBase
                                placeholder="Search..."
                                sx={{
                                    flex: 1,
                                    color: "#fff",
                                    fontSize: 13,
                                    "& input::placeholder": {color: "#6b7280", opacity: 1},
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
                        overflow: "hidden",
                        "& .MuiDataGrid-root": {
                            border: "none",
                            backgroundColor: "#111c44",
                            fontSize: 13,
                            color: "#e0e0e0",
                        },
                        "& .MuiDataGrid-cell": {
                            color: "#e0e0e0",
                            borderColor: "#1f2a5a",
                            display: "flex",
                            alignItems: "center",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#0d1635",
                            borderBottom: "1px solid #1f2a5a",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: "#0d1635",
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            color: "#a0a9c9",
                            fontWeight: 600,
                            fontSize: 13,
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            color: "#1f2a5a",
                        },
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#1a2749 !important",
                        },
                        "& .MuiDataGrid-row": {
                            backgroundColor: "#111c44",
                            borderBottom: "1px solid #1f2a5a",
                        },
                        "& .MuiDataGrid-footerContainer": {
                            backgroundColor: "#0d1635",
                            borderTop: "1px solid #1f2a5a",
                        },
                        "& .MuiTablePagination-root": {
                            color: "#a0a9c9",
                            fontSize: 12,
                        },
                        "& .MuiTablePagination-selectIcon": {color: "#a0a9c9"},
                        "& .MuiTablePagination-actions button": {color: "#a0a9c9"},
                        "& .MuiDataGrid-selectedRowCount": {color: "#a0a9c9"},
                        "& .MuiCheckbox-root": {color: "#2563eb"},
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: "#111c44",
                        },
                    }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.userId}
                        pageSizeOptions={[5, 10, 25]}
                        paginationModel={{pageSize, page: 0}}
                        onPaginationModelChange={(model) => setPageSize(model.pageSize)}
                        rowHeight={56}
                        sx={{height: 500}}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>

            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                PaperProps={{
                    sx: {
                        backgroundColor: "#0a1f4d",
                        borderRadius: 2,
                        minWidth: 500,
                        border: "1px solid #1f2a5a",
                    },
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={3}
                    borderBottom="1px solid #1f2a5a"
                >
                    <Typography sx={{color: "#fff", fontSize: 24, fontWeight: 700}}>Add User</Typography>
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{color: "#a0a9c9", "&:hover": {backgroundColor: "#1f2a5a"}}}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Box>

                <DialogContent sx={{p: 3}}>
                    <Box display="flex" flexDirection="column" gap={2.5}>
                        <TextField
                            label="Full Name"
                            placeholder="Name"
                            value={formData.fullname}
                            onChange={(e) => handleFormChange("fullname", e.target.value)}
                            InputLabelProps={{sx: {color: "#a0a9c9"}}}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "transparent",
                                    borderBottom: "2px solid #2563eb",
                                    borderRadius: 0,
                                    color: "#fff",
                                    "& fieldset": {border: "none"},
                                    "& input::placeholder": {color: "#6b7280", opacity: 1},
                                },
                            }}
                        />
                        <TextField
                            label="Email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={(e) => handleFormChange("email", e.target.value)}
                            InputLabelProps={{sx: {color: "#a0a9c9"}}}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "transparent",
                                    borderBottom: "2px solid #2563eb",
                                    borderRadius: 0,
                                    color: "#fff",
                                    "& fieldset": {border: "none"},
                                    "& input::placeholder": {color: "#6b7280", opacity: 1},
                                },
                            }}
                        />

                        <TextField
                            label="Password"
                            value={formData.password}
                            onChange={(e) => handleFormChange("password", e.target.value)}
                            InputLabelProps={{sx: {color: "#a0a9c9"}}}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "transparent",
                                    borderBottom: "2px solid #2563eb",
                                    borderRadius: 0,
                                    color: "#fff",
                                    "& fieldset": {border: "none"},
                                    "& input::placeholder": {color: "#6b7280", opacity: 1},
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
                                "& .MuiSvgIcon-root": {color: "#a0a9c9"},
                                "& .MuiOutlinedInput-notchedOutline": {borderColor: "#2a3a6a"},
                            }}
                        >
                            <MenuItem value="RESIDENT">Resident</MenuItem>
                            <MenuItem value="SECURITY_GUARD">Security Guard</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                            <MenuItem value="STAFF">Staff</MenuItem>
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
                                "&:hover": {backgroundColor: "#5b6573"},
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddUser}
                            disabled={!formData.fullname || !formData.email || !formData.password}
                            sx={{
                                backgroundColor: "#2563eb",
                                color: "#fff",
                                textTransform: "none",
                                borderRadius: 2,
                                fontSize: 13,
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                "&:hover": {backgroundColor: "#1d4ed8"},
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