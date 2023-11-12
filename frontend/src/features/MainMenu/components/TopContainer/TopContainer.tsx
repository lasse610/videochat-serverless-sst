import React from 'react';
import { Box } from '@mui/material';
import InviteButton from '../InviteButton/InviteButton';
import CallsButton from '../CallsButton/CallsButton';

interface TopContainerProps {
  inviteVisibility: boolean;
  setInviteVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TopContainer({
  inviteVisibility,
  setInviteVisibility,
}: TopContainerProps) {
  return (
    <Box
      sx={{
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      <InviteButton
        inviteVisibility={inviteVisibility}
        setInviteVisibility={setInviteVisibility}
      />
      <CallsButton />
    </Box>
  );
}
