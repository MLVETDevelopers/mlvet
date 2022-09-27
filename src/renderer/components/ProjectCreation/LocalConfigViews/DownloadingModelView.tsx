import useKeypress from 'renderer/utils/hooks';
import { PrimaryButton, SecondaryButton } from '../../Blocks/Buttons';
import ipc from '../../../ipc';
import { CustomRowStack } from '../../CustomStacks';
import LocalConfigBlock from './LocalConfigBlock';

const { getTranscriptionEngineConfig } = ipc;

interface Props {
  onClickBack: () => void;
  onClickContinue: () => void;
  progress: number;
  isDownloadComplete: boolean;
}

const DownloadingModelView = ({
  onClickBack,
  onClickContinue,
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
    <SecondaryButton onClick={onClickBack} fullWidth>
      Back
    </SecondaryButton>
  );

  useKeypress(onClickContinue, true, ['Enter', 'NumpadEnter']);

  return (
    <>
      <LocalConfigBlock subtitle="Please wait while we download the local transcription tool">
        {progress?.toFixed(3) ?? '0.000'}% --- isDownloadComplete:{' '}
        {isDownloadComplete.toString()}
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
