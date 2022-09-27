import { Typography } from '@mui/material';
import { useState } from 'react';
import useKeypress from 'renderer/utils/hooks';
import {
  PrimaryButton,
  PrimaryLoadingButton,
  SecondaryButton,
} from '../../Blocks/Buttons';
import ipc from '../../../ipc';
import { CustomColumnStack, CustomRowStack } from '../../CustomStacks';
import LocalConfigBlock from './LocalConfigBlock';
import colors from '../../../colors';

const { getTranscriptionEngineConfig } = ipc;

interface Props {
  onClickBack: () => void;
  onClickDownload: () => void;
}

const infoText = [
  `This is your first time using the local transcription method. To continue you will need to download the local transcription tool to your device.`,
  `This is a one off download and will not be required for future local transcriptions.`,
  `Note: an internet connection is required.`,
];

const DownloadInfoView = ({ onClickBack, onClickDownload }: Props) => {
  const [text, setText] = useState<string[]>(infoText);
  const [isDownloadButtonLoading, setIsDownloadButtonLoading] = useState(false);

  const onClickDownloadButton = () => {
    setIsDownloadButtonLoading(true);
    onClickDownload();
  };

  const downloadButton = (
    <PrimaryLoadingButton
      onClick={onClickDownloadButton}
      fullWidth
      loading={isDownloadButtonLoading}
    >
      Download
    </PrimaryLoadingButton>
  );

  const backButton = (
    <SecondaryButton onClick={onClickBack} fullWidth>
      Back
    </SecondaryButton>
  );

  useKeypress(onClickDownload, true, ['Enter', 'NumpadEnter']);

  return (
    <>
      <LocalConfigBlock subtitle="Local transcription tool download required">
        <CustomColumnStack sx={{ gap: '25px' }}>
          {text.map((paragraph) => (
            <Typography
              key={paragraph}
              variant="p-400"
              sx={{ color: colors.grey[300] }}
            >
              {paragraph}
            </Typography>
          ))}
        </CustomColumnStack>
        {/* <a
          href="https://drive.google.com/file/d/1IQnW2lLRKHG6RAdFO2wbbf8PQYcMl2u9/view?usp=sharing"
          download
        >
          download gdrive stuff
        </a> */}
      </LocalConfigBlock>
      <CustomRowStack
        position="absolute"
        bottom="0px"
        justifyContent="space-between"
        sx={{ gap: '32px' }}
      >
        {backButton}
        {downloadButton}
      </CustomRowStack>
    </>
  );
};

export default DownloadInfoView;
