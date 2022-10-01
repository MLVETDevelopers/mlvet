/**
 * All input/output user actions states
 * Import / Export progress states
 */
export interface DownloadModel {
  isDownloading: boolean;
  isDownloadComplete: boolean;
  downloadProgress: number; // Used for showing current download progress
}
