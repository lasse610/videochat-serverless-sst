import React from 'react';
import { Typography } from '@mui/material';

interface CallDurationProps {
  time: string;
}

function CallDuration({ time }: CallDurationProps) {
  return (
    <Typography sx={{ width: '50px', fontWeight: '600' }}>{time}</Typography>
  );
}

export default CallDuration;
