import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const navigate              = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Effettua la chiamata al backend per il login
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password })

            const token = response.data.token;
            // Salva il token (o altri dati utente) in localStorage
            localStorage.setItem('token', token);
            // Reindirizza l'utente alla dashboard (o a un'altra pagina protetta)
            navigate('/competitions');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    p: 4,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    boxShadow: 2,
                }}
            >
                {/* Inserisci il logo qui */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <img
                        src="/Logo_AV_Boxeav.svg"  // Questo punta al file nella cartella public
                        alt="Logo ArtiumViz"
                        style={{ maxWidth: '200px' }}
                    />
                </Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default LoginPage;
