import { Box, IconButton, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import colors from 'renderer/colors';
import { useState } from 'react';
import { TranscriptionEngine } from 'sharedTypes';
import { PrimaryButton, SecondaryButton } from '../Blocks/Buttons';
import ipc from '../../ipc';
import { CustomColumnStack, CustomRowStack } from '../CustomStacks';

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
    <Container position="relative" height="500px">
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
      <CustomColumnStack justifyContent="space-between" sx={{ height: '50%' }}>
        <PrimaryButton
          onClick={() => setTranscriptionEngineChoice(TranscriptionEngine.VOSK)}
          fullWidth
        >
          VOSK
        </PrimaryButton>
        <PrimaryButton
          onClick={() =>
            setTranscriptionEngineChoice(TranscriptionEngine.ASSEMBLYAI)
          }
          fullWidth
        >
          ASSEMBLYAI
        </PrimaryButton>
      </CustomColumnStack>
      <CustomRowStack
        position="absolute"
        bottom="0px"
        justifyContent="space-between"
        sx={{ gap: '32px' }}
      >
        {cancelButton}
        {saveButton}
      </CustomRowStack>
    </Container>
  );
};

export default TranscriptionChoiceView;
