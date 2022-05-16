/**
 * All input/output user actions states
 * Import / Export progress states
 */
export interface ExportIo {
  isExporting: boolean;
  exportProgress: number; // Used for showing current progress in export
}
