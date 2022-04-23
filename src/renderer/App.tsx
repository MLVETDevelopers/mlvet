import { Box, colors, styled } from '@mui/material';
import { ReactElement } from 'react';
import { Provider, useSelector } from 'react-redux';
import './App.css';
import TopBar from './components/TopBar';
import HomePage from './pages/Home';
import ProjectPage from './pages/Project';
import { ApplicationPage, ApplicationStore } from './store/helpers';
import applicationStore from './store/store';

const RootContainer = styled(Box)`
  margin: 0;
  background: ${colors.grey[800]};
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

export default function App() {
  return (
    <Provider store={applicationStore}>
      <RootContainer>
        <TopBar />
        <Router />
      </RootContainer>
    </Provider>
  );
}
