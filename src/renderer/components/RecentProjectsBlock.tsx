/* eslint-disable promise/always-return */

import {
  Box,
  Typography,
  styled,
  Stack,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { pageChanged } from 'renderer/store/currentPage/actions';
import { ApplicationPage } from 'renderer/store/currentPage/helpers';
import { projectOpened } from 'renderer/store/currentProject/actions';
import { projectDeleted } from 'renderer/store/recentProjects/actions';
import { useEffect, useMemo, useState } from 'react';
import { ApplicationStore } from '../store/sharedHelpers';
import colors from '../colors';
import { formatDate } from '../utils/dateTime';
import { ProjectMetadata, RecentProject } from '../../sharedTypes';
import ipc from '../ipc';

const { openProject, deleteProject, showConfirmation } = ipc;

const RecentProjectsBox = styled(Box)({
  width: 'calc(100vw - 40px)',
  margin: '20px',
  padding: '40px',
});

const RecentProjectsItem = styled(Paper)({
  backgroundColor: colors.grey[700],
  color: colors.grey[300],
  padding: '10px 20px',
  paddingRight: 0,

  transition: '0.5s background',

  '&:hover': {
    background: colors.grey[600],
    cursor: 'pointer',
  },
});
const RecentProjectsSubItem = styled(Grid)({
  display: 'flex',
  alignItems: 'center',
  justifyItems: 'right',
});

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
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  const dispatch = useDispatch();

  const recentProjectsFull = useSelector(
    (store: ApplicationStore) => store.recentProjects
  );

  const recentProjects = useMemo(
    () =>
      recentProjectsFull
        .sort(sortByDateModified)
        .slice(0, RECENT_PROJECTS_COUNT),
    [recentProjectsFull]
  );

  // TODO(chloe) I think this can cause a memory leak if the request is in flight
  // when the page changes; not sure how to fix
  useEffect(() => {
    Promise.all(
      recentProjects.map(async ({ id }) => ({
        id,
        thumbnail: await ipc.loadThumbnail(id),
      }))
    )
      .then((list) => {
        const map: Record<string, string> = {};
        list.forEach(({ id, thumbnail }) => {
          map[id] = thumbnail;
        });
        setThumbnails(map);
      })
      .catch(() => {});
  }, [recentProjects]);

  const displayDate: (date: Date | null) => string = (date) =>
    date === null ? '?' : formatDate(date);

  const formatSize: (size: number | null) => string = (size) =>
    size === null ? '?' : `${Math.floor(size / 1000000)} MB`;

  const handleOpenProject: (id: string) => Promise<void> = async (id) => {
    const recentProject = recentProjects.find((proj) => proj.id === id);

    if (!recentProject) {
      return;
    }

    if (!recentProject.projectFilePath) {
      return;
    }

    // Open the full project from storage, as the current one only has metadata
    // TODO(chloe): error handling if the project file doesn't exist / was moved
    const { project, filePath } = await openProject(
      recentProject.projectFilePath
    );

    if (project === null) {
      if (
        await showConfirmation(
          'Delete project?',
          'The project could not be opened because the project file was not found. Do you want to delete the project metadata?'
        )
      ) {
        dispatch(projectDeleted(recentProject.id));

        await deleteProject(recentProject);
      }

      return;
    }

    const projectMetadata: ProjectMetadata = {
      dateModified: recentProject.dateModified,
      mediaSize: recentProject.mediaSize,
    };

    dispatch(projectOpened(project, filePath, projectMetadata));
    dispatch(pageChanged(ApplicationPage.PROJECT));
  };

  const onProjectDelete: (id: string) => Promise<void> = async (id) => {
    if (
      !(await showConfirmation(
        'Are you sure you want to delete this project?',
        "This will remove the project file from disk, as well as any associated metadata. Linked media file(s) won't be deleted."
      ))
    ) {
      return;
    }

    const projectToDelete = recentProjects.find(
      (recentProject) => recentProject.id === id
    );

    if (!projectToDelete) {
      return;
    }

    dispatch(projectDeleted(id));

    const { project } = await openProject(projectToDelete.projectFilePath);

    if (project === null) {
      return;
    }

    await deleteProject(project);
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
          <RecentProjectsItem key={id} onClick={() => handleOpenProject(id)}>
            <Grid container spacing={2}>
              <RecentProjectsSubItem item xs={8}>
                <Stack
                  sx={{
                    width: 180,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    backgroundColor: colors.grey[900],
                  }}
                >
                  <img
                    src={`data:image/png;base64,${thumbnails[id] ?? ''}`}
                    alt={`Thumbnail for project ${name}`}
                    style={{
                      maxWidth: 180,
                      maxHeight: 100,
                    }}
                  />
                </Stack>
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
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      onProjectDelete(id);
                    }}
                    sx={{ color: colors.grey[300] }}
                  >
                    <DeleteIcon />
                  </IconButton>
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
