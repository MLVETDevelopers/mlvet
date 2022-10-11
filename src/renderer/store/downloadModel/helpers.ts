/**
 * All input/output user actions states
 * Import / Export progress states
 */
export interface DownloadModel {
  isDownloading: boolean;
  isDownloadComplete: boolean;
  // The progress of the download, a value between 0 and 1
  downloadProgress: number;
  // The date at which the time remaining was last updated
  lastUpdated: Date | null;
  // The amount of time remaining on the download, in seconds
  timeRemaining: number | null;
  // The progress of the download on the previous update, a value between 0 and 1
  previousDownloadProgress: number;
}

type CalculateTimeRemaining = (
  newLastUpdated: Date,
  oldLastUpdated: Date,
  newDownloadProgress: number,
  oldDownloadProgress: number
) => number;

export const calculateTimeRemaining: CalculateTimeRemaining = (
  newLastUpdated,
  oldLastUpdated,
  newDownloadProgress,
  oldDownloadProgress
) => {
  const timeDifference =
    (newLastUpdated.getTime() - oldLastUpdated.getTime()) / 1000;
  const progressPerTime =
    (newDownloadProgress - oldDownloadProgress) / timeDifference;
  return (1 - newDownloadProgress) / progressPerTime;
};

export type DownloadStateUpdatePayload = {
  lastUpdated: Date;
  downloadProgress: number;
};

type CreateDownloadStateUpdatePayload = (
  progress: number
) => DownloadStateUpdatePayload;

export const createDownloadStateUpdatePayload: CreateDownloadStateUpdatePayload =
  (progress) => ({
    lastUpdated: new Date(),
    downloadProgress: progress,
  });
