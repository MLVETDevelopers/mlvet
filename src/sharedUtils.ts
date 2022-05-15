import { Project, ProjectMetadata, RecentProject } from './sharedTypes';

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
