import { useDispatch, useSelector } from 'react-redux';
import KeyboardShortcutsDialog from 'renderer/components/KeyboardShortcutsDialog';
import { toggleShortcuts } from 'renderer/store/shortcuts/actions';
import NewProjectBlock from '../components/ProjectCreation/NewProjectBlock';
import RecentProjectsBlock from '../components/RecentProjectsBlock';
import { ApplicationStore } from '../store/sharedHelpers';

const HomePage = () => {
  const dispatch = useDispatch();

  const hasRecentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects.length > 0
  );

  const hasOpenedShortcuts = useSelector(
    (store: ApplicationStore) => store.shortcutsOpened
  );

  const closeShortcut = () => dispatch(toggleShortcuts(false));

  return (
    <>
      <NewProjectBlock isFullSize={!hasRecentProjects} />
      {hasRecentProjects && <RecentProjectsBlock />}
      <KeyboardShortcutsDialog
        open={hasOpenedShortcuts}
        onClose={closeShortcut}
      />
    </>
  );
};

export default HomePage;
