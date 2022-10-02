import { SubdirectoryArrowLeft } from '@mui/icons-material';
import { Box, Popper, Stack, styled, Typography } from '@mui/material';
import React, { RefObject } from 'react';
import colors from 'renderer/colors';
import { useEventListener, useKeypress } from 'renderer/utils/hooks';

interface RestorePopoverProps {
  text: string;
  anchorEl: HTMLElement | null;
  onClickAway: (event?: any) => void;
  width: number | null;
  transcriptionBlockRef: RefObject<HTMLElement>;
  restoreText: () => void;
}

const RestorePopover = ({
  text,
  anchorEl,
  onClickAway,
  width,
  transcriptionBlockRef,
  restoreText,
}: RestorePopoverProps) => {
  // Restores text, and updates clears rangeOverride
  const restoreDeletedTake = () => {
    onClickAway();
    restoreText();
  };

  // Restores text when enter is pressed.
  useKeypress(restoreDeletedTake, Boolean(anchorEl), ['Enter', 'NumpadEnter']);

  const StyledPopper = styled(Popper)(() => ({
    zIndex: 1,
    maxWidth: width || '40%',
    backgroundColor: colors.grey[600],
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '5px',
  }));

  useEventListener('mouseup', onClickAway);

  return (
    <StyledPopper
      id="restore-popper"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
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
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          height: 53,
          maxWidth: width,
          padding: '8px',
          borderRadius: '5px',
          color: colors.yellow[500],
          border: 0.5,
        }}
      >
        <Stack alignItems="flex-end">
          <Typography style={{ color: colors.yellow[500] }} noWrap>
            {text}
          </Typography>
          <Typography
            variant="caption"
            style={{ color: colors.grey[400], fontStyle: 'italic' }}
          >
            Enter to restore&nbsp;
            <SubdirectoryArrowLeft
              sx={{
                fontSize: '12px',
                color: colors.grey[400],
              }}
            />
          </Typography>
        </Stack>
      </Box>
    </StyledPopper>
  );
};

export default React.memo(RestorePopover);
