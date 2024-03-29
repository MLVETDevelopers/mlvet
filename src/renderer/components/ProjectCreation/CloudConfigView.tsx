import {
  Box,
  IconButton,
  Link,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import colors from 'renderer/colors';
import { useEffect, useState } from 'react';
import { useKeypress } from 'renderer/utils/hooks';
import { URL_ASSEMBLYAI_SIGNUP } from '../../../constants';
import { CloudConfig, TranscriptionEngine } from '../../../sharedTypes';
import { PrimaryButton, SecondaryButton } from '../Blocks/Buttons';
import ipc from '../../ipc';
import {
  CustomStack,
  CustomColumnStack,
  CustomRowStack,
} from '../CustomStacks';

const {
  openExternalLink,
  getTranscriptionEngineConfig,
  setTranscriptionEngineConfig,
} = ipc;

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

const CloudConfigView = ({
  prevView,
  closeModal,
  nextView,
  projectName,
}: Props) => {
  const [originalApiKey, setOriginalApiKey] = useState<string>('');
  const [text, setText] = useState<string>(defaultText);
  const [isAwaitingApiKey, setAwaitingApiKey] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const configInfo = async () => {
      const engineConfig = (await getTranscriptionEngineConfig(
        TranscriptionEngine.ASSEMBLYAI
      )) as CloudConfig;
      const apikey = engineConfig.key;
      if (apikey !== null && apikey !== '') {
        setText('Update API Key');
        setOriginalApiKey(apikey);
        setAwaitingApiKey(false);
      }
    };
    configInfo().catch((err) => {
      console.log(err);
    });
  }, []);

  const saveCloudCredentials: () => void = async () => {
    if (apiKey !== null) {
      setApiKey(apiKey.trim());
      const engineConfig = (await getTranscriptionEngineConfig(
        TranscriptionEngine.ASSEMBLYAI
      )) as CloudConfig;
      setTranscriptionEngineConfig(TranscriptionEngine.ASSEMBLYAI, {
        ...engineConfig,
        key: apiKey,
      });
    }
    nextView?.();
  };

  const cancelCloudCredentials: () => void = () => {
    if (prevView === null) {
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
    openExternalLink(URL_ASSEMBLYAI_SIGNUP);
  };

  useKeypress(saveCloudCredentials, !isAwaitingApiKey, [
    'Enter',
    'NumpadEnter',
  ]);

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
              value={apiKey ?? originalApiKey}
              onChange={(event) => handleApiKeyInput(event.target.value)}
              autoFocus
            />
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

export default CloudConfigView;
