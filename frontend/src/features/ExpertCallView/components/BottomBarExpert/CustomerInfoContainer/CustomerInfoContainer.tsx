import React from 'react';
import { Box } from '@mui/system';

import CustomerAudioIcon from '../CustomerAudioIcon/CustomerAudioIcon';
import CustomerName from '../CustomerName/CustomerName';
import CallDuration from '../CallDuration/CallDuration';

interface CustomerInfoContainerProps {
  customerName: string;
  time: string;
}

function CustomerInfoContainer({
  customerName,
  time,
}: CustomerInfoContainerProps) {
  return (
    <Box
      sx={{
        marginLeft: 'auto',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      <CustomerAudioIcon />
      <CustomerName customerName={customerName} />
      <CallDuration time={time} />
    </Box>
  );
}

export default CustomerInfoContainer;
