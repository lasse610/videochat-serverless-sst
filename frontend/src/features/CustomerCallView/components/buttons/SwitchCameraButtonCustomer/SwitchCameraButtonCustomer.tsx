import React from 'react';
import { IconButton } from '@mui/material';
import CameraswitchOutlinedIcon from '@mui/icons-material/CameraswitchOutlined';
import useFlipCameraToggle from 'src/hooks/useFlipCameraToggle/useFlipCameraToggle';

export default function SwitchCameraButtonCustomer() {
  const {
    flipCameraDisabled,
    toggleFacingMode,
    flipCameraSupported,
  } = useFlipCameraToggle();
  return <>
    {flipCameraSupported && (
      <IconButton
        onClick={toggleFacingMode}
        disabled={flipCameraDisabled}
        sx={{ color: 'grey', backgroundColor: 'white' }}
        size="large">
        <CameraswitchOutlinedIcon />
      </IconButton>
    )}
  </>;
}
