import React from 'react';
import { Box } from '@mui/system';

import AudioButtonCustomer from '../buttons/AudioButtonCustomer/AudioButtonCustomer';
import EndCallButtonCustomer from '../buttons/EndCallButtonCustomer/EndCallButtonCustomer';
import SwitchCameraButtonCustomer from '../buttons/SwitchCameraButtonCustomer/SwitchCameraButtonCustomer';

function CustomerBottomBar() {
  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px',
        height: '10%',
        width: '100%',
        bottom: '5%',
      }}
    >
      <AudioButtonCustomer />
      <EndCallButtonCustomer />
      <SwitchCameraButtonCustomer />
    </Box>
  );
}

export default CustomerBottomBar;
