import {
  RuntimeProject,
  ProjectMetadata,
  RecentProject,
  Word,
  MapCallback,
  IndexRange,
  TakeGroup,
  TranscriptionEngine,
  EngineConfig,
  CloudConfig,
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

export const findDefaultEngineConfig = (
  cloudConfig: CloudConfig
): EngineConfig => {
  switch (cloudConfig.defaultEngine) {
    case TranscriptionEngine.ASSEMBLYAI: {
      return cloudConfig.ASSEMBLYAI;
    }
    default: {
      return cloudConfig.DUMMY;
    }
  }
};

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
  takeInfo: null,
  ...override,
});

export const isInInactiveTake: (
  word: Word,
  takeGroups: TakeGroup[]
) => boolean = (word, takeGroups) => {
  if (word.takeInfo === null) {
    return false;
  }

  const { takeGroupId, takeIndex } = word.takeInfo;

  const takeGroup = takeGroups.find((group) => group.id === takeGroupId);

  if (takeGroup?.activeTakeIndex === takeIndex) {
    return false;
  }

  return true;
};

export const sleep: (seconds: number) => Promise<void> = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));
