import React from 'react';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { IconButton } from '@mui/material';
interface LaserPointerProps {
  isUsingMarker: boolean;
  setIsUsingMarker: React.Dispatch<React.SetStateAction<boolean>>;
}

function LaserPointerButton(props: LaserPointerProps) {
  const { isUsingMarker, setIsUsingMarker } = props;

  const handleClick = () => {
    setIsUsingMarker(false);
  };

  return (
    <IconButton
      onClick={handleClick}
      sx={{ backgroundColor: isUsingMarker ? 'white' : '#2D6FF3' }}
      size="large">
      <GpsFixedIcon sx={{ color: !isUsingMarker ? 'white' : 'primary.main' }} />
    </IconButton>
  );
}

export default LaserPointerButton;
