import React from 'react';
import { Box } from '@mui/system';

import AudioToggle from '../buttons/AudioToggle/AudioToggle';
import LocationMarker from '../buttons/LocationMarker/LocationMarker';
import DisconnectButton from '../buttons/DisconnectButton/DisconnectButton';

interface MenuRightSideContainerProps {
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
}

export default function MenuRightSideContainer({
  setLatitude,
  setLongitude,
}: MenuRightSideContainerProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        border: 'solid',
        borderColor: 'white',
        borderTopLeftRadius: '30px',
        borderBottomLeftRadius: '30px',
        maxWidth: '20%',
        gap: '10px',
        minWidth: '270px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <AudioToggle />
      <LocationMarker setLongitude={setLongitude} setLatitude={setLatitude} />
      <DisconnectButton />
    </Box>
  );
}
