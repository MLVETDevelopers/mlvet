import downloadModelReducer from '../reducer';
import {
  DOWNLOAD_PROGRESS_UPDATE,
  START_DOWNLOAD,
  FINISH_DOWNLOAD,
} from '../actions';
import { initialStore } from '../../sharedHelpers';
// import { calculateTimeRemaining } from '../helpers';

jest.mock('../helpers', () => {
  return {
    calculateTimeRemaining: jest.fn().mockImplementation(() => 100),
  };
});

const RealDate = Date;
const mockDate = new Date(12345678);
jest
  .spyOn(global, 'Date')
  .mockImplementation(() => mockDate as unknown as string);

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
      lastUpdated: mockDate,
      previousDownloadProgress: 0,
      timeRemaining: null,
    });
  });

  it('should handle download progress update', () => {
    expect(
      downloadModelReducer(
        {
          ...initialStore.downloadModel,
          isDownloading: true,
          downloadProgress: 0.2,
          isDownloadComplete: false,
          lastUpdated: new RealDate(mockDate.getTime() - 2000),
          previousDownloadProgress: 0,
          timeRemaining: null,
        },
        {
          type: DOWNLOAD_PROGRESS_UPDATE,
          payload: 0.5,
        }
      )
    ).toEqual({
      ...initialStore.downloadModel,
      isDownloading: true,
      downloadProgress: 0.5,
      isDownloadComplete: false,
      lastUpdated: mockDate,
      previousDownloadProgress: 0.2,
      timeRemaining: 100,
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
          lastUpdated: new RealDate(),
          previousDownloadProgress: 0.2,
          timeRemaining: null,
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
      lastUpdated: mockDate,
      previousDownloadProgress: 0.5,
      timeRemaining: 0,
    });
  });
});
