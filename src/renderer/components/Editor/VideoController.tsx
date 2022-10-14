import { Forward10, Pause, PlayArrow, Replay10 } from '@mui/icons-material';
import { Box, IconButton, styled } from '@mui/material';
import { secondToTimestampUI } from 'main/timeUtils';
import React, { useCallback, useMemo } from 'react';
import colors from '../../colors';
import MenuBarButton from './MenuBarButton';
import ProjectTooltip from './ProjectTooltip';

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
      <MenuBarButton onClick={seekBack} text="Seek backwards 10 seconds">
        <Replay10 sx={{ fontSize: '36px' }} />
      </MenuBarButton>
      <MenuBarButton
        onClick={onClickPlayPause}
        text={isPlaying ? 'Pause' : 'Play'}
      >
        <TogglePlayButton isPlaying={isPlaying} />
      </MenuBarButton>
      <MenuBarButton onClick={seekForward} text="Seek forward 10 seconds">
        <Forward10 sx={{ fontSize: '36px' }} />
      </MenuBarButton>
    </Box>
  );
};

export default React.memo(VideoController);
