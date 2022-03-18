import { colors, Container, styled } from '@mui/material';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TopBar from './components/TopBar';
import HomePage from './pages/Home';
import ProjectPage from './pages/Project';
import Transcribe from './pages/Transcribe';

const RootContainer = styled(Container)`
  margin: 0;
  background: ${colors.grey[800]};
  height: 100vh;

  &.MuiContainer-maxWidthLg {
    padding: 0;
  }
`;

export default function App() {
  return (
    <RootContainer>
      <TopBar />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/transcribe" element={<Transcribe />} />
        </Routes>
      </Router>
    </RootContainer>
  );
}
