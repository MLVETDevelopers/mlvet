import { Box, Typography, styled, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { ApplicationStore } from '../store/helpers';
import colors from '../colors';
import { formatDate } from '../util';

const RecentProjectsBox = styled(Box)`
  width: calc(100vw - 80px);
  margin: 20px;
  padding: 20px;
`;

const RecentProjectsItem = styled(Box)`
  background: ${colors.grey[700]};
`;

const RecentProjectsBlock = () => {
  const recentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects
  );

  const displayDate: (date: Date | null) => string = (date) =>
    date === null ? '?' : formatDate(date);

  const formatSize: (size: number | null) => string = (size) =>
    size === null ? '?' : `${Math.floor(size / 1000000)} MB`;

  return (
    <RecentProjectsBox>
      <Typography fontWeight="bold">Recent Projects</Typography>
      <Stack spacing={2}>
        {recentProjects.map(({ id, name, dateModified, mediaSize }) => (
          <RecentProjectsItem key={id}>
            <Stack direction="row" justifyContent="space-around">
              <Typography>{name}</Typography>
              <Typography>{displayDate(dateModified)}</Typography>
              <Typography>{formatSize(mediaSize)}</Typography>
            </Stack>
          </RecentProjectsItem>
        ))}
      </Stack>
    </RecentProjectsBox>
  );
};

export default RecentProjectsBlock;
