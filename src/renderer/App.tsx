import { Box, CssBaseline, Modal, styled, ThemeProvider } from '@mui/material';
import { ReactElement, useContext } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import './App.css';
import colors from './colors';
import KeyboardShortcutsDialog from './components/KeyboardShortcutsDialog';
import CloudConfigView from './components/ProjectCreation/CloudConfigView';
import HomePage from './pages/Home';
import ProjectPage from './pages/Project';
import { ContainerRefContext, ContextStore } from './RootContainerContext';
import { ApplicationPage } from './store/currentPage/helpers';
import { ApplicationStore } from './store/sharedHelpers';
import { toggleShortcuts } from './store/shortcuts/actions';
import applicationStore from './store/store';
import {
  toggleUpdateTranscriptionAPIKey,
  toggleUpdateTranscriptionChoice,
} from './store/menuCustomModals/actions';
import StoreChangeObserver from './StoreChangeObserver';
import theme from './theme';
import TranscriptionChoiceConfiguration from './components/ProjectCreation/MenuConfiguration';

const RootContainer = styled(Box)({
  margin: 0,
  background: colors.grey[900],
  height: '100vh',
});

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

function Router() {
  const currentPage = useSelector(
    (store: ApplicationStore) => store.currentPage
  );

  const pageComponents: Record<ApplicationPage, ReactElement> = {
    [ApplicationPage.HOME]: <HomePage />,
    [ApplicationPage.PROJECT]: <ProjectPage />,
  };

  return pageComponents[currentPage];
}

/**
 * Must be a child component of App so that the ContextStore can be accessed
 */
function AppContents() {
  // Ref of the overall page container used for handling mouse events
  const containerRefContext = useContext(ContainerRefContext);

  const dispatch = useDispatch();
  const hasOpenedShortcuts = useSelector(
    (store: ApplicationStore) => store.shortcutsOpened
  );

  const closeShortcut = () => dispatch(toggleShortcuts(false));

  const {
    isUpdateTranscriptionAPIKeyOpened,
    isUpdateTranscriptionChoiceOpened,
  } = useSelector((store: ApplicationStore) => store.menuCustomModals);

  const closeUpdateTranscriptionAPIKey = () =>
    dispatch(toggleUpdateTranscriptionAPIKey(false));

  const closeUpdateTranscriptionChoice = () =>
    dispatch(toggleUpdateTranscriptionChoice(false));

  return (
    <CssBaseline>
      <RootContainer ref={containerRefContext}>
        <Router />
        <KeyboardShortcutsDialog
          open={hasOpenedShortcuts}
          onClose={closeShortcut}
        />
        <CustomModal
          open={isUpdateTranscriptionAPIKeyOpened}
          onClose={closeUpdateTranscriptionAPIKey}
        >
          <CustomModalInner sx={{ width: { xs: 300, sm: 400, lg: 500 } }}>
            <CloudConfigView
              prevView={null}
              closeModal={closeUpdateTranscriptionAPIKey}
              nextView={closeUpdateTranscriptionAPIKey}
              projectName=""
            />
          </CustomModalInner>
        </CustomModal>
        <TranscriptionChoiceConfiguration
          isOpen={isUpdateTranscriptionChoiceOpened}
          onClose={closeUpdateTranscriptionChoice}
          projectName=""
        />
      </RootContainer>
    </CssBaseline>
  );
}

interface Props {
  hasStoreChangeObserver: boolean; // used for testing
}
export default function App({ hasStoreChangeObserver }: Props) {
  return (
    <Provider store={applicationStore}>
      <ContextStore>
        {hasStoreChangeObserver && <StoreChangeObserver />}
        <ThemeProvider theme={theme}>
          <AppContents />
        </ThemeProvider>
      </ContextStore>
    </Provider>
  );
}
