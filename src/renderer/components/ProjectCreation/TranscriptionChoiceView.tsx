import { Box, IconButton, Link, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import colors from 'renderer/colors';
import { useState } from 'react';
import { TranscriptionEngine } from 'sharedTypes';
import { PrimaryButton, SecondaryButton } from '../Blocks/Buttons';
import ipc from '../../ipc';
import {
  CustomColumnStack,
  CustomRowStack,
  CustomStack,
} from '../CustomStacks';
import TranscriptionChoiceButton, {
  TranscriptionChoiceButtonTypes,
} from './TranscriptionChoiceButton';

const { openExternalLink, setTranscriptionEngine } = ipc;

interface Props {
  prevView: (() => void) | null;
  closeModal: () => void;
  nextView: (() => void) | null;
  projectName: string;
}

const Container = styled(Box)({
  backgroundColor: colors.grey[700],
});

const defaultText =
  "This is your first time using cloud transcription. To get started, you'll need to provide an API key and client secret for AssemblyAI";

const TranscriptionChoiceView = ({
  prevView,
  closeModal,
  nextView,
  projectName,
}: Props) => {
  const [text, setText] = useState<string>(defaultText);
  const [transcriptionEngineChoice, setTranscriptionEngineChoice] =
    useState<TranscriptionEngine | null>(null);

  const saveTranscriptionChoice = async () => {
    if (transcriptionEngineChoice === null) return;
    setTranscriptionEngine(transcriptionEngineChoice as TranscriptionEngine);
    nextView?.();
  };

  const cancelTranscriptionChoice = async () => {
    if (prevView === null) {
      closeModal();
    } else {
      prevView();
    }
  };

  const saveButton = (
    <PrimaryButton
      onClick={saveTranscriptionChoice}
      disabled={transcriptionEngineChoice === null}
      fullWidth
    >
      Save
    </PrimaryButton>
  );

  const cancelButton = (
    <SecondaryButton onClick={cancelTranscriptionChoice} fullWidth>
      Back
    </SecondaryButton>
  );

  const handleHelpClick: () => void = () => {
    openExternalLink(
      'https://app.assemblyai.com/signup?_ga=2.64947567.1548607132.1661819143-2080070454.1661819143'
    );
  };

  return (
    <Container
      position="relative"
      height="500px"
      id="transcription-choice-view"
    >
      <CustomColumnStack
        sx={{ justifyContent: 'space-between', height: '100%' }}
      >
        <CustomRowStack justifyContent="space-between">
          <Typography
            overflow="hidden"
            textOverflow="ellipsis"
            variant="h1"
            sx={{ color: colors.grey[400] }}
          >
            {projectName}
          </Typography>
          <IconButton
            sx={{ color: colors.yellow[500], fontSize: 20 }}
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>
        </CustomRowStack>
        <CustomColumnStack
          id="transcription-choice-content"
          sx={{
            justifyContent: 'space-between',
            height: '100%',
            marginTop: '16px',
            marginBottom: '8px',
          }}
        >
          <CustomStack>
            <Typography variant="p-300">Transcription Method</Typography>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link
              onClick={handleHelpClick}
              sx={{
                cursor: 'pointer',
                color: colors.yellow[500],
                fontSize: '12px',
                marginTop: '5px',
              }}
            >
              {/* Using the href prop of this component will break hence we have to open the URL in an external browser window */}
              What does this mean? &gt;
            </Link>
          </CustomStack>
          <CustomRowStack
            sx={{
              justifyContent: 'space-between',
              width: '100%',
              paddingX: { sm: '8px', lg: '32px' },
            }}
          >
            <TranscriptionChoiceButton
              onClick={() =>
                setTranscriptionEngineChoice(TranscriptionEngine.VOSK)
              }
              type={TranscriptionChoiceButtonTypes.LOCAL}
              isSelected={
                transcriptionEngineChoice === TranscriptionEngine.VOSK
              }
            />
            <TranscriptionChoiceButton
              onClick={() =>
                setTranscriptionEngineChoice(TranscriptionEngine.ASSEMBLYAI)
              }
              type={TranscriptionChoiceButtonTypes.CLOUD}
              isSelected={
                transcriptionEngineChoice === TranscriptionEngine.ASSEMBLYAI
              }
            />
          </CustomRowStack>
          <Typography
            variant="p-300"
            sx={{ fontSize: '10px', lineHeight: '14px' }}
          >
            Your choice will be remembered for future projects. You can change
            this at any time.
          </Typography>
        </CustomColumnStack>
        <CustomRowStack justifyContent="space-between" sx={{ gap: '32px' }}>
          {cancelButton}
          {saveButton}
        </CustomRowStack>
      </CustomColumnStack>
    </Container>
  );
};

export default TranscriptionChoiceView;
