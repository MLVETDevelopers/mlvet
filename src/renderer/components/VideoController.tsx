import { styled, Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import PauseIcon from '@mui/icons-material/Pause';
import { useState } from 'react';
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
  // column-gap: 24px;
`;

const VideoController = () => {
  const [playVideo, setPlayState] = useState(false);

  const togglePlayButton = () => {
    if (playVideo) {
      return (
        <PlayArrowIcon sx={{ fontSize: '42px', color: colors.yellow[500] }} />
      );
    }
    return <PauseIcon sx={{ fontSize: '42px', color: colors.yellow[500] }} />;
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
        }}
      >
        00:00:00
      </div>
      <IconButton>
        <Replay10Icon sx={{ fontSize: '36px', color: colors.grey[400] }} />
      </IconButton>
      <IconButton onClick={() => setPlayState(!playVideo)}>
        {togglePlayButton()}
      </IconButton>
      <IconButton>
        <Forward10Icon sx={{ fontSize: '36px', color: colors.grey[400] }} />
      </IconButton>
    </VideoControllerBox>
  );
};

export default VideoController;
