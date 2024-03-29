import { useRef, forwardRef, useImperativeHandle, Ref } from 'react';
import { Replay } from 'vimond-replay';
import {
  PlaybackActions,
  VideoStreamState,
} from 'vimond-replay/default-player/Replay';
import './videoPreview.css';

interface Props {
  src: string;
}

export interface VideoPreviewRef {
  play: () => void;
  pause: () => void;
  setCurrentTime: (newTime: number) => void;
}

const VideoPreviewBase = ({ src }: Props, ref: Ref<VideoPreviewRef>) => {
  const videoActions = useRef<null | PlaybackActions>(null);

  const setCurrentTime = (newTime: number) =>
    videoActions?.current?.setPosition(newTime);

  const pause = () => {
    videoActions?.current?.pause();
  };

  const play = () => {
    videoActions?.current?.play();
  };

  useImperativeHandle(ref, () => ({ setCurrentTime, pause, play }));

  const handlePlaybackActionsReady = (params: PlaybackActions) => {
    videoActions.current = params;
  };

  const handleStreamStateChange = (stateProperties: VideoStreamState) => {
    if (stateProperties) {
      if (stateProperties.isPaused) {
        // console.log('Stream observation example: The playback was paused.');
      }
      if (stateProperties.isPaused === false) {
        // console.log('Stream observation example: The playback was resumed.');
      }
    }
  };

  return (
    <Replay
      source={src}
      options={{
        controls: {
          includeControls: [],
        },
        keyboardShortcuts: {
          keyMap: {
            togglePause: [],
            toggleFullscreen: '',
            decreaseVolume: '',
            increaseVolume: '',
            skipBack: '',
            skipForward: '',
            toggleMute: '',
          },
        },
      }}
      initialPlaybackProps={{ isPaused: true }}
      onStreamStateChange={handleStreamStateChange}
      onPlaybackActionsReady={handlePlaybackActionsReady}
    />
  );
};

const VideoPreview = forwardRef(VideoPreviewBase);

export default VideoPreview;
