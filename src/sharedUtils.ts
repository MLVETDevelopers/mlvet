import { Project, ProjectMetadata, RecentProject } from './sharedTypes';

// Round a number in seconds to milliseconds - solves a lot of floating point errors
export const roundToMs: (input: number) => number = (input) =>
  Math.round(input * 1000) / 1000;

const makeRecentProject: (
  project: Pick<Project, keyof (Project | RecentProject)>,
  metadata: ProjectMetadata,
  filePath: string
) => RecentProject = (project, metadata, filePath) => {
  const projectFields: (keyof (RecentProject | Project))[] = [
    'id',
    'name',
    'mediaFilePath',
    'thumbnailFilePath',
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

export default makeRecentProject;
