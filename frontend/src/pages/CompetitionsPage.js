import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Modal } from '@mui/material';
import axios from 'axios';
import CompetitionList from '../components/CompetitionList';
import CompetitionWizard from '../components/CompetitionWizard';

const CompetitionsPage = () => {
    const [competitions, setCompetitions] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // URL del backend, senza riferimenti a localhost!
    const API_URL = process.env.REACT_APP_API_URL || 'http://api.artiumvix.com';

    const fetchCompetitions = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/competitions`);
            setCompetitions(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Errore nel recupero delle competizioni:', error);
            setCompetitions([]); // Prevenzione errori se la risposta non è un array
        }
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const handleSave = () => {
        fetchCompetitions();
        setModalOpen(false);
        setSelectedCompetition(null);
    };

    const handleEdit = (competition) => {
        setSelectedCompetition(competition);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedCompetition(null);
        setModalOpen(true);
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} mt={4}>
                <Typography variant="h4" component="h1">
                    Gestione Match
                </Typography>
            </Box>

            <CompetitionList competitions={competitions} onEdit={handleEdit} />

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 600 },
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 24,
                    }}
                >
                    <CompetitionWizard competition={selectedCompetition} onSave={handleSave} />
                </Box>
            </Modal>
        </Container>
    );
};

export default CompetitionsPage;
