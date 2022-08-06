import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { recentProjectsLoaded } from './store/recentProjects/actions';
import { ApplicationStore } from './store/sharedHelpers';
import ipc from './ipc';

const { readRecentProjects, writeRecentProjects } = ipc;

export default function StoreChangeObserver() {
  const recentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects
  );

  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const [hasLoadedRecentProjects, setHasLoadedRecentProjects] =
    useState<boolean>(false);

  const [isProjectEdited, setProjectEdited] = useState<boolean>(false);

  const dispatch = useDispatch();

  // Load the recent projects from the back end when the app starts
  useEffect(() => {
    // Only load if we haven't yet for this app load
    if (hasLoadedRecentProjects) {
      return;
    }

    (async () => {
      const loadedRecentProjects = await readRecentProjects();
      dispatch(recentProjectsLoaded(loadedRecentProjects));
      setHasLoadedRecentProjects(true);
    })();
  }, [hasLoadedRecentProjects, setHasLoadedRecentProjects, dispatch]);

  // Persist the recent projects in the back end when the recentProjects changes in the store
  useEffect(() => {
    // If we haven't read yet, or the list of recent projects is empty, don't write
    if (!hasLoadedRecentProjects) {
      return;
    }

    writeRecentProjects(recentProjects);
  }, [recentProjects, hasLoadedRecentProjects]);

  // Update file menu item enablement (save, save as) when projects are opened and closed
  useEffect(() => {
    if (currentProject === null || currentProject.transcription === null) {
      // Can't save or save as when there is no project open
      ipc.setSaveEnabled(false, false);

      // No file is represented
      ipc.setFileRepresentation(null, false);
    } else if (currentProject.projectFilePath === null) {
      // Can save, but not save as, when the project hasn't been saved yet
      ipc.setSaveEnabled(true, false);

      // No file is represented as the project hasn't been saved yet - however, we mark the window as 'dirty'
      ipc.setFileRepresentation(null, true);
    } else {
      // Can do either if the project has been saved already
      ipc.setSaveEnabled(true, true);

      // File is represented, dirty depends on if the project has been edited
      ipc.setFileRepresentation(
        currentProject.projectFilePath,
        currentProject.isEdited
      );
    }
  }, [currentProject, isProjectEdited, setProjectEdited]);

  // Component doesn't render anything
  return null;
}
