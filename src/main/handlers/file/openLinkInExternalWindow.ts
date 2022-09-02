import { shell } from 'electron';

type OpenExternalLink = (url: string) => Promise<void>;

const openExternalLink: OpenExternalLink = async (url: string) => {
  shell.openExternal(url);
};

export default openExternalLink;
