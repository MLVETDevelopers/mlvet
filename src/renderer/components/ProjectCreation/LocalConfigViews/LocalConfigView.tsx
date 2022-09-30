import { Box, IconButton, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import colors from 'renderer/colors';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationStore } from '../../../store/sharedHelpers';
import ipc from '../../../ipc';
import { CustomRowStack } from '../../CustomStacks';
import DownloadInfoView from './DownloadInfoView';
import DownloadingModelView from './DownloadingModelView';

const { downloadModel } = ipc;

interface Props {
  prevView: (() => void) | null;
  closeModal: () => void;
  nextView: (() => void) | null;
  projectName: string;
}

const Container = styled(Box)({
  backgroundColor: colors.grey[700],
});

const configViews = {
  info: 'info',
  downloading: 'downloading',
};

const LocalConfigView = ({
  prevView,
  closeModal,
  nextView,
  projectName,
}: Props) => {
  const [currentConfigView, setCurrentConfigView] = useState(configViews.info);
  const { isDownloading, downloadProgress, isDownloadComplete } = useSelector(
    (store: ApplicationStore) => store.downloadModel
  );

  const configViewComponents = useMemo(() => {
    return {
      [configViews.info]: DownloadInfoView,
      [configViews.downloading]: DownloadingModelView,
    };
  }, []);

  useEffect(() => {
    if (isDownloading) setCurrentConfigView(configViews.downloading);
  }, [isDownloading]);

  const download = async () => {
    await downloadModel();
  };

  const configView = (() => {
    const viewComponent = configViewComponents[currentConfigView];
    switch (viewComponent) {
      case DownloadInfoView:
        return (
          <DownloadInfoView
            onClickBack={() => prevView?.()}
            onClickDownload={download}
          />
        );
      case DownloadingModelView:
        return (
          <DownloadingModelView
            onClickBack={() => {}}
            onClickContinue={() => nextView?.()}
            progress={downloadProgress}
            isDownloadComplete={isDownloadComplete}
          />
        );
      default:
        return <></>;
    }
  })();

  return (
    <Container position="relative" height="500px">
      <CustomRowStack justifyContent="space-between">
        <Typography
          overflow="hidden"
          textOverflow="ellipsis"
          variant="h1"
          sx={{ color: colors.grey[400] }}
        >
          {projectName}
        </Typography>
        <IconButton
          sx={{ color: colors.yellow[500], fontSize: 20 }}
          onClick={closeModal}
        >
          <CloseIcon />
        </IconButton>
      </CustomRowStack>
      {configView}
    </Container>
  );
};

export default LocalConfigView;
