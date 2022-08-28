import {
  Box,
  Dialog,
  IconButton,
  Link,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import colors from 'renderer/colors';
import { useState } from 'react';
import useKeypress from 'renderer/utils/hooks';
import { PrimaryButton, SecondaryButton } from '../Blocks/Buttons';
import ipc from '../../ipc';

const { openExternalLink, storeCloudCredentials } = ipc;
const CustomModal = styled(Dialog)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
interface Props {
  prevView: (() => void) | null;
  closeModal: () => void;
  nextView: (() => void) | null;
  projectName: string;
  textToDisplay: string | null;
  open: boolean;
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

const CloudConfigView = ({
  prevView,
  closeModal,
  nextView,
  projectName,
  textToDisplay,
  open,
}: Props) => {
  const [isAwaitingApiKey, setAwaitingApiKey] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>('');

  const saveCloudCredentials: () => void = () => {
    setApiKey(apiKey.trim());
    storeCloudCredentials(apiKey);
    if (nextView == null) {
      closeModal();
    } else {
      nextView();
    }
  };

  const cancelCloudCredentials: () => void = () => {
    if (prevView == null) {
      closeModal();
    } else {
      prevView();
    }
  };

  const handleApiKeyInput = (value: string) => {
    setApiKey(value);
    setAwaitingApiKey(value.length === 0);
  };

  const saveButton = (
    <PrimaryButton
      onClick={saveCloudCredentials}
      disabled={isAwaitingApiKey}
      fullWidth
    >
      Save
    </PrimaryButton>
  );

  const cancelButton = (
    <SecondaryButton onClick={cancelCloudCredentials} fullWidth>
      Back
    </SecondaryButton>
  );

  const handleHelpClick: () => void = () => {
    openExternalLink(
      'https://app.assemblyai.com/signup?_ga=2.64947567.1548607132.1661819143-2080070454.1661819143'
    );
  };

  const defaultText =
    'This is your first time using the cloud transcription method. To get started you’ll need to provide an API key and client secret for AssemblyAI';

  const text = textToDisplay ?? defaultText;

  useKeypress(saveCloudCredentials, !isAwaitingApiKey, [
    'Enter',
    'NumpadEnter',
  ]);

  return (
    <Container sx={{ height: { xs: 500 } }}>
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
      <CustomColumnStack justifyContent="space-between" sx={{ height: '83%' }}>
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
            <Link
              onClick={handleHelpClick}
              sx={{
                cursor: 'pointer',
                color: colors.yellow[500],
                fontSize: '12px',
                marginTop: '5px',
                marginBottom: '30px',
              }}
            >
              {/* Using the href prop of this component will break hence we have to open the URL in an external browser window */}
              How can I get an API key? &gt;
            </Link>
          </CustomStack>
        </CustomStack>
        <CustomColumnStack>
          <CustomStack>
            <TextField
              label="API Key"
              value={apiKey}
              onChange={(event) => handleApiKeyInput(event.target.value)}
              autoFocus
            />
          </CustomStack>
        </CustomColumnStack>
        <CustomRowStack justifyContent="space-between" sx={{ gap: '32px' }}>
          {cancelButton}
          {saveButton}
        </CustomRowStack>
      </CustomColumnStack>
    </Container>
  );
};

export default CloudConfigView;
