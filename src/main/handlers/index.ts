import extractAudio_ from './audioExtract';
import handleOpenProject_ from './openProjectHandler';
import handleSaveProject_ from './saveProjectHandler';
import handleTranscription_ from './transcriptionHandler';
import extractThumbnail_ from './thumbnailExtract';
import retrieveProjectMetadata_ from './projectMetadataHandler';
import showImportMediaDialog_ from './fileDialog';
import handleOsQuery_ from './osQuery';

export {
  readRecentProjects,
  writeRecentProjects,
} from './recentProjectsHandler';

// This is kind of hacky so if you find a better way please change it lol

export const extractAudio = extractAudio_;
export const handleOpenProject = handleOpenProject_;
export const handleSaveProject = handleSaveProject_;
export const handleTranscription = handleTranscription_;
export const extractThumbnail = extractThumbnail_;
export const retrieveProjectMetadata = retrieveProjectMetadata_;
export const showImportMediaDialog = showImportMediaDialog_;
export const handleOsQuery = handleOsQuery_;
