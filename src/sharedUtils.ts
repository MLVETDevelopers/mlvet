import {
  RuntimeProject,
  ProjectMetadata,
  RecentProject,
  Word,
  MapCallback,
  IndexRange,
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
 * Maps the values of a list using a given map function,
 * but only for those values within specified ranges.
 * Values outside of the given indices will be unaltered.
 * @returns the mapped list
 */
export const mapInRanges: <T>(
  list: T[],
  mapCallback: MapCallback<T, T>,
  ranges: IndexRange[]
) => T[] = (list, mapCallback, ranges) => {
  const listNew = [...list];

  ranges.forEach((range) => {
    const { startIndex, endIndex } = range;
    for (let i = startIndex; i < endIndex; i += 1) {
      listNew[i] = mapCallback(list[i], i, list);
    }
  });

  return listNew;
};
