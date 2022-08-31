import { appCloudConfigPath, fileOrDirExists } from '../../util';

type RequireCloudConfig = () => Promise<boolean>;

const requireCloudConfig: RequireCloudConfig = async () => {
  const cloudConfigPath = appCloudConfigPath();

  // if not exists (false) we want to negate so the frontend can add the cloud config view.
  return !fileOrDirExists(cloudConfigPath);
};

export default requireCloudConfig;
