import { Forward10, Pause, PlayArrow, Replay10 } from '@mui/icons-material';
import { Box, IconButton, styled } from '@mui/material';
import { secondToTimestampUI } from 'main/timeUtils';
import React, { useCallback, useMemo } from 'react';
import colors from '../../colors';

const TimeDisplay = styled(Box)({
  backgroundColor: colors.grey[600],
  fontWeight: 'regular',
  fontSize: '24px',
  borderRadius: '5px',
  padding: '0 19px',
  marginRight: '47px',
  width: '152px',
  textAlign: 'left',
  fontFamily: '"Roboto Mono", monospace',
});

interface TogglePlayButtonProps {
  isPlaying: boolean;
}

const TogglePlayButton = React.memo(({ isPlaying }: TogglePlayButtonProps) => {
  if (isPlaying) {
    return <Pause sx={{ fontSize: '42px', color: colors.yellow[500] }} />;
  }
  return <PlayArrow sx={{ fontSize: '42px', color: colors.yellow[500] }} />;
});

interface Props {
  time: number;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  seekForward: () => void;
  seekBack: () => void;
}

const VideoController = ({
  time,
  isPlaying,
  play,
  pause,
  seekForward,
  seekBack,
}: Props) => {
  const onClickPlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [pause, play, isPlaying]);

  const timeDisplay = useMemo(() => secondToTimestampUI(time), [time]);

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <TimeDisplay>{timeDisplay}</TimeDisplay>
      <IconButton onClick={seekBack}>
        <Replay10 sx={{ fontSize: '36px', color: colors.grey[300] }} />
      </IconButton>
      <IconButton onClick={onClickPlayPause}>
        <TogglePlayButton isPlaying={isPlaying} />
      </IconButton>
      <IconButton onClick={seekForward}>
        <Forward10 sx={{ fontSize: '36px', color: colors.grey[300] }} />
      </IconButton>
    </Box>
  );
};

export default React.memo(VideoController);
