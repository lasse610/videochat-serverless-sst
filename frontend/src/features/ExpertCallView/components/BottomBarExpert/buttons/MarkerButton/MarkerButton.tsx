import React from 'react';
import BrushIcon from '@mui/icons-material/Brush';
import { IconButton } from '@mui/material';

interface MarkerButtonProps {
  isUsingMarker: boolean;
  setIsUsingMarker: React.Dispatch<React.SetStateAction<boolean>>;
}

function MarkerButton(props: MarkerButtonProps) {
  const { isUsingMarker, setIsUsingMarker } = props;

  const handleClick = () => {
    setIsUsingMarker(true);
  };

  return (
    <IconButton
      onClick={handleClick}
      sx={{ backgroundColor: isUsingMarker ? '#2D6FF3' : 'white' }}
      size="large">
      <BrushIcon sx={{ color: isUsingMarker ? 'white' : 'primary.main' }} />
    </IconButton>
  );
}

export default MarkerButton;
