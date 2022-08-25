import { shell } from 'electron';

type OpenExternalLink = () => Promise<void>;

const openExternalLink: OpenExternalLink = async () => {
  shell.openExternal('https://mlvet.app');
};

export default openExternalLink;
