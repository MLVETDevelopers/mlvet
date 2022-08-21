import { Box, CssBaseline, styled, ThemeProvider } from '@mui/material';
import { ReactElement, useContext } from 'react';
import { Provider, useSelector } from 'react-redux';
import './App.css';
import colors from './colors';
import HomePage from './pages/Home';
import ProjectPage from './pages/Project';
import { ContainerRefContext, ContextStore } from './RootContainerContext';
import { ApplicationPage } from './store/currentPage/helpers';
import { ApplicationStore } from './store/sharedHelpers';
import applicationStore from './store/store';
import StoreChangeObserver from './StoreChangeObserver';
import theme from './theme';

const RootContainer = styled(Box)({
  margin: 0,
  background: colors.grey[900],
  height: '100vh',
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

  return (
    <CssBaseline>
      <RootContainer ref={containerRefContext}>
        <Router />
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
