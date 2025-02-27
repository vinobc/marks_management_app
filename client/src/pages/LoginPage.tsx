import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Link,
  Grid,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  const { login, register, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password, department });
      navigate("/dashboard"); // Redirect to dashboard after registration
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const toggleForm = () => {
    setShowRegister(!showRegister);
    clearError();
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {showRegister ? "Register" : "Sign in"}
        </Typography>
        <Paper elevation={3} sx={{ mt: 2, p: 4, width: "100%" }}>
          {showRegister ? (
            <Box component="form" onSubmit={handleRegister} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="department"
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Register"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    variant="body2"
                    onClick={toggleForm}
                    sx={{ cursor: "pointer" }}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleLogin} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    variant="body2"
                    onClick={toggleForm}
                    sx={{ cursor: "pointer" }}
                  >
                    Don't have an account? Register
                  </Link>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={clearError} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
