import React, { useEffect } from 'react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import useRequestLocation from 'src/features/ExpertCallView/hooks/useRequestLocation/useRequestLocation';

interface LocationMarkerProps {
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
}

export default function LocationMarker({
  setLatitude,
  setLongitude,
}: LocationMarkerProps) {
  const {
    requestLocation,
    isDisabled,
    isLoading,
    location,
  } = useRequestLocation();

  useEffect(() => {
    if (location) {
      setLatitude(location.latitude);
      setLongitude(location.longitude);
    }
  }, [location, setLongitude, setLatitude]);
  return (
    <Tooltip
      sx={{ zIndex: 100 }}
      open={!!location}
      title={
        location
          ? `Received Location ${location.longitude}, ${location.latitude}`
          : 'No location received'
      }
      placement="top"
      arrow
    >
      <IconButton
        sx={{ color: 'primary.main' }}
        onClick={requestLocation}
        disabled={isDisabled || isLoading}
        size="large"
      >
        {isLoading ? <CircularProgress /> : <LocationOnOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}
