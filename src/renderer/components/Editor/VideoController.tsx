import { Forward10, Pause, PlayArrow, Replay10 } from '@mui/icons-material';
import { Box, IconButton, styled } from '@mui/material';
import { secondToTimestampUI } from 'main/timeUtils';
import React, { useMemo } from 'react';
import togglePlayPause from 'renderer/editor/togglePlayPause';
import skipForward from 'renderer/editor/skipForward';
import skipBackward from 'renderer/editor/skipBackward';
import colors from '../../colors';

const VideoControllerBox = styled(Box)({
  background: colors.grey[700],
  color: colors.grey[300],
  height: '62px',
  width: '100vw',
  margin: 0,
  padding: '11px 0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

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
}

const VideoController = ({ time, isPlaying }: Props) => {
  const timeDisplay = useMemo(() => secondToTimestampUI(time), [time]);
  return (
    <VideoControllerBox>
      <TimeDisplay>{timeDisplay}</TimeDisplay>
      <IconButton onClick={skipBackward}>
        <Replay10 sx={{ fontSize: '36px', color: colors.grey[400] }} />
      </IconButton>
      <IconButton onClick={togglePlayPause}>
        <TogglePlayButton isPlaying={isPlaying} />
      </IconButton>
      <IconButton onClick={skipForward}>
        <Forward10 sx={{ fontSize: '36px', color: colors.grey[400] }} />
      </IconButton>
    </VideoControllerBox>
  );
};

export default React.memo(VideoController);
