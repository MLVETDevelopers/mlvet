import { Typography } from '@mui/material';
import { useState } from 'react';
import useKeypress from 'renderer/utils/hooks';
import { PrimaryLoadingButton, SecondaryButton } from '../../Blocks/Buttons';
import { CustomColumnStack, CustomRowStack } from '../../CustomStacks';
import LocalConfigBlock from './LocalConfigBlock';
import colors from '../../../colors';

interface Props {
  onClickBack: () => void;
  onClickDownload: () => void;
}

const text = [
  `This is your first time using the local transcription method. To continue you will need to download the local transcription tool to your device.`,
  `This is a one off download and will not be required for future local transcriptions.`,
  `Note: an internet connection is required.`,
];

const DownloadInfoView = ({ onClickBack, onClickDownload }: Props) => {
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
