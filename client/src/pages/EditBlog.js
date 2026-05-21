import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';

const EditBlog = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
          Edit Blog Page - Coming Soon
        </Typography>
      </Container>
    </Box>
  );
};

export default EditBlog; 