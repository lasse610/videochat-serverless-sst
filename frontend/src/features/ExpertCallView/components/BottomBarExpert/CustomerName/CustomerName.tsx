import React from 'react';
import { Typography } from '@mui/material';

interface CustomerNameProps {
  customerName: string;
}

function CustomerName({ customerName }: CustomerNameProps) {
  return <Typography sx={{ fontSize: '14px' }}>{customerName}</Typography>;
}

export default CustomerName;
