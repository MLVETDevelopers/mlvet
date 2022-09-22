import { Octokit } from '@octokit/rest';
import {
  REPO_OWNER_USERNAME,
  REPO_NAME,
  REPO_AUTH_TOKEN,
} from '../../../constants';

const reportBug = async (title: string, body: string) => {
  const octokit = new Octokit({
    auth: REPO_AUTH_TOKEN,
  });

  // create issue
  await octokit.request('POST /repos/{owner}/{repo}/issues', {
    owner: REPO_OWNER_USERNAME,
    repo: REPO_NAME,
    title,
    body,
  });
};

export default reportBug;
