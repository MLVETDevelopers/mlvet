import { Box, CssBaseline, styled, ThemeProvider } from '@mui/material';
import { ReactElement } from 'react';
import { Provider, useSelector } from 'react-redux';
import './App.css';
import colors from './colors';
import HomePage from './pages/Home';
import ProjectPage from './pages/Project';
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

interface Props {
  hasStoreChangeObserver: boolean; // used for testing
}

export default function App({ hasStoreChangeObserver }: Props) {
  return (
    <Provider store={applicationStore}>
      {hasStoreChangeObserver && <StoreChangeObserver />}
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <RootContainer>
            <Router />
          </RootContainer>
        </CssBaseline>
      </ThemeProvider>
    </Provider>
  );
}
