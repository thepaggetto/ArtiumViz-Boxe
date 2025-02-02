import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const HeaderMenu = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Rimuovi il token di autenticazione (o altri dati utente) e reindirizza al login
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    ArtiumViz Boxe
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/">
                        Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/competitions">
                        Gare
                    </Button>
                    <Button color="inherit" component={Link} to="/settings">
                        Impostazioni
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderMenu;
