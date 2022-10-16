import { Box, Stack, styled } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import VideoController from 'renderer/components/Editor/VideoController';
import VideoPreviewController, {
  VideoPreviewControllerRef,
} from 'renderer/components/VideoPreview/VideoPreviewController';
import PlaybackManager from 'renderer/components/Editor/PlaybackManager';
import ResizeManager from 'renderer/components/Editor/ResizeManager';
import { useRef, useState } from 'react';
import ResizeSlider from 'renderer/components/Editor/ResizeSlider';
import ExportCard from 'renderer/components/ExportCard';
import Scrubber from 'renderer/components/Scrubber';
import TranscriptionBlock from 'renderer/components/Editor/TranscriptionBlock';
import CollabController from 'renderer/components/Collab/CollabController';
import { COLLAB_ENABLED } from 'renderer/config';
import RateReviewIcon from '@mui/icons-material/RateReview';
import HomeIcon from '@mui/icons-material/Home';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import returnToHome from 'renderer/navigation/returnToHome';
import { performRedo, performUndo } from 'renderer/editor/undoRedo';
import { menuBarId } from 'renderer/utils/ui';
import MenuBarButton from 'renderer/components/Editor/MenuBarButton';
import { ApplicationStore } from '../store/sharedHelpers';
import { closeExportCard } from '../store/exportIo/actions';
import ProvideFeedbackModal from '../components/UserFeedback/ProvideFeedbackModal';
import colors from '../colors';
import { copyText, cutText, deleteText, pasteText } from '../editor/clipboard';
/*
This is the page that gets displayed while you are editing a video.
It will be primarily composed of the transcription area, an editable text box whose
changes get reflected in the video. In addition to that, there is a video preview
section to the side among other things.
*/
const HeaderBarBox = styled(Box)({
  background: colors.grey[700],
  color: colors.grey[300],
  height: '62px',
  width: '100vw',
  margin: 0,
  padding: '11px 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
const LeftAligned = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
});
const RightAligned = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const CenterAligned = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const ProjectPage = () => {
  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );
  const { isExporting, exportProgress } = useSelector(
    (store: ApplicationStore) => store.exportIo
  );

  const dispatch = useDispatch();
  const toggleCloseExportCard = () => dispatch(closeExportCard());

  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);

  const openUserFeedback = () => {
    setOpenFeedbackDialog(true);
  };

  const projectPageLayoutRef = useRef<HTMLDivElement>(null);
  const videoPreviewContainerRef = useRef<HTMLDivElement>(null);
  const videoPreviewControllerRef = useRef<VideoPreviewControllerRef>(null);
  const [outputVideoLength, setOutputVideoLength] = useState<number>(0);

  return (
    <>
      <ProvideFeedbackModal
        open={openFeedbackDialog}
        onClose={() => setOpenFeedbackDialog(false)}
      />
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
                <HeaderBarBox id={menuBarId}>
                  <LeftAligned
                    style={{ marginLeft: '20px', marginRight: '20px' }}
                  >
                    <MenuBarButton
                      text="Exit to Home"
                      onClick={returnToHome}
                      style={{ marginRight: '25px' }}
                    >
                      <HomeIcon />
                    </MenuBarButton>
                    <MenuBarButton text="Undo" onClick={performUndo}>
                      <UndoIcon />
                    </MenuBarButton>
                    <MenuBarButton text="Redo" onClick={performRedo}>
                      <RedoIcon />
                    </MenuBarButton>
                    <MenuBarButton text="Delete Text" onClick={deleteText}>
                      <DeleteIcon />
                    </MenuBarButton>
                    <MenuBarButton text="Cut Text" onClick={cutText}>
                      <ContentCutIcon />
                    </MenuBarButton>
                    <MenuBarButton text="Copy Text" onClick={copyText}>
                      <ContentCopyIcon />
                    </MenuBarButton>
                    <MenuBarButton text="Paste Text" onClick={pasteText}>
                      <ContentPasteIcon />
                    </MenuBarButton>
                  </LeftAligned>
                  <CenterAligned>
                    <VideoController
                      time={time}
                      isPlaying={isPlaying}
                      play={play}
                      pause={pause}
                      seekForward={seekForward}
                      seekBack={seekBack}
                    />
                  </CenterAligned>
                  <RightAligned
                    style={{
                      marginRight: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      fontSize: '12px',
                    }}
                  >
                    <MenuBarButton
                      text="Provide Feedback"
                      onClick={openUserFeedback}
                    >
                      <RateReviewIcon />
                    </MenuBarButton>
                  </RightAligned>
                </HeaderBarBox>

                {COLLAB_ENABLED && <CollabController />}

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
                        blockWidth={
                          window.innerWidth - videoPreviewContainerWidth
                        }
                        setPlaybackTime={setPlaybackTime}
                      />
                    )}
                  </Stack>
                  <ResizeSlider
                    targetWidth={videoPreviewContainerWidth}
                    setTargetWidth={setVideoPreviewContainerWidth}
                    options={videoResizeOptions}
                    sx={{ flex: '0 0 auto' }}
                  />
                  <Stack
                    id="video-preview"
                    justifyContent="center"
                    sx={{ width: 'fit-content', height: '100%' }}
                  >
                    <Box
                      id="video-preview-container"
                      sx={{
                        width: `${videoPreviewContainerWidth}px`,
                        maxHeight: 'calc(100% - 48px)',
                      }}
                      ref={videoPreviewContainerRef}
                    >
                      <VideoPreviewController
                        setTime={setTime}
                        setIsPlaying={setIsPlaying}
                        ref={videoPreviewControllerRef}
                        outputVideoLength={outputVideoLength}
                        setOutputVideoLength={setOutputVideoLength}
                      />
                      <Scrubber
                        totalDuration={outputVideoLength}
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
                      <ExportCard
                        onClose={toggleCloseExportCard}
                        progress={exportProgress}
                      />
                    </div>
                  )}
                </Stack>
              </>
            )}
          </ResizeManager>
        )}
      </PlaybackManager>
    </>
  );
};

export default ProjectPage;
