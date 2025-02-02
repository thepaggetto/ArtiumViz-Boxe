import React from 'react';
import { Container, Typography } from '@mui/material';

const DashboardPage = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="body1">
                Benvenuto nella Dashboard.
            </Typography>
        </Container>
    );
};

export default DashboardPage;
