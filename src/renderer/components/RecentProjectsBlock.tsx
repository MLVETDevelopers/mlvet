import { Box, Typography, styled, Stack, Grid, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { projectOpened, pageChanged } from 'renderer/store/actions';
import { ApplicationPage, ApplicationStore } from '../store/helpers';
import colors from '../colors';
import { formatDate } from '../util';
import exampleThumbnail from '../../../assets/example-thumbnail.png';
import { RecentProject } from '../../sharedTypes';

const RecentProjectsBox = styled(Box)`
  width: calc(100vw - 40px);
  margin: 20px;
  padding: 40px;
`;

const RecentProjectsItem = styled(Paper)`
  background: ${colors.grey[700]};
  color: ${colors.grey[300]};
  padding: 10px 20px;
  padding-right: 0;

  transition: 0.5s background;

  &:hover {
    background: ${colors.grey[600]};
    cursor: pointer;
  }
`;

const RecentProjectsSubItem = styled(Grid)`
  display: flex;
  align-items: center;
  justify-items: right;
`;

// No idea why, but styling typography in paper in the usual way just literally does nothing. Seems like an MUI bug,
// can't find any documentation on it. So doing this instead
const CategoryHeading = ({ children }: { children: React.ReactNode }) => (
  <Typography style={{ fontSize: 12, color: colors.grey[400] }}>
    {children}
  </Typography>
);

const sortByDateModified = (first: RecentProject, second: RecentProject) =>
  (second.dateModified?.getTime() || 0) - (first.dateModified?.getTime() || 0);

const RECENT_PROJECTS_COUNT = 5;

const RecentProjectsBlock = () => {
  const dispatch = useDispatch();

  const recentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects
  )
    .sort(sortByDateModified)
    .slice(0, RECENT_PROJECTS_COUNT);

  const displayDate: (date: Date | null) => string = (date) =>
    date === null ? '?' : formatDate(date);

  const formatSize: (size: number | null) => string = (size) =>
    size === null ? '?' : `${Math.floor(size / 1000000)} MB`;

  const openProject: (id: string) => void = (id) => {
    const project = recentProjects.find((proj) => proj.id === id);

    if (!project) {
      return;
    }

    dispatch(projectOpened(project, project.projectFilePath));
    dispatch(pageChanged(ApplicationPage.PROJECT));
  };

  return (
    <RecentProjectsBox>
      <Typography
        variant="h3"
        style={{ display: 'block', marginBottom: 10, fontWeight: 'bold' }}
      >
        Recent Projects
      </Typography>
      <Stack spacing={2} style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        {recentProjects.map(({ id, name, dateModified, mediaSize }) => (
          <RecentProjectsItem key={id} onClick={() => openProject(id)}>
            <Grid container spacing={2}>
              <RecentProjectsSubItem item xs={8}>
                <img
                  src={exampleThumbnail}
                  alt={`Thumbnail for project ${name}`}
                  style={{
                    maxWidth: 180,
                  }}
                />
                <Typography
                  variant="h1"
                  style={{ fontWeight: 'bold', marginLeft: 40 }}
                >
                  {name}
                </Typography>
              </RecentProjectsSubItem>
              <RecentProjectsSubItem item xs={2}>
                <Stack>
                  <CategoryHeading>Date modified:</CategoryHeading>
                  <Typography>{displayDate(dateModified)}</Typography>
                </Stack>
              </RecentProjectsSubItem>
              <RecentProjectsSubItem item xs={1}>
                <Stack>
                  <CategoryHeading>Size:</CategoryHeading>
                  <Typography>{formatSize(mediaSize)}</Typography>
                </Stack>
              </RecentProjectsSubItem>
              <RecentProjectsSubItem item xs={1}>
                <Stack>
                  <DeleteIcon />
                </Stack>
              </RecentProjectsSubItem>
            </Grid>
          </RecentProjectsItem>
        ))}
      </Stack>
    </RecentProjectsBox>
  );
};

export default RecentProjectsBlock;
