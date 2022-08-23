import { Box, Popover, Typography } from '@mui/material';
import { useState } from 'react';
import colors from '../../colors';

interface RestorePopoverProps {
  text: string;
}

const RestorePopover = ({ text }: RestorePopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Popover
      id="restore-popover"
      open={open}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderRadius: 0,
        },
      }}
    >
      <Typography
        sx={{
          p: 2,
          backgroundColor: colors.grey[600],
          border: 0.5,
          color: colors.yellow[500],
        }}
        noWrap
      >
        {text}
      </Typography>
      <Box
        sx={{
          position: 'relative',
          mt: '10px',
          '&::before': {
            backgroundColor: colors.grey[600],
            content: '""',
            display: 'block',
            position: 'absolute',
            width: 9.5,
            height: 9.5,
            top: -15,
            transform: 'rotate(45deg)',
            left: 'calc(50% - 6px)',
            borderBottom: 0.5,
            borderRight: 0.5,
            borderColor: colors.yellow[500],
          },
        }}
      />
    </Popover>
  );
};

export default RestorePopover;
