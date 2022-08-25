import {
  Box,
  IconButton,
  Link,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import colors from 'renderer/colors';
import { ChangeEvent, useState } from 'react';
import useKeypress from 'renderer/utils/hooks';
import { PrimaryButton, SecondaryButton } from '../Blocks/Buttons';
import ipc from '../../ipc';

const { openExternalLink } = ipc;

interface Props {
  prevView: () => void;
  closeModal: () => void;
  nextView: () => void;
  projectName: string;
  textToDisplay: string | null;
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
}: Props) => {
  const [isAwaitingAPIKey, setAwaitingAPIKey] = useState<boolean>(true);
  const [isAwaitingClientSecret, setAwaitingClientSecret] =
    useState<boolean>(true);
  const [APIKey, setAPIKey] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');

  const saveCloudCredentials: () => void = () => {
    nextView();
  };

  const handleAPIKeyInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const key = event.target.value.trim();
    setAPIKey(key);
    setAwaitingAPIKey(key.length === 0);
  };

  const handleClientSecretInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const secret = event.target.value.trim();
    setClientSecret(secret);
    setAwaitingClientSecret(secret.length === 0);
  };

  const saveButton = (
    <PrimaryButton
      onClick={saveCloudCredentials}
      disabled={isAwaitingAPIKey || isAwaitingClientSecret}
      fullWidth
    >
      Save
    </PrimaryButton>
  );

  const cancelButton = (
    <SecondaryButton onClick={prevView} fullWidth>
      Back
    </SecondaryButton>
  );

  const handleHelpClick: () => void = () => {
    openExternalLink('https://mlvet.app');
  };

  const defaultText =
    "This is your first time using the cloud transcription method. To get started you'll need to provide an API key and client secret for Google Cloud Speech-to-Text";

  const text = textToDisplay ?? defaultText;

  useKeypress(
    saveCloudCredentials,
    !(isAwaitingAPIKey || isAwaitingClientSecret),
    ['Enter', 'NumpadEnter']
  );

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
      <CustomColumnStack
        justifyContent="space-between"
        sx={{ height: '90.5%' }}
      >
        <CustomStack justifyContent="space-between">
          <CustomStack>
            <Typography variant="h3">
              Cloud transcription configuration required
            </Typography>
            <Typography variant="p-400">{text}</Typography>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link onClick={handleHelpClick}>
              {/* Using the href prop of this component will break hence we have to open the URL in an external browser window */}
              How can I get an API key and client secret? &gt;
            </Link>
          </CustomStack>
        </CustomStack>
        <CustomColumnStack>
          <CustomStack>
            <TextField
              label="API Key"
              value={APIKey}
              onChange={(event) => handleAPIKeyInput(event)}
              autoFocus
            />
          </CustomStack>
          <CustomStack>
            <TextField
              label="Client Secret"
              value={clientSecret}
              onChange={(event) => handleClientSecretInput(event)}
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
