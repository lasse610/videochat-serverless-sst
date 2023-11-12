import React from 'react';
import { Box } from '@mui/material';
import Invitation from '../Invitation/Invitation';

interface InviteOverlayProps {
  inviteVisibility: boolean;
  setInviteVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InviteOverlay({
  inviteVisibility,
  setInviteVisibility,
}: InviteOverlayProps) {
  function handleClick() {
    setInviteVisibility(visibility => !visibility);
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: inviteVisibility ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {inviteVisibility && (
        <Invitation setInviteVisibility={setInviteVisibility} />
      )}
    </Box>
  );
}
