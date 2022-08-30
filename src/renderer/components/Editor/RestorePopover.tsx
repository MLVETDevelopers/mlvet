import {
  Box,
  ClickAwayListener,
  Popper,
  styled,
  Typography,
} from '@mui/material';
import { RefObject } from 'react';
import colors from 'renderer/colors';

interface RestorePopoverProps {
  text: string;
  anchorEl: HTMLElement | null;
  onClickAway: () => void;
  width: number | null;
  transcriptionBlockRef: RefObject<HTMLElement>;
}

const RestorePopover = ({
  text,
  anchorEl,
  onClickAway,
  width,
  transcriptionBlockRef,
}: RestorePopoverProps) => {
  const StyledPopper = styled(Popper)(() => ({
    zIndex: 1,
    width: width || '40%',
    backgroundColor: colors.grey[600],
    borderWidth: '0.5px',
    borderColor: colors.yellow[500],
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '5px',
  }));

  // const open = Boolean(anchorEl);

  console.log('popper');

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <StyledPopper
        id="restore-popper"
        anchorEl={anchorEl}
        open
        placement="top"
        modifiers={[
          {
            name: 'preventOverflow',
            options: {
              boundary: transcriptionBlockRef.current,
            },
          },
        ]}
      >
        <Box
          sx={{
            whiteSpace: 'normal',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            height: 40,
            width,
            padding: '8px',
          }}
        >
          <Typography noWrap>{text}</Typography>
        </Box>
      </StyledPopper>
    </ClickAwayListener>
  );
};

export default RestorePopover;
