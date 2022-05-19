// For tests. May find a better way of doing this but this works for now.
// If you need to stub these, you can do so by replacing the './ipc' module
const mockIpc = {
  readRecentProjects: async () => [],
  writeRecentProjects: async () => null,
  setSaveEnabled: async () => null,
  openProject: async () => null,
};

const ipc = window.electron ?? mockIpc;

export default ipc;
