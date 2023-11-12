import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '../../icons/ErrorIcon';
import { IconButton, Typography } from '@mui/material';

import MUISnackbar from '@mui/material/Snackbar';
import WarningIcon from '../../icons/WarningIcon';
import InfoIcon from '../../icons/InfoIcon';

interface SnackbarProps {
  headline: string;
  message: string | React.ReactNode;
  variant?: 'error' | 'warning' | 'info';
  open: boolean;
  handleClose?: () => void;
}

export default function Snackbar({
  headline,
  message,
  variant,
  open,
  handleClose,
}: SnackbarProps) {
  const handleOnClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    handleClose?.();
  };

  return (
    <MUISnackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={handleOnClose}
      autoHideDuration={10000}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '400px',
          minHeight: '50px',
          background: 'white',
          padding: '1em',
          borderRadius: '3px',
          boxShadow: '0 12px 24px 4px rgba(40,42,43,0.2)',
          borderLeft: '4px solid #D61F1F',
        }}
      >
        <div style={{ display: 'flex', lineHeight: 1.8 }}>
          <div
            style={{
              display: 'flex',
              padding: '0 1.3em 0 0.3em',
              transform: 'translateY(3px)',
            }}
          >
            {variant === 'warning' && <WarningIcon />}
            {variant === 'error' && <ErrorIcon />}
            {variant === 'info' && <InfoIcon />}
          </div>
          <div>
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold' }}
              component="span"
            >
              {headline}
            </Typography>
            <Typography variant="body1" component="span">
              {' '}
              {message}
            </Typography>
          </div>
        </div>
        <div>
          {handleClose && (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
    </MUISnackbar>
  );
}
