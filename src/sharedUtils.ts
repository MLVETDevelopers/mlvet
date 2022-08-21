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
