import React from 'react';
import { Box } from '@mui/system';
import AudioButtonCustomer from '../buttons/AudioButtonCustomer/AudioButtonCustomer';
import EndCallButtonCustomer from '../buttons/EndCallButtonCustomer/EndCallButtonCustomer';
import SwitchCameraButtonCustomer from '../buttons/SwitchCameraButtonCustomer/SwitchCameraButtonCustomer';
import useRoomState from 'src/hooks/useRoomState/useRoomState';

export default function CustomerMenuBar() {
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';

  return (
    <footer>
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
          zIndex: 10,
        }}
      >
        <AudioButtonCustomer disabled={isReconnecting} />
        <EndCallButtonCustomer />
        <SwitchCameraButtonCustomer />
      </Box>
    </footer>
  );
}

/*


*/
