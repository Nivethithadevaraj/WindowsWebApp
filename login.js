import React, { useState } from "react";
import api from "../api/axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Paper,
  Avatar,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/Auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = "/register";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 380,
          textAlign: "center",
          p: 4,
          borderRadius: 4,
          backdropFilter: "blur(8px)",
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
          <SchoolIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" sx={{ mb: 1.5, fontWeight: "bold", color: "#2e7d32" }}>
          ABC School Portal
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Welcome back! Please login to continue.
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            background: "linear-gradient(90deg, #2e7d32, #43a047)",
            "&:hover": { background: "linear-gradient(90deg, #1b5e20, #388e3c)" },
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Don’t have an account?{" "}
          <Link
            component="button"
            onClick={handleRegisterRedirect}
            sx={{ fontWeight: 600, color: "#2e7d32" }}
          >
            Register here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
