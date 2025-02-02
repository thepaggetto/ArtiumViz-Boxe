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
                {/* Box per logo e titolo */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    {/* Logo: il file deve essere in public/logo.svg */}
                    <img
                        src="/Logo_AV_Boxeav.svg"  //
                        alt="ArtiumViz Boxe Logo"
                        style={{ maxHeight: '50px', marginRight: '10px', marginBottom: '2px' }}
                    />

                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/competitions">
                        Gare
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