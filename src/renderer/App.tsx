import { Box, colors, styled } from '@mui/material';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TopBar from './components/TopBar';
import HomePage from './pages/Home';
import ProjectPage from './pages/Project';
import store from './store/store';

const RootContainer = styled(Box)`
  margin: 0;
  background: ${colors.grey[800]};
  height: 100vh;
`;

export default function App() {
  return (
    <Provider store={store}>
      <RootContainer>
        <TopBar />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/project" element={<ProjectPage />} />
          </Routes>
        </Router>
      </RootContainer>
    </Provider>
  );
}
