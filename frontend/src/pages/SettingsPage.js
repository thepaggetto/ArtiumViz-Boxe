import React from 'react';
import { Container, Typography } from '@mui/material';

const SettingsPage = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>
            <Typography variant="body1">
                Questa è la pagina delle impostazioni.
            </Typography>
        </Container>
    );
};

export default SettingsPage;
