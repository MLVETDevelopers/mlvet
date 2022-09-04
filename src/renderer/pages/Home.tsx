import { useSelector } from 'react-redux';
import CollabGuestJoin from 'renderer/components/Collab/CollabGuestJoin';
import { COLLAB_ENABLED } from 'renderer/config';
import NewProjectBlock from '../components/ProjectCreation/NewProjectBlock';
import RecentProjectsBlock from '../components/RecentProjectsBlock';
import { ApplicationStore } from '../store/sharedHelpers';

const HomePage = () => {
  const hasRecentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects.length > 0
  );

  return (
    <>
      <NewProjectBlock isFullSize={!hasRecentProjects} />
      {COLLAB_ENABLED && <CollabGuestJoin />}
      {hasRecentProjects && <RecentProjectsBlock />}
    </>
  );
};

export default HomePage;
