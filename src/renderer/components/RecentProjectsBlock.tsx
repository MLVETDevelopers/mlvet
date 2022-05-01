import { Box, Typography, styled, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import colors from '../colors';
import { ApplicationStore } from '../store/helpers';
import GenericSquareBox from './GenericSquareBox';

const RecentProjectsBox = styled(Box)`
  width: calc(100vw - 80px);
  margin: 20px;
  padding: 20px;
`;

const RecentProjectsItem = styled(Box)`
  background: ${colors.grey[700]};
`;

const RecentProjectsBlock = () => {
  // const recentProjects = useSelector(
  //   (store: ApplicationStore) => store.recentProjects
  // );

  const recentProjects = [
    { name: 'Google Poly', dateModified: '27/07/21', size: '100MB' },
    { name: 'Game with no players', dateModified: '24/10/20', size: '159MB' },
  ];

  return (
    <RecentProjectsBox>
      <Typography fontWeight="bold">Recent Projects</Typography>
      <Stack spacing={2}>
        {recentProjects.map(({ name, dateModified, size }) => (
          <RecentProjectsItem key={name}>
            <Stack direction="row" justifyContent="space-around">
              <Typography>{name}</Typography>
              <Typography>{dateModified}</Typography>
              <Typography>{size}</Typography>
            </Stack>
          </RecentProjectsItem>
        ))}
      </Stack>
    </RecentProjectsBox>
  );
};

export default RecentProjectsBlock;
