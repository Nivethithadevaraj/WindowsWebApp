import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Paper,
  Avatar,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import api from "../api/axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    designation: "",
    dateOfBirth: "",
    gender: "Female",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        Name: formData.name,
        Email: formData.email,
        PasswordHash: formData.password || "12345",
        Role: formData.role,
        Designation: formData.designation,
        DateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : new Date().toISOString(),
        Gender: formData.gender,
        IsActive: true,
      };
      await api.post("/Auth/register", payload);
      setMessage("Registration successful! You can now log in.");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        designation: "",
        dateOfBirth: "",
        gender: "Female",
      });
    } catch (err) {
      setMessage("Registration failed. Check your inputs.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a5d6a7, #c8e6c9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#2e7d32",
            width: 60,
            height: 60,
            mx: "auto",
            mb: 2,
          }}
        >
          <PersonAddAltIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, color: "#2e7d32" }}>
          Create Account
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Join the portal and start your journey
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            required
            margin="dense"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="dense"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            margin="dense"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            fullWidth
            required
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <TextField
            label="Role"
            name="role"
            select
            fullWidth
            required
            margin="dense"
            value={formData.role}
            onChange={handleChange}
          >
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Teacher">Teacher</MenuItem>
          </TextField>
          <TextField
            label="Designation"
            name="designation"
            fullWidth
            margin="dense"
            value={formData.designation}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1,
              background: "linear-gradient(90deg, #2e7d32, #43a047)",
              "&:hover": { background: "linear-gradient(90deg, #1b5e20, #388e3c)" },
            }}
          >
            Register
          </Button>
        </Box>

        {message && (
          <Typography sx={{ mt: 2 }} color="textSecondary">
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Register;
