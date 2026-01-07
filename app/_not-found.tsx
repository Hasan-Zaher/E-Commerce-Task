

'use client'

import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';

 
export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h1" sx={{ fontWeight: 700, mb: 2 }}>404</Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>Page Not Found</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" component={Link} href="/" startIcon={<HomeIcon />} sx={{ fontWeight: 600 }}>
        Back to Home
      </Button>
    </Container>
  );
}