// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

// Definisci il tuo tema personalizzato
const theme = createTheme({
    palette: {
        primary: {
            main: '#0B132B',  // Colore scuro per lo sfondo/elementi principali
        },
        secondary: {
            main: '#F0A500',  // Colore accent per pulsanti e dettagli
        },
        background: {
            default: '#1C1C1C',  // Sfondo generale scuro
            paper: '#2C2C2C',    // Sfondo dei Paper e container
        },
        text: {
            primary: '#FFFFFF',  // Testo bianco su sfondi scuri
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '0.05em',
        },
        body1: {
            fontSize: '1rem',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    textTransform: 'none',
                    padding: '12px 24px',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 0 10px rgba(240,165,0,0.5)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: '#F0A500',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: '#F0A500',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#2C2C2C',
                },
            },
        },
    },
});

export default theme;
