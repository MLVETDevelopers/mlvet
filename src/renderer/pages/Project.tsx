import { Box, Stack } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TranscriptionBlock from 'renderer/components/TranscriptionBlock';
import VideoController from 'renderer/components/VideoController';
import VideoPreviewController, {
  VideoPreviewControllerRef,
} from 'renderer/components/VideoPreview/VideoPreviewController';
import ResizeSlider from 'renderer/components/ResizeSlider';
import { useDebounce } from '@react-hook/debounce';
import { useWindowResizer } from 'renderer/utils/hooks';
import { clamp } from 'main/timeUtils';
import ExportCard from '../components/ExportCard';
import { ApplicationStore } from '../store/sharedHelpers';
import { bufferedWordDuration } from '../../sharedUtils';

/*
This is the page that gets displayed while you are editing a video.
It will be primarily composed of the transcription area, an editable text box whose
changes get reflected in the video. In addition to that, there is a video preview
section to the side among other things.
*/
const ProjectPage = () => {
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );
  const { isExporting, exportProgress } = useSelector(
    (store: ApplicationStore) => store.exportIo
  );

  // UI states
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlayingWordIndex, setNowPlayingWordIndex] = useState<number>(0);
  const [videoPreviewContainerWidth, setVideoPreviewContainerWidth] =
    useDebounce(400, 0.1);

  const [pageWidth, setPageWidth] = useState<number>(1000);
  const videoPreviewControllerRef = useRef<VideoPreviewControllerRef>(null);

  useMemo(() => setPageWidth(window.innerWidth), []);

  const pageResizeHandler = useCallback(
    (width) => setPageWidth(width),
    [setPageWidth]
  );

  useWindowResizer(pageResizeHandler);

  const videoPreviewOptions = useRef({
    minTranscriptionWidth: 120,
    minVideoPreviewWidth: 120,
  });

  // A manual way of calculating the min and max width of the viedeo preview container.
  // Will need to be updated if styling changes are made to avoid bugs
  const videoPreviewResizeOptions = useMemo(() => {
    const pageLayoutPadding = 96 * 2 + 2;

    const minTargetWidth = videoPreviewOptions.current.minVideoPreviewWidth;
    const maxTargetWidth =
      pageWidth -
      videoPreviewOptions.current.minTranscriptionWidth -
      pageLayoutPadding;

    setVideoPreviewContainerWidth(
      clamp(minTargetWidth, videoPreviewContainerWidth, maxTargetWidth)
    );

    return { minTargetWidth, maxTargetWidth };
  }, [pageWidth, videoPreviewContainerWidth, setVideoPreviewContainerWidth]);

  const play = () => videoPreviewControllerRef?.current?.play();
  const pause = () => videoPreviewControllerRef?.current?.pause();
  const setPlaybackTime = (newPlaybackTime: number) =>
    videoPreviewControllerRef?.current?.setPlaybackTime(newPlaybackTime);
  const seekForward = () => videoPreviewControllerRef?.current?.seekForward();
  const seekBack = () => videoPreviewControllerRef?.current?.seekBack();

  // TODO: Look into optimisations
  useEffect(() => {
    if (currentProject === null || currentProject?.transcription === null) {
      return;
    }

    const newPlayingWordIndex = currentProject.transcription.words.findIndex(
      (word) =>
        time >= word.outputStartTime &&
        time < word.outputStartTime + bufferedWordDuration(word) &&
        !word.deleted
    );

    if (newPlayingWordIndex !== nowPlayingWordIndex) {
      setNowPlayingWordIndex(newPlayingWordIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, currentProject?.transcription]);

  const seekToWord: (wordIndex: number) => void = (wordIndex) => {
    if (currentProject !== null && currentProject?.transcription !== null) {
      // Fixes some minor floating point errors that cause the previous word to be selected
      // instead of the current one
      const epsilon = 0.01;

      const newTime =
        currentProject.transcription.words[wordIndex].outputStartTime + epsilon;
      setPlaybackTime(newTime);
    }
  };

  return (
    <>
      <VideoController
        time={time}
        isPlaying={isPlaying}
        play={play}
        pause={pause}
        seekForward={seekForward}
        seekBack={seekBack}
      />

      <Stack
        id="project-page-layout-container"
        direction="row"
        sx={{
          height: 'calc(100% - 76px)',
          gap: '48px',
          px: '48px',
          py: '32px',
        }}
      >
        <Stack id="transcription-container" spacing={4} sx={{ flex: '5 1 0' }}>
          {currentProject?.transcription && (
            <TranscriptionBlock
              transcription={currentProject.transcription}
              nowPlayingWordIndex={nowPlayingWordIndex}
              seekToWord={seekToWord}
            />
          )}
        </Stack>
        <ResizeSlider
          targetWidth={videoPreviewContainerWidth}
          setTargetWidth={setVideoPreviewContainerWidth}
          options={videoPreviewResizeOptions}
          sx={{ flex: '0 0 auto' }}
        />
        <Stack justifyContent="center" sx={{ width: 'fit-content' }}>
          <Box
            sx={{
              width: `${videoPreviewContainerWidth}px`,
            }}
          >
            <VideoPreviewController
              setTime={setTime}
              setIsPlaying={setIsPlaying}
              ref={videoPreviewControllerRef}
            />
          </Box>
        </Stack>
        {isExporting && (
          <div style={{ position: 'absolute', right: '32px', bottom: '32px' }}>
            <ExportCard progress={exportProgress} />
          </div>
        )}
      </Stack>
    </>
  );
};

export default ProjectPage;
