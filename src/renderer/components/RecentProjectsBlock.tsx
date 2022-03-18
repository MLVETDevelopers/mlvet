import { Box, Typography, styled, colors } from '@mui/material';

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

const ProjectBox = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  
  background: ${colors.grey[400]};
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: ${colors.grey[900]};

  &:last {
    margin-right: 0;
  }

  &:hover {
    background: ${colors.grey[600]};
    cursor: pointer;
  }
`;

const RecentProjectsBlock = () => {
  return (
    <RecentProjectsBox>
      <Typography fontWeight="bold">Recent Projects</Typography>
      <ProjectsListBox>
        {recentProjectsMockData.map(({ name }) => (
          <ProjectBox key={name}>
            <Typography fontWeight="bold">{name}</Typography>
          </ProjectBox>
        ))}
      </ProjectsListBox>
    </RecentProjectsBox>
  );
};

export default RecentProjectsBlock;
