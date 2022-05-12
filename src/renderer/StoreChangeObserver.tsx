import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { recentProjectsLoaded } from './store/actions';
import { ApplicationStore } from './store/helpers';

const { readRecentProjects, writeRecentProjects } = window.electron;

export default function StoreChangeObserver() {
  const recentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects
  );

  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const [hasLoadedRecentProjects, setHasLoadedRecentProjects] =
    useState<boolean>(false);

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
    if (recentProjects.length === 0) {
      return;
    }

    writeRecentProjects(recentProjects);
  }, [recentProjects, hasLoadedRecentProjects]);

  // Update file menu item enablement (save, save as) when projects are opened and closed
  useEffect(() => {
    if (currentProject === null) {
      // Can't save or save as when there is no project open
      window.electron.setSaveEnabled(false, false);
    } else if (currentProject.projectFilePath === null) {
      // Can save, but not save as, when the project hasn't been saved yet
      window.electron.setSaveEnabled(true, false);
    } else {
      // Can do either if the project has been saved already
      window.electron.setSaveEnabled(true, true);
    }
  }, [currentProject]);

  // Component doesn't render anything
  return null;
}
