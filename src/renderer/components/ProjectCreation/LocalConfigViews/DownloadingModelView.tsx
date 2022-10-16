import Typography from '@mui/material/Typography';
import ProgressBar from 'renderer/components/ProgressBar';
import { useKeypress } from 'renderer/utils/hooks';
import colors from 'renderer/colors';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { PrimaryButton, SecondaryButton } from '../../Blocks/Buttons';
import { CustomColumnStack, CustomRowStack } from '../../CustomStacks';
import LocalConfigBlock from './LocalConfigBlock';

interface Props {
  onClickBack: () => void;
  onClickContinue: () => void;
}

const DownloadingModelView = ({ onClickBack, onClickContinue }: Props) => {
  const {
    isDownloading,
    downloadProgress: progress,
    isDownloadComplete,
    timeRemaining,
  } = useSelector((store: ApplicationStore) => store.downloadModel);

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

  const timeRemainingFormatted = useMemo(() => {
    if (timeRemaining === null) return null;
    if (timeRemaining > 60) return `${Math.round(timeRemaining / 60)} minutes`;
    return `${Math.round(timeRemaining)} seconds`;
  }, [timeRemaining]);

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
          <CustomRowStack justifyContent="space-between">
            <Typography
              variant="p-400"
              sx={{ marginTop: '4px', fontSize: '12px' }}
            >
              {(progress * 100).toFixed(0)}% Complete
            </Typography>
            {timeRemaining !== null && !isDownloadComplete && (
              <Typography
                variant="p-400"
                sx={{ marginTop: '4px', fontSize: '12px' }}
              >
                Estimated {timeRemainingFormatted} remaining
              </Typography>
            )}
          </CustomRowStack>
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
