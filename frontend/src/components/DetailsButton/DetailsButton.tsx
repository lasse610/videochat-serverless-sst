import React from 'react';

import { Button, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

interface DetailsButtonProps {
  showSidebar: boolean;
  setShowSidebar: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}
function DetailsButton(props: DetailsButtonProps) {
  const { showSidebar, setShowSidebar } = props;

  const handleClick = () => {
    setShowSidebar(prevValue => !prevValue);
  };

  return (
    <Button
      onClick={handleClick}
      sx={{
        marginRight: 'auto',
        backgroundColor: 'white',
        textTransform: 'none',
        minHeight: '50px',
        borderTopRightRadius: '30px',
        borderBottomRightRadius: '30px',
      }}
      endIcon={
        showSidebar ? (
          <ArrowBackIosNewOutlinedIcon sx={{ marginRight: '10px' }} />
        ) : (
          <ArrowForwardIosIcon sx={{ marginRight: '10px' }} />
        )
      }
    >
      <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}>
        Details
      </Typography>
    </Button>
  );
}

export default DetailsButton;
