import { Box, CssBaseline, styled, ThemeProvider } from '@mui/material';
import { ReactElement, RefObject, useRef } from 'react';
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

interface RouterProps {
  containerRef: RefObject<HTMLDivElement>;
}

function Router({ containerRef }: RouterProps) {
  const currentPage = useSelector(
    (store: ApplicationStore) => store.currentPage
  );

  const pageComponents: Record<ApplicationPage, ReactElement> = {
    [ApplicationPage.HOME]: <HomePage />,
    [ApplicationPage.PROJECT]: <ProjectPage containerRef={containerRef} />,
  };

  return pageComponents[currentPage];
}

interface Props {
  hasStoreChangeObserver: boolean; // used for testing
}

export default function App({ hasStoreChangeObserver }: Props) {
  // Ref of the overall page container used for handling mouse events
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Provider store={applicationStore}>
      {hasStoreChangeObserver && <StoreChangeObserver />}
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <RootContainer ref={containerRef}>
            <Router containerRef={containerRef} />
          </RootContainer>
        </CssBaseline>
      </ThemeProvider>
    </Provider>
  );
}
