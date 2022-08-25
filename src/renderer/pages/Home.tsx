import { useSelector } from 'react-redux';
import NewProjectBlock from '../components/ProjectCreation/NewProjectBlock';
import RecentProjectsBlock from '../components/RecentProjectsBlock';
import { ApplicationStore } from '../store/sharedHelpers';
import googleTranscribeFunction from '../../main/handlers/helpers/transcriptionEngines/googleTranscribeFunction';

const HomePage = () => {
  const hasRecentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects.length > 0
  );

  const testTranscript = () => {
    googleTranscribeFunction('project');
  };

  return (
    <>
      <button onClick={testTranscript}>test transcript</button>
      <NewProjectBlock isFullSize={!hasRecentProjects} />
      {hasRecentProjects && <RecentProjectsBlock />}
    </>
  );
};

export default HomePage;
