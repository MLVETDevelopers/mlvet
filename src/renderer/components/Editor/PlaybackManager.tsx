import {
  Dispatch,
  ReactElement,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { RuntimeProject } from 'sharedTypes';
import { bufferedWordDuration, isInInactiveTake } from 'sharedUtils';
import { VideoPreviewControllerRef } from '../VideoPreview/VideoPreviewController';

type ChildFunction = (
  time: number,
  setTime: Dispatch<SetStateAction<number>>,
  isPlaying: boolean,
  setIsPlaying: Dispatch<SetStateAction<boolean>>,
  nowPlayingWordIndex: number,
  play: () => void,
  pause: () => void,
  seekForward: () => void,
  seekBack: () => void,
  setPlaybackTime: (newPlaybackTime: number) => void
) => ReactElement;

interface Props {
  videoPreviewControllerRef: RefObject<VideoPreviewControllerRef>;
  currentProject: RuntimeProject | null;
  children: ChildFunction;
}

const PlaybackManager = ({
  videoPreviewControllerRef,
  currentProject,
  children,
}: Props) => {
  // UI states
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlayingWordIndex, setNowPlayingWordIndex] = useState<number>(0);

  const play = useCallback(
    () => videoPreviewControllerRef?.current?.play(),
    [videoPreviewControllerRef]
  );

  const pause = useCallback(
    () => videoPreviewControllerRef?.current?.pause(),
    [videoPreviewControllerRef]
  );

  const setPlaybackTime = useCallback(
    (newPlaybackTime: number) =>
      videoPreviewControllerRef?.current?.setPlaybackTime(newPlaybackTime),
    [videoPreviewControllerRef]
  );

  const seekForward = useCallback(
    () => videoPreviewControllerRef?.current?.seekForward(),
    [videoPreviewControllerRef]
  );

  const seekBack = useCallback(
    () => videoPreviewControllerRef?.current?.seekBack(),
    [videoPreviewControllerRef]
  );

  // TODO: Look into optimisations
  useEffect(() => {
    if (currentProject === null || currentProject?.transcription === null) {
      return;
    }

    const newPlayingWordIndex = currentProject.transcription.words.findIndex(
      (word) =>
        time >= word.outputStartTime &&
        time < word.outputStartTime + bufferedWordDuration(word) &&
        !word.deleted &&
        !isInInactiveTake(word, currentProject.transcription?.takeGroups ?? [])
    );

    if (newPlayingWordIndex !== nowPlayingWordIndex) {
      setNowPlayingWordIndex(newPlayingWordIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, currentProject?.transcription]);

  return useMemo(
    () =>
      children(
        time,
        setTime,
        isPlaying,
        setIsPlaying,
        nowPlayingWordIndex,
        play,
        pause,
        seekForward,
        seekBack,
        setPlaybackTime
      ),
    [
      time,
      setTime,
      isPlaying,
      setIsPlaying,
      nowPlayingWordIndex,
      play,
      pause,
      seekForward,
      seekBack,
      setPlaybackTime,
      children,
    ]
  );
};

export default PlaybackManager;
