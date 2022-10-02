import Typography from '@mui/material/Typography';
import ProgressBar from 'renderer/components/ProgressBar';
import { useKeypress } from 'renderer/utils/hooks';
import colors from 'renderer/colors';
import { PrimaryButton, SecondaryButton } from '../../Blocks/Buttons';
import { CustomColumnStack, CustomRowStack } from '../../CustomStacks';
import LocalConfigBlock from './LocalConfigBlock';

interface Props {
  onClickBack: () => void;
  onClickContinue: () => void;
  isDownloading: boolean;
  progress: number;
  isDownloadComplete: boolean;
}

const DownloadingModelView = ({
  onClickBack,
  onClickContinue,
  isDownloading,
  progress,
  isDownloadComplete,
}: Props) => {
  const continueButton = (
    <PrimaryButton
      onClick={onClickContinue}
      fullWidth
      disabled={!isDownloadComplete}
    >
      Continue
    </PrimaryButton>
  );

  const backButton = (
    <SecondaryButton onClick={onClickBack} fullWidth disabled={isDownloading}>
      Back
    </SecondaryButton>
  );

  useKeypress(onClickContinue, true, ['Enter', 'NumpadEnter']);

  return (
    <>
      <LocalConfigBlock subtitle="Please wait while we download the local transcription tool">
        <CustomColumnStack>
          <Typography
            variant="p-400"
            sx={{ marginBottom: '8px', color: colors.yellow[500] }}
          >
            {isDownloadComplete ? 'Download complete' : 'Downloading'}
          </Typography>
          <ProgressBar variant="determinate" value={progress * 100} />
          <Typography
            variant="p-400"
            sx={{ marginTop: '4px', fontSize: '12px' }}
          >
            {(progress * 100).toFixed(0)}% Complete
          </Typography>
        </CustomColumnStack>
      </LocalConfigBlock>
      <CustomRowStack
        position="absolute"
        bottom="0px"
        justifyContent="space-between"
        sx={{ gap: '32px' }}
      >
        {backButton}
        {continueButton}
      </CustomRowStack>
    </>
  );
};

export default DownloadingModelView;
