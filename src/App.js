// frontend/src/App.js
import React from 'react';
import CompetitionList from './components/CompetitionList';
import { Container, Typography } from '@mui/material';

function App() {
  return (
      <Container maxWidth="md" style={{ marginTop: 20 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Creazione Gare per Singular.Live
        </Typography>
        <CompetitionList />
      </Container>
  );
}

export default App;
