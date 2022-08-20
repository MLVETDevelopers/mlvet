import { Box, Stack } from '@mui/material';
import { useRef, RefObject } from 'react';
import { useSelector } from 'react-redux';
import TranscriptionBlock from 'renderer/components/Editor/TranscriptionBlock';
import VideoController from 'renderer/components/Editor/VideoController';
import VideoPreviewController, {
  VideoPreviewControllerRef,
} from 'renderer/components/VideoPreview/VideoPreviewController';
import ResizeSlider from 'renderer/components/Editor/ResizeSlider';
import PlaybackManager from 'renderer/components/Editor/PlaybackManager';
import ResizeManager from 'renderer/components/Editor/ResizeManager';
import ExportCard from '../components/ExportCard';
import { ApplicationStore } from '../store/sharedHelpers';

interface Props {
  containerRef: RefObject<HTMLDivElement>;
}

/*
This is the page that gets displayed while you are editing a video.
It will be primarily composed of the transcription area, an editable text box whose
changes get reflected in the video. In addition to that, there is a video preview
section to the side among other things.
*/
const ProjectPage = ({ containerRef }: Props) => {
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );
  const { isExporting, exportProgress } = useSelector(
    (store: ApplicationStore) => store.exportIo
  );

  const projectPageLayoutRef = useRef<HTMLDivElement>(null);
  const videoPreviewContainerRef = useRef<HTMLDivElement>(null);
  const videoPreviewControllerRef = useRef<VideoPreviewControllerRef>(null);

  return (
    <PlaybackManager
      videoPreviewControllerRef={videoPreviewControllerRef}
      currentProject={currentProject}
    >
      {(
        time,
        setTime,
        isPlaying,
        setIsPlaying,
        nowPlayingWordIndex,
        play,
        pause,
        seekForward,
        seekBack,
        seekToWord
      ) => (
        <ResizeManager
          projectPageLayoutRef={projectPageLayoutRef}
          videoPreviewContainerRef={videoPreviewContainerRef}
        >
          {(
            videoPreviewContainerWidth,
            setVideoPreviewContainerWidth,
            videoResizeOptions
          ) => (
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
                <Stack
                  id="transcription-container"
                  spacing={4}
                  sx={{ flex: '5 1 0' }}
                >
                  {currentProject?.transcription && (
                    <TranscriptionBlock
                      transcription={currentProject.transcription}
                      nowPlayingWordIndex={nowPlayingWordIndex}
                      seekToWord={seekToWord}
                      containerRef={containerRef}
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
                  <div
                    style={{
                      position: 'absolute',
                      right: '32px',
                      bottom: '32px',
                    }}
                  >
                    <ExportCard progress={exportProgress} />
                  </div>
                )}
              </Stack>
            </>
          )}
        </ResizeManager>
      )}
    </PlaybackManager>
  );
};

export default ProjectPage;
