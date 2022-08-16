import os from 'os';
import { OperatingSystems } from '../../../sharedTypes';

type HandleOsQuery = () => Promise<OperatingSystems | null>;

const handleOsQuery: HandleOsQuery = async () => {
  const isDarwin = os.platform() === OperatingSystems.MACOS;
  const isWindows = os.platform() === OperatingSystems.WINDOWS;
  const isLinux = os.platform() === OperatingSystems.LINUX;

  if (isDarwin) {
    return OperatingSystems.MACOS;
  }
  if (isWindows) {
    return OperatingSystems.WINDOWS;
  }
  if (isLinux) {
    return OperatingSystems.LINUX;
  }

  return null;
};

export default handleOsQuery;
