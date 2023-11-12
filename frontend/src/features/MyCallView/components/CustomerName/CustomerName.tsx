import { Typography } from '@mui/material';
import React from 'react';

interface CustomerNameProps {
  name: string;
}

export default function CustomerName({ name }: CustomerNameProps) {
  return (
    <Typography sx={{ fontSize: '3em', fontWeight: 'bold' }}>{name}</Typography>
  );
}
