import {
  Box,
  ClickAwayListener,
  Popper,
  styled,
  Typography,
} from '@mui/material';
import { RefObject, useRef } from 'react';
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
  const arrowRef = useRef(null);

  const styles = {
    arrow: {
      position: 'absolute',
      fontSize: 7,
      width: '3em',
      height: '3em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid',
      },
    },
  };

  const StyledPopper = styled(Popper)(() => ({
    zIndex: 1,
    width: width || '40%',
    backgroundColor: colors.grey[600],
    borderWidth: '0.5px',
    borderColor: colors.yellow[500],

    borderRadius: '5px',
  }));

  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <StyledPopper
        id="restore-popper"
        anchorEl={anchorEl}
        open={open}
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
