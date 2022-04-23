import { Box, styled, Typography, colors, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { transcriptionCreated } from '../../store/actions';
import { ApplicationStore } from '../../store/helpers';
import { Transcription } from '../../../sharedTypes';

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: right;
  width: 100%;
`;

const CustomButtonBase = styled(Button)`
  border-radius: 0;
  font-weight: bold;
  color: ${colors.grey[900]};
  text-transform: none;
  margin: 20px 10px;
  padding: 10px;
`;

const CancelButton = styled(CustomButtonBase)`
  background: ${colors.grey[400]};

  &:hover {
    background: ${colors.grey[600]};
  }
`;

const ActionButton = styled(CustomButtonBase)`
  background: ${colors.lightBlue[500]};

  &:hover {
    background: ${colors.lightBlue[700]};
  }
`;

enum AsyncState {
  READY = 'READY',
  LOADING = 'LOADING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

interface Props {
  closeModal: () => void;
  nextView: () => void;
}

const RunTranscriptionView = ({ closeModal, nextView }: Props) => {
  const [asyncState, setAsyncState] = useState<AsyncState>(AsyncState.READY);

  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const dispatch = useDispatch();

  const setTranscription: (transcription: Transcription) => void = useCallback(
    (transcription) => dispatch(transcriptionCreated(transcription)),
    [dispatch]
  );

  useEffect(() => {
    if (currentProject === null || asyncState !== AsyncState.READY) {
      return;
    }
    setAsyncState(AsyncState.LOADING);
    window.electron
      .requestTranscription(currentProject.filePath)
      .then((transcription) => {
        setAsyncState(AsyncState.DONE);
        setTranscription(transcription);
        return null;
      })
      .catch(() => setAsyncState(AsyncState.ERROR));
  }, [currentProject, setAsyncState, nextView, setTranscription, asyncState]);

  if (currentProject === null) {
    return null;
  }

  return (
    <>
      <Typography fontWeight="bold">{currentProject.name}</Typography>
      <Typography>Please wait while we transcribe your video</Typography>
      {asyncState}
      <pre>{JSON.stringify(currentProject)}</pre>
      <ButtonContainer>
        <CancelButton onClick={closeModal}>Cancel</CancelButton>
        <ActionButton
          onClick={nextView}
          disabled={asyncState !== AsyncState.DONE}
        >
          Done
        </ActionButton>
      </ButtonContainer>
    </>
  );
};

export default RunTranscriptionView;
