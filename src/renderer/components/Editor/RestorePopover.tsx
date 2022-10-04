import { SubdirectoryArrowLeft } from '@mui/icons-material';
import { Box, Popper, Stack, styled, Typography } from '@mui/material';
import React, { RefObject } from 'react';
import colors from 'renderer/colors';
import TextTruncate from 'react-text-truncate';
import { getTextWidth } from 'renderer/utils/ui';
import { useEventListener, useKeypress } from 'renderer/utils/hooks';

interface RestorePopoverProps {
  text: string;
  anchorEl: HTMLElement | null;
  onClickAway: (event: Event | null) => void;
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
    onClickAway(null);
    restoreText();
  };

  // Restores text when enter is pressed.
  useKeypress(restoreDeletedTake, Boolean(anchorEl), ['Enter', 'NumpadEnter']);

  const paddingPx = 8;

  const isTruncated =
    (getTextWidth(text, '400 Rubik 1rem') ?? 0) > (width || 0) - paddingPx * 2;

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
          overflow: 'hidden',
          height: 53,
          maxWidth: width,
          padding: `${paddingPx}px`,
          borderRadius: '5px',
          color: colors.yellow[500],
          border: 0.5,
        }}
      >
        <Stack alignItems="flex-end">
          <Box sx={{ alignSelf: 'flex-start', color: colors.yellow[500] }}>
            {isTruncated ? (
              <TextTruncate line={1} truncateText="…" text={text} />
            ) : (
              text
            )}
          </Box>
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
