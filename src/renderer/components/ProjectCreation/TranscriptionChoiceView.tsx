import {
  Box,
  Button,
  IconButton,
  Link,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import colors from 'renderer/colors';
import { useEffect, useState } from 'react';
import useKeypress from 'renderer/utils/hooks';
import { TranscriptionEngine } from '../../../sharedTypes';
import { PrimaryButton, SecondaryButton } from '../Blocks/Buttons';
import ipc from '../../ipc';

const choices = [
  {
    title: 'Assembly AI',
    engine: TranscriptionEngine.ASSEMBLYAI,
  },
  {
    title: 'Vosk',
    engine: TranscriptionEngine.VOSK,
  },
];

const { storeCloudCredentials, readDefaultEngineConfig } = ipc;

interface Props {
  prevView: (() => void) | null;
  closeModal: () => void;
  nextView: (() => void) | null;
  projectName: string;
}

const CustomStack = styled(Stack)({ width: '100%' });

const CustomColumnStack = styled(CustomStack)({ flexDirection: 'column' });

const CustomRowStack = styled(CustomStack)({
  flexDirection: 'row',
  alignItems: 'center',
});

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
  const [engineChoice, setEngineChoice] = useState<null | TranscriptionEngine>(
    null
  );
  const [isAwaitingChoice, setIsAwaitingChoice] = useState(true);
  const [text, setText] = useState<string>(defaultText);

  const handleChoiceClicked = (choice: TranscriptionEngine) => {
    setEngineChoice(choice);
    setIsAwaitingChoice(false);
  };

  const primaryAction: () => void = () => {
    if (engineChoice !== null) {
      storeCloudCredentials(engineChoice, '');
    }
    if (nextView === null) {
      closeModal();
    } else {
      nextView();
    }
  };

  const cancel: () => void = () => {
    if (prevView === null) {
      closeModal();
    } else {
      prevView();
    }
  };

  const saveButton = (
    <PrimaryButton
      onClick={primaryAction}
      disabled={isAwaitingChoice}
      fullWidth
    >
      Save
    </PrimaryButton>
  );

  const cancelButton = (
    <SecondaryButton onClick={cancel} fullWidth>
      Back
    </SecondaryButton>
  );

  useKeypress(primaryAction, !isAwaitingChoice, ['Enter', 'NumpadEnter']);

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
        <CustomStack justifyContent="space-between">
          <CustomStack>
            <Typography
              variant="p-300"
              sx={{ marginTop: '16px', marginBottom: '35px' }}
            >
              Cloud transcription configuration required
            </Typography>
            <Typography variant="p-400">{text}</Typography>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          </CustomStack>
        </CustomStack>
        <CustomColumnStack>
          <CustomStack>
            <CustomRowStack sx={{ gap: '32px' }}>
              {choices.map((choice) => (
                <Button onClick={() => handleChoiceClicked(choice.engine)}>
                  {choice.title}
                </Button>
              ))}
            </CustomRowStack>
          </CustomStack>
        </CustomColumnStack>
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
