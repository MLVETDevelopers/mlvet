import { Box, Typography, styled, colors } from '@mui/material';
import { useSelector } from 'react-redux';
import { ApplicationStore } from '../store/helpers';
import GenericSquareBox from './GenericSquareBox';

const RecentProjectsBox = styled(Box)`
  background: ${colors.grey[900]};
  width: calc(100vw - 80px);
  margin: 20px;
  padding: 20px;
`;

const ProjectsListBox = styled(Box)`
  margin-top: 20px;
  display: flex;
  overflow-x: auto;
`;

const RecentProjectsBlock = () => {
  const recentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects
  );

  return (
    <RecentProjectsBox>
      <Typography fontWeight="bold">Recent Projects</Typography>
      <ProjectsListBox>
        {recentProjects.map(({ name }) => (
          <GenericSquareBox key={name}>
            <Typography fontWeight="bold">{name}</Typography>
          </GenericSquareBox>
        ))}
      </ProjectsListBox>
    </RecentProjectsBox>
  );
};

export default RecentProjectsBlock;
