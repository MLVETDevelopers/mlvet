import { useSelector } from 'react-redux';
import NewProjectBlock from '../components/NewProjectBlock';
import RecentProjectsBlock from '../components/RecentProjectsBlock';
import { ApplicationStore } from '../store/helpers';

const HomePage = () => {
  const hasRecentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects.length > 0
  );

  return (
    <>
      <NewProjectBlock isFullSize={!hasRecentProjects} />
      {hasRecentProjects && <RecentProjectsBlock />}
    </>
  );
};

export default HomePage;
