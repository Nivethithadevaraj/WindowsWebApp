import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  IconButton,
  Fab,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  MenuItem,
  InputAdornment,
  AppBar,
  Toolbar,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete, Add, Search, Logout } from "@mui/icons-material";
import api from "../api/axios";
import defaultPic from "../assets/defaultProfile.png";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [formData, setFormData] = useState({
    userId: 0,
    name: "",
    email: "",
    passwordHash: "",
    role: "",
    gender: "",
    designation: "",
    department: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
      setRole(userRole);

      const endpoint = userRole === "Teacher" ? "/User/all" : "/User/me";
      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userRole === "Teacher") {
        const sorted = Array.isArray(res.data)
          ? res.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
          : [];
        setUsers(sorted);
      } else {
        setUsers([res.data]);
      }
    } catch (err) {
      console.error("Error fetching users", err);
      if (err?.response?.status === 401) window.location.href = "/";
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.role || !formData.designation || !formData.dateOfBirth) {
      setSnackbar({ open: true, message: "Please fill all required fields.", color: "error" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const base = {
        Name: formData.name,
        Email: formData.email,
        Role: formData.role,
        Designation: formData.designation,
        Gender: formData.gender || null,
        Department: formData.department || null,
        PhoneNumber: formData.phoneNumber || null,
        Address: formData.address || null,
        DateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : new Date().toISOString(),
        IsActive: true,
      };

      if (!formData.userId || formData.userId === 0) {
        base.PasswordHash =
          formData.passwordHash && formData.passwordHash.trim().length > 0
            ? formData.passwordHash
            : "12345";
        await api.post("/User", base, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnackbar({ open: true, message: "User added successfully!", color: "success" });
      } else {
        const updatePayload = { ...base };
        if (formData.passwordHash && formData.passwordHash.trim().length > 0)
          updatePayload.PasswordHash = formData.passwordHash;
        await api.put(`/User/${formData.userId}`, updatePayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnackbar({ open: true, message: "User updated successfully!", color: "success" });
      }

      setOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user", err);
      setSnackbar({ open: true, message: "Error saving user.", color: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/User/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: "User deleted successfully!", color: "success" });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user", err);
      setSnackbar({ open: true, message: "Delete failed.", color: "error" });
    }
  };

  const handleEdit = (user) => {
    if (role === "Student") {
      alert("Contact incharge to edit your details.");
      return;
    }
    setFormData({
      userId: user.userId ?? user.userID ?? 0,
      name: user.name ?? user.Name ?? "",
      email: user.email ?? user.Email ?? "",
      passwordHash: "",
      role: user.role ?? user.Role ?? "",
      gender: user.gender ?? user.Gender ?? "",
      designation: user.designation ?? user.Designation ?? "",
      department: user.department ?? user.Department ?? "",
      phoneNumber: user.phoneNumber ?? user.PhoneNumber ?? "",
      address: user.address ?? user.Address ?? "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
        : "",
    });
    setOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const filteredUsers = users
    .filter((u) => (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((u) => (roleFilter ? (u.role || u.Role) === roleFilter : true));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
        pb: 6,
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #2e7d32, #43a047)",
          boxShadow: 3,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            {role === "Teacher" ? "Teacher Dashboard" : "Student Profile"}
          </Typography>
          <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {/* Search + Filter */}
        {role === "Teacher" && (
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: "flex",
              gap: 2,
              mb: 3,
              borderRadius: "10px",
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Search by name..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <TextField
              select
              label="Filter by Role"
              size="small"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
            </TextField>
          </Paper>
        )}

        {/* ✅ Modern Table View for Teachers */}
        {role === "Teacher" ? (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "12px",
              boxShadow: 4,
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#43a047" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Avatar
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Designation
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Department
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow
                    key={u.userId}
                    hover
                    sx={{
                      transition: "0.2s",
                      "&:hover": { backgroundColor: "#e8f5e9" },
                    }}
                  >
                    <TableCell>
                      <Avatar src={defaultPic} />
                    </TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.designation}</TableCell>
                    <TableCell>{u.department}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(u)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(u.userId)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          // ✅ Student profile (unchanged)
          users[0] && (
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: "16px",
                maxWidth: 600,
                mx: "auto",
                textAlign: "center",
                mt: 4,
                background: "white",
              }}
            >
              <Avatar
                src={defaultPic}
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 2,
                  border: "3px solid #66bb6a",
                }}
              />
              <Typography variant="h5" fontWeight="bold">
                {users[0].name}
              </Typography>
              <Typography color="text.secondary" mb={2}>
                {users[0].designation} | {users[0].role}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {(() => {
                const u = users[0];
                const dob = new Date(u.dateOfBirth);
                const age =
                  dob instanceof Date && !isNaN(dob)
                    ? Math.floor(
                        (new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000)
                      )
                    : "N/A";
                const displayFields = [
                  { label: "Name", value: u.name },
                  { label: "Email", value: u.email },
                  { label: "Role", value: u.role },
                  {
                    label: "Date of Birth",
                    value:
                      dob instanceof Date && !isNaN(dob)
                        ? dob.toLocaleDateString()
                        : "N/A",
                  },
                  { label: "Age", value: age },
                  { label: "Gender", value: u.gender },
                  { label: "Designation", value: u.designation },
                  { label: "Department", value: u.department },
                  { label: "Phone Number", value: u.phoneNumber },
                  { label: "Address", value: u.address },
                ];
                return displayFields.map((field) => (
                  <Box
                    key={field.label}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1.2,
                      backgroundColor: "#f9f9f9",
                      borderRadius: "10px",
                      mb: 1,
                      "&:hover": { backgroundColor: "#e8f5e9" },
                    }}
                  >
                    <Typography fontWeight="bold">{field.label}:</Typography>
                    <Typography>{field.value || "N/A"}</Typography>
                  </Box>
                ));
              })()}
            </Paper>
          )
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            {formData.userId ? "Edit User" : "Add User"}
          </DialogTitle>
          <DialogContent dividers>
            <Box display="grid" gap={2}>
              <TextField label="Name *" name="name" fullWidth value={formData.name} onChange={handleChange} />
              <TextField label="Email *" name="email" fullWidth value={formData.email} onChange={handleChange} />
              <TextField
                label="Password"
                type="password"
                name="passwordHash"
                fullWidth
                helperText={formData.userId ? "Leave blank to keep existing password" : "Default password is 12345"}
                value={formData.passwordHash}
                onChange={handleChange}
              />
              <TextField label="Role *" name="role" fullWidth value={formData.role} onChange={handleChange} />
              <TextField select label="Gender *" name="gender" fullWidth value={formData.gender} onChange={handleChange}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField label="Designation *" name="designation" fullWidth value={formData.designation} onChange={handleChange} />
              <TextField label="Department" name="department" fullWidth value={formData.department} onChange={handleChange} />
              <TextField label="Phone Number" name="phoneNumber" fullWidth value={formData.phoneNumber} onChange={handleChange} />
              <TextField label="Address" name="address" fullWidth value={formData.address} onChange={handleChange} />
              <TextField label="Date of Birth *" type="date" name="dateOfBirth" InputLabelProps={{ shrink: true }} fullWidth value={formData.dateOfBirth} onChange={handleChange} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for feedback */}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.color}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>

      {role === "Teacher" && (
        <Fab
          color="success"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            boxShadow: 4,
          }}
          onClick={() => {
            setFormData({
              userId: 0,
              name: "",
              email: "",
              passwordHash: "",
              role: "",
              gender: "",
              designation: "",
              department: "",
              phoneNumber: "",
              address: "",
              dateOfBirth: "",
            });
            setOpen(true);
          }}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
}

export default Dashboard;
