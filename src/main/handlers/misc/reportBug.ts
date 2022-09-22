import { Octokit } from '@octokit/rest';
import {
  REPO_OWNER_USERNAME,
  REPO_NAME,
  BUG_REPORT_LABEL,
  BUG_REPORT_LABEL_DESC,
  BUG_REPORT_LABEL_COLOUR,
  REPO_AUTH_TOKEN,
} from '../../../constants';

const reportBug = async (title: string, body: string) => {
  const octokit = new Octokit({
    auth: REPO_AUTH_TOKEN,
  });

  try {
    // get labels
    const labelResponse = await octokit.request(
      'GET /repos/{owner}/{repo}/labels',
      {
        owner: REPO_OWNER_USERNAME,
        repo: REPO_NAME,
      }
    );

    // check if bug report label exists
    const containsBugReportLabel = labelResponse.data
      .map((label) => label.name)
      .includes(BUG_REPORT_LABEL);

    // if not, create it
    if (!containsBugReportLabel) {
      await octokit.request('POST /repos/{owner}/{repo}/labels', {
        owner: REPO_OWNER_USERNAME,
        repo: REPO_NAME,
        name: BUG_REPORT_LABEL,
        description: BUG_REPORT_LABEL_DESC,
        color: BUG_REPORT_LABEL_COLOUR,
      });
    }

    // create issue
    await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner: REPO_OWNER_USERNAME,
      repo: REPO_NAME,
      title,
      body,
      labels: [BUG_REPORT_LABEL],
    });
  } catch (e) {
    console.error(e);
  }
};

export default reportBug;
