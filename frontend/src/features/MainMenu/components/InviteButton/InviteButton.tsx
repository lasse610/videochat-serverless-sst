import React from 'react';
import CallIcon from '@mui/icons-material/Call';
import { Button } from '@mui/material';

interface InviteButtonProps {
  inviteVisibility: boolean;
  setInviteVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InviteButton({
  inviteVisibility,
  setInviteVisibility,
}: InviteButtonProps) {
  function handleClick() {
    setInviteVisibility(visibility => !visibility);
  }

  return (
    <Button
      onClick={handleClick}
      startIcon={<CallIcon />}
      sx={{
        backgroundColor: 'white',
        borderRadius: '100px',
        paddingX: '40px',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: 'lightGray',
        },
      }}
    >
      Invite
    </Button>
  );
}
