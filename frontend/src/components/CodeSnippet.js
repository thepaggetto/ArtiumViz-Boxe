// frontend/src/components/CodeSnippet.js
import React, { useState } from 'react';
import { Button, Paper, TextField } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CodeSnippet = ({ code }) => {
    const [copied, setCopied] = useState(false);

    return (
        <Paper style={{ position: 'relative', padding: 20, backgroundColor: '#f5f5f5' }}>
            <TextField
                multiline
                fullWidth
                value={code}
                InputProps={{ readOnly: true }}
                variant="outlined"
                rows={10}
            />

        </Paper>
    );
};

export default CodeSnippet;
