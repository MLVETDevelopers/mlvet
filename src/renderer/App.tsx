import { Box, CssBaseline, styled, ThemeProvider } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import './App.css';
import colors from './colors';
import HomePage from './pages/Home';
import ProjectPage from './pages/Project';
import { recentProjectsLoaded } from './store/actions';
import { ApplicationPage, ApplicationStore } from './store/helpers';
import applicationStore from './store/store';
import theme from './theme';

const { readRecentProjects, writeRecentProjects } = window.electron;

const RootContainer = styled(Box)`
  margin: 0;
  background: ${colors.grey[900]};
  height: 100vh;
`;

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

function StoreChangeObserver() {
  const recentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects
  );

  const [hasLoadedRecentProjects, setHasLoadedRecentProjects] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  // Load the recent projects from the back end when the app starts
  useEffect(() => {
    // Only load if we haven't yet for this app load
    if (hasLoadedRecentProjects) {
      return;
    }

    (async () => {
      const loadedRecentProjects = await readRecentProjects();
      dispatch(recentProjectsLoaded(loadedRecentProjects));
      setHasLoadedRecentProjects(true);
    })();
  }, [hasLoadedRecentProjects, setHasLoadedRecentProjects, dispatch]);

  // Persist the recent projects in the back end when the recentProjects changes in the store
  useEffect(() => {
    // If we haven't read yet, don't write
    if (!hasLoadedRecentProjects) {
      return;
    }

    writeRecentProjects(recentProjects);
  }, [recentProjects, hasLoadedRecentProjects]);

  // Component doesn't render anything
  return null;
}

export default function App() {
  return (
    <Provider store={applicationStore}>
      <StoreChangeObserver />
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
