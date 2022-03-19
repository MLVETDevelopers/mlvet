import { Box, Typography, styled, colors } from '@mui/material';
import GenericSquareBox from './GenericSquareBox';

const recentProjectsMockData: { name: string }[] = [
  {
    name: 'First Project',
  },
  {
    name: 'Second Project',
  },
  {
    name: 'Third Project',
  },
  {
    name: 'Fourth Project',
  },
  {
    name: 'Fifth Project',
  },
  {
    name: 'Sixth Project',
  },
];

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
  return (
    <RecentProjectsBox>
      <Typography fontWeight="bold">Recent Projects</Typography>
      <ProjectsListBox>
        {recentProjectsMockData.map(({ name }) => (
          <GenericSquareBox key={name}>
            <Typography fontWeight="bold">{name}</Typography>
          </GenericSquareBox>
        ))}
      </ProjectsListBox>
    </RecentProjectsBox>
  );
};

export default RecentProjectsBlock;
