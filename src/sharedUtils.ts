import {
  RuntimeProject,
  ProjectMetadata,
  RecentProject,
  Word,
  MapCallback,
  IndexRange,
  TakeGroup,
  TranscriptionChunk,
  SelectionState,
} from './sharedTypes';

export function isTakeGroup(chunk: TranscriptionChunk): chunk is TakeGroup {
  return 'activeTakeIndex' in chunk;
}

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
 * but only for those values within a specified range.
 * Values outside of the given indices will be unaltered.
 * @returns the mapped list
 */
export const mapInRange: <T>(
  list: T[],
  mapCallback: MapCallback<T, T>,
  range: IndexRange
) => T[] = (list, mapCallback, range) => {
  const listNew = [...list];

  const { startIndex, endIndex } = range;
  for (let i = startIndex; i < endIndex; i += 1) {
    listNew[i] = mapCallback(list[i], i, list);
  }

  return listNew;
};

/**
 * Maps the values of a list using a given map function,
 * but only for those values with given indices.
 * Values outside of the given indices will be unaltered.
 * @returns the mapped list
 */
export const mapWithIndices: <T>(
  list: T[],
  mapCallback: MapCallback<T, T>,
  indices: number[]
) => T[] = (list, mapCallback, indices) => {
  const listNew = [...list];

  indices.forEach((index) => {
    listNew[index] = mapCallback(list[index], index, list);
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

export const makeSelfSelection: (selection: IndexRange) => SelectionState = (
  selection
) => ({
  self: selection,
  others: {},
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

  // a take is not considered inactive if it is the active/selected take
  // or when no takes have been selected in the take group
  if (takeGroup?.activeTakeIndex === takeIndex || !takeGroup?.takeSelected) {
    return false;
  }

  return true;
};

export const sleep: (seconds: number) => Promise<void> = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export const checkSentenceEnd: (word: Word | undefined) => boolean = (word) => {
  // Case where word is undefined, i.e, we have traversed before the first word or after the last word.
  // This is the end of a sentence
  if (!word) {
    return true;
  }
  // Case where word is null, i.e, a pause. This is not the end of a sentence.
  if (word.word === null) {
    return false;
  }
  // Case where the word is a actual word. Return true if it includes . or ? or !
  return (
    word.word.includes('.') ||
    word.word.includes('?') ||
    word.word.includes('!')
  );
};
