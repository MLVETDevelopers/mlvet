import { Box, Stack } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { getAspectRatio, getElementSize } from 'renderer/util';
import ExportCard from '../components/ExportCard';
import { ApplicationStore } from '../store/sharedHelpers';
import { bufferedWordDuration } from '../../sharedUtils';

// Used for calculating the max size of the video preview
const pageLayoutPadding = { x: 96 * 2 + 2, y: 64 };

const pageLayoutOptions = {
  minTranscriptionWidth: 120,
  minVideoPreviewWidth: 120,
};

const defaultAspectRatio = 16 / 9;

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

  const projectPageLayoutRef = useRef<HTMLDivElement>(null);
  const videoPreviewContainerRef = useRef<HTMLDivElement>(null);
  const videoPreviewControllerRef = useRef<VideoPreviewControllerRef>(null);

  const videoAspectRatioRef = useRef({
    ratio: defaultAspectRatio,
    isSaved: false,
  });

  const [videoResizeOptions, setVideoResizeOptions] = useState({
    minTargetWidth: 120,
    maxTargetWidth: 120,
  });

  const getVideoAspectRatio = () => {
    const videoAspectRatio = videoAspectRatioRef.current.isSaved
      ? videoAspectRatioRef.current.ratio
      : getAspectRatio(
          videoPreviewContainerRef.current as HTMLDivElement,
          defaultAspectRatio
        );

    if (!videoAspectRatioRef.current.isSaved) {
      videoAspectRatioRef.current = { ratio: videoAspectRatio, isSaved: true };
    }

    return videoAspectRatio;
  };

  const windowResizeHandler = useCallback((newPageSize) => {
    // A manual way of calculating the min and max width of the video preview container.
    // Will need to be updated if styling changes are made to avoid bugs

    const pageSize =
      getElementSize(projectPageLayoutRef?.current as HTMLDivElement) ??
      newPageSize;

    const videoAspectRatio = getVideoAspectRatio();

    // Use padding and transcription size to calculate max width based on available width
    const maxWidthBasedOnWidth =
      pageSize.width -
      pageLayoutPadding.x -
      pageLayoutOptions.minTranscriptionWidth;

    // Use aspect-ratio to calculate the max width based on available height
    const maxWidthBasedOnHeight =
      videoAspectRatio * (pageSize.height - pageLayoutPadding.y);

    const maxTargetWidth = Math.min(
      maxWidthBasedOnWidth,
      maxWidthBasedOnHeight
    );

    const minTargetWidth = Math.min(
      pageLayoutOptions.minVideoPreviewWidth,
      maxTargetWidth
    );

    setVideoResizeOptions({
      minTargetWidth,
      maxTargetWidth,
    });
  }, []);

  useWindowResizer(windowResizeHandler);

  useEffect(() => {
    setVideoPreviewContainerWidth(
      clamp(
        videoResizeOptions.minTargetWidth,
        videoPreviewContainerWidth,
        videoResizeOptions.maxTargetWidth
      )
    );
    // Don't want to run this every time user resizes video preview, only on window resize
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setVideoPreviewContainerWidth, videoResizeOptions]);

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
        ref={projectPageLayoutRef}
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
          options={videoResizeOptions}
          sx={{ flex: '0 0 auto' }}
        />
        <Stack justifyContent="center" sx={{ width: 'fit-content' }}>
          <Box
            sx={{
              width: `${videoPreviewContainerWidth}px`,
            }}
            ref={videoPreviewContainerRef}
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
