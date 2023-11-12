import React from 'react';
import { Box } from '@mui/system';

import MarkerButton from '../buttons/MarkerButton/MarkerButton';
import LaserPointerButton from '../buttons/LaserPointerButton/LaserPointerButton';
interface DrawToolsContainerProps {
  isUsingMarker: boolean;
  setIsUsingMarker: React.Dispatch<React.SetStateAction<boolean>>;
}
function DrawToolsContainer(props: DrawToolsContainerProps) {
  const { isUsingMarker, setIsUsingMarker } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '10px',
        backgroundColor: 'white',
        borderRadius: '50px',
      }}
    >
      <LaserPointerButton
        isUsingMarker={isUsingMarker}
        setIsUsingMarker={setIsUsingMarker}
      />
      <MarkerButton
        isUsingMarker={isUsingMarker}
        setIsUsingMarker={setIsUsingMarker}
      />
    </Box>
  );
}

export default DrawToolsContainer;
