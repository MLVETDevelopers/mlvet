import { Box, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import TranscriptionBlock from 'renderer/components/Editor/TranscriptionBlock';
import VideoController from 'renderer/components/Editor/VideoController';
import VideoPreviewController, {
  VideoPreviewControllerRef,
} from 'renderer/components/VideoPreview/VideoPreviewController';
import PlaybackManager from 'renderer/components/Editor/PlaybackManager';
import ResizeManager from 'renderer/components/Editor/ResizeManager';
import { useRef } from 'react';
import ResizeSlider from 'renderer/components/Editor/ResizeSlider';
import ExportCard from 'renderer/components/ExportCard';
import Scrubber from 'renderer/components/Scrubber';
import { toggleUpdateTranscriptionAPIKey } from 'renderer/store/updateTranscriptionAPIKey/actions';
import CloudConfigView from 'renderer/components/ProjectCreation/CloudConfigView';
import { ApplicationStore } from '../store/sharedHelpers';

/*
This is the page that gets displayed while you are editing a video.
It will be primarily composed of the transcription area, an editable text box whose
changes get reflected in the video. In addition to that, there is a video preview
section to the side among other things.
*/

const ProjectPage = () => {
  const dispatch = useDispatch();
  const dummyPrevView: () => void = () => {};
  const dummyNextView: () => void = () => {};

  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );
  const { isExporting, exportProgress } = useSelector(
    (store: ApplicationStore) => store.exportIo
  );

  const hasOpenedUpdateTranscriptionAPIKey = useSelector(
    (store: ApplicationStore) => store.updateTranscriptionAPIKeyOpened
  );

  const closeUpdateTranscriptionAPIKey = () =>
    dispatch(toggleUpdateTranscriptionAPIKey(false));

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
        seekToWord,
        setPlaybackTime
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
              <CloudConfigView
                prevView={dummyPrevView}
                closeModal={closeUpdateTranscriptionAPIKey}
                nextView={dummyNextView}
                projectName=""
                textToDisplay={null}
                open={hasOpenedUpdateTranscriptionAPIKey}
              />
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
                    <Scrubber
                      totalDuration={
                        currentProject?.transcription?.outputDuration ?? 0
                      }
                      currentTimeSeconds={time}
                      onScrubberChange={setPlaybackTime}
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
