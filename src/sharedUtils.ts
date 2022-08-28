import {
  RuntimeProject,
  ProjectMetadata,
  RecentProject,
  Word,
} from './sharedTypes';

// Round a number in seconds to milliseconds - solves a lot of floating point errors
export const roundToMs: (input: number) => number = (input) =>
  Math.round(input * 1000) / 1000;

/**
 * Returns the percentage rounded to two dp
 */
export const getPercentage = (value: number, total: number) => {
  return Math.round((value / total) * 10000) / 100;
};

export const makeRecentProject: (
  project: Pick<RuntimeProject, keyof (RuntimeProject | RecentProject)>,
  metadata: ProjectMetadata,
  filePath: string
) => RecentProject = (project, metadata, filePath) => {
  const projectFields: (keyof (RecentProject | RuntimeProject))[] = [
    'id',
    'name',
    'mediaFilePath',
  ];

  const recentProject: Partial<RecentProject> = {
    ...metadata,
    projectFilePath: filePath,
  };

  // Programmatically assign fields from project
  projectFields.forEach((field) => {
    recentProject[field] = project[field] as any; // try to give this proper types, I double dare you
  });

  return recentProject as RecentProject;
};

export const bufferedWordDuration: (word: Word) => number = (word) =>
  word.bufferDurationBefore + word.duration + word.bufferDurationAfter;

/**
 * For testing - makes a word with any desired fields overridden
 * @param override - any fields to override
 * @returns
 */
export const makeBasicWord: (override: Partial<Word>) => Word = (override) => ({
  word: 'test',
  duration: 0,
  startTime: 0,
  outputStartTime: 0,
  bufferDurationBefore: 0,
  bufferDurationAfter: 0,
  originalIndex: 0,
  pasteKey: 0,
  deleted: false,
  confidence: 1,
  ...override,
});
