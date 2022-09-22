// eslint-disable-next-line import/prefer-default-export
export const CURRENT_SCHEMA_VERSION = 2;
export const URL_USER_FEEDBACK_FORM = 'https://forms.gle/YNozsPZxF4kxSuud8';
export const REPO_OWNER_USERNAME = 'chloebrett';
export const REPO_NAME = 'mlvet';
export const BUG_REPORT_LABEL = 'user-reported bug';
export const BUG_REPORT_LABEL_DESC =
  'issues with this label originate from in-app user feedback';
export const BUG_REPORT_LABEL_COLOUR = 'f59e42';
// replace 'null' with commented token to switch on issue creation from 'mlvet-bug-reporter' account
// Note: please do not remove 'atob'. It decrypts and encrypted version of the access token because GitHub doesnt like seeing its access tokens in its repos
export const REPO_AUTH_TOKEN = null; // atob('Z2hwX0dZckFYS1NobnNJeURRb0poUElDem1RdHZBcmxtSzNla1dzZQ==');
