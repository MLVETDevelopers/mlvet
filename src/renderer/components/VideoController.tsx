import { styled, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
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
  column-gap: 24px;
`;

const VideoController = () => {
  return (
    <VideoControllerBox>
      <div
        style={{
          backgroundColor: colors.grey[600],
          fontWeight: 'bold',
          fontSize: '24px',
          borderRadius: '5px',
          padding: '0 19px',
        }}
      >
        00:00:00
      </div>
      <Replay10Icon sx={{ fontSize: '36px' }} />
      <PlayArrowIcon sx={{ fontSize: '42px', color: colors.yellow[500] }} />
      <Forward10Icon sx={{ fontSize: '36px' }} />
    </VideoControllerBox>
  );
};

export default VideoController;
