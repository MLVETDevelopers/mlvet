import {
  Forward10,
  Pause,
  PlayArrow,
  Replay10,
  SkipPrevious,
} from '@mui/icons-material';
import { Box, IconButton, styled } from '@mui/material';
import { secondToTimestampUI } from 'main/timeUtils';
import colors from '../colors';

const VideoControllerBox = styled(Box)`
  background: ${colors.grey[700]};
  color: ${colors.grey[300]};
  height: 62px;
  width: 100vw;
  margin: 0;
  padding: 11px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface TogglePlayButtonProps {
  isPlaying: boolean;
}

const TogglePlayButton = ({ isPlaying }: TogglePlayButtonProps) => {
  if (!isPlaying) {
    return <PlayArrow sx={{ fontSize: '42px', color: colors.yellow[500] }} />;
  }
  return <Pause sx={{ fontSize: '42px', color: colors.yellow[500] }} />;
};

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
  const onClickPlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <VideoControllerBox>
      <div
        style={{
          backgroundColor: colors.grey[600],
          fontWeight: 'regular',
          fontSize: '28px',
          borderRadius: '5px',
          padding: '0 19px',
          marginRight: '47px',
          width: '152px',
          textAlign: 'left',
        }}
      >
        {secondToTimestampUI(time)}
      </div>
      <IconButton onClick={seekBack}>
        <Replay10 sx={{ fontSize: '36px', color: colors.grey[400] }} />
      </IconButton>
      <IconButton onClick={onClickPlayPause}>
        <TogglePlayButton isPlaying={isPlaying} />
      </IconButton>
      <IconButton onClick={seekForward}>
        <Forward10 sx={{ fontSize: '36px', color: colors.grey[400] }} />
      </IconButton>
    </VideoControllerBox>
  );
};

export default VideoController;
