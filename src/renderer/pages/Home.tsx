import { useSelector } from 'react-redux';
import NewProjectBlock from 'renderer/components/NewProjectBlock';
import RecentProjectsBlock from 'renderer/components/RecentProjectsBlock';

const HomePage = () => {
  const recentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects
  );

  return (
    <>
      <NewProjectBlock isFullSize={recentProjects.length === 0} />
      {recentProjects.length > 0 && <RecentProjectsBlock />}
    </>
  );
};

export default HomePage;
