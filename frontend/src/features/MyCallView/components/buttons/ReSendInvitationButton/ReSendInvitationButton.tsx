import React from 'react';
import { Button } from '@mui/material';
import AddIcCallOutlinedIcon from '@mui/icons-material/AddIcCallOutlined';

interface ReSendInvitationButtonProps {
  number: string | undefined;
}

export default function ReSendInvitationButton({
  number,
}: ReSendInvitationButtonProps) {
  return (
    <Button
      sx={{ textTransform: 'none', display: number ? 'flex' : 'none' }}
      startIcon={<AddIcCallOutlinedIcon sx={{ color: 'black' }} />}
    >
      Re-send invitation
    </Button>
  );
}
