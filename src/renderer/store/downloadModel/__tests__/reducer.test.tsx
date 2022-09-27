import downloadModelReducer from '../reducer';
import {
  DOWNLOAD_PROGRESS_UPDATE,
  START_DOWNLOAD,
  FINISH_DOWNLOAD,
} from '../actions';
import { initialStore } from '../../sharedHelpers';

describe('Download model reducer', () => {
  it('should handle download start', () => {
    expect(
      downloadModelReducer(initialStore.downloadModel, {
        type: START_DOWNLOAD,
        payload: null,
      })
    ).toEqual({
      ...initialStore.downloadModel,
      isDownloading: true,
      downloadProgress: 0,
      isDownloadComplete: false,
    });
  });

  it('should handle download progress update', () => {
    expect(
      downloadModelReducer(
        {
          ...initialStore.downloadModel,
          isDownloading: true,
          downloadProgress: 0,
          isDownloadComplete: false,
        },
        {
          type: DOWNLOAD_PROGRESS_UPDATE,
          payload: { progress: 0.5 },
        }
      )
    ).toEqual({
      ...initialStore.downloadModel,
      isDownloading: true,
      downloadProgress: 0.5,
      isDownloadComplete: false,
    });
  });

  it('should handle download finish', () => {
    expect(
      downloadModelReducer(
        {
          ...initialStore.downloadModel,
          isDownloading: true,
          downloadProgress: 0.5,
          isDownloadComplete: false,
        },
        {
          type: FINISH_DOWNLOAD,
          payload: null,
        }
      )
    ).toEqual({
      ...initialStore.downloadModel,
      isDownloading: false,
      downloadProgress: 1,
      isDownloadComplete: true,
    });
  });
});
