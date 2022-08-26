import { Box, Modal, styled } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CloudConfigView from 'renderer/components/ProjectCreation/CloudConfigView';
import { toggleUpdateTranscriptionAPIKey } from 'renderer/store/updateTranscriptionAPIKey/actions';
import NewProjectBlock from '../components/ProjectCreation/NewProjectBlock';
import RecentProjectsBlock from '../components/RecentProjectsBlock';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';

const CustomModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const CustomModalInner = styled(Box)({
  background: colors.grey[700],
  padding: '15px 30px 30px 30px',
  borderRadius: '5px',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
});

const HomePage = () => {
  const dispatch = useDispatch();
  const dummyPrevView: () => void = () => {};
  const dummyNextView: () => void = () => {};

  const hasRecentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects.length > 0
  );

  const hasOpenedUpdateTranscriptionAPIKey = useSelector(
    (store: ApplicationStore) => store.updateTranscriptionAPIKeyOpened
  );

  const closeUpdateTranscriptionAPIKey = () =>
    dispatch(toggleUpdateTranscriptionAPIKey(false));

  return (
    <>
      <NewProjectBlock isFullSize={!hasRecentProjects} />
      {hasRecentProjects && <RecentProjectsBlock />}
      <CustomModal
        open={hasOpenedUpdateTranscriptionAPIKey}
        onClose={closeUpdateTranscriptionAPIKey}
      >
        <CustomModalInner sx={{ width: { xs: 300, sm: 400, lg: 500 } }}>
          <CloudConfigView
            prevView={dummyPrevView}
            closeModal={closeUpdateTranscriptionAPIKey}
            nextView={dummyNextView}
            projectName=""
            textToDisplay={null}
            open={hasOpenedUpdateTranscriptionAPIKey}
          />
        </CustomModalInner>
      </CustomModal>
    </>
  );
};

export default HomePage;
