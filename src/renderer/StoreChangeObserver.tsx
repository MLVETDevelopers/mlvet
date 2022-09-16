import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from '@react-hook/debounce';
import { recentProjectsLoaded } from './store/recentProjects/actions';
import { ApplicationStore } from './store/sharedHelpers';
import ipc from './ipc';
import { isMergeSplitAllowed } from './store/selection/helpers';
import { ApplicationPage } from './store/currentPage/helpers';
import dispatchBroadcast from './collabClient/dispatchBroadcast';
import { selectionRangeSetTo } from './store/selection/actions';
import { getLengthOfRange } from './utils/range';

const { readRecentProjects, writeRecentProjects } = ipc;

/**
 * Component that handles sending off side effects when the store changes -
 * e.g. updating which menu items are active
 */
const StoreChangeObserver = () => {
  const recentProjects = useSelector(
    (store: ApplicationStore) => store.recentProjects
  );

  const currentProject = useSelector(
    (store: ApplicationStore) => store.currentProject
  );

  const words = useMemo(
    () => currentProject?.transcription?.words ?? [],
    [currentProject]
  );

  const currentPage = useSelector(
    (store: ApplicationStore) => store.currentPage
  );

  const isShowingConfidenceUnderlines = useSelector(
    (store: ApplicationStore) => store.isShowingConfidenceUnderlines
  );

  const clipboard = useSelector((store: ApplicationStore) => store.clipboard);

  const selfSelection = useSelector(
    (store: ApplicationStore) => store.selection.self
  );

  const editWordIndex = useSelector(
    (store: ApplicationStore) => store.editWord?.index
  );

  // Debounce the selection to limit network requests for sharing selection with other clients
  const [debouncedSelection, setDebouncedSelection] =
    useDebounce(selfSelection);

  // Update the debounced selection when the selection changes, but debounced
  useEffect(() => {
    setDebouncedSelection(selfSelection);
  }, [setDebouncedSelection, selfSelection]);

  const undoStack = useSelector((store: ApplicationStore) => store.undoStack);

  const [hasLoadedRecentProjects, setHasLoadedRecentProjects] =
    useState<boolean>(false);

  const [isProjectEdited, setProjectEdited] = useState<boolean>(false);

  const dispatch = useDispatch();

  // Load the recent projects from the back end when the app starts
  useEffect(() => {
    // Only load if we haven't yet for this app load
    if (hasLoadedRecentProjects) {
      return;
    }

    (async () => {
      const loadedRecentProjects = await readRecentProjects();
      dispatch(recentProjectsLoaded(loadedRecentProjects));
      setHasLoadedRecentProjects(true);
    })();
  }, [hasLoadedRecentProjects, setHasLoadedRecentProjects, dispatch]);

  // Persist the recent projects in the back end when the recentProjects changes in the store
  useEffect(() => {
    // If we haven't read yet, or the list of recent projects is empty, don't write
    if (!hasLoadedRecentProjects) {
      return;
    }

    writeRecentProjects(recentProjects);
  }, [recentProjects, hasLoadedRecentProjects]);

  // Update file menu item enablement (save, save as) when projects are opened and closed
  useEffect(() => {
    if (currentProject === null || currentProject.transcription === null) {
      // Can't save or save as when there is no project open
      ipc.setSaveEnabled(false, false);

      // No project -> no export
      ipc.setExportEnabled(false);

      // No file is represented
      ipc.setFileRepresentation(null, false);
    } else if (currentProject.projectFilePath === null) {
      // Can save, but not save as, when the project hasn't been saved yet
      ipc.setSaveEnabled(true, false);

      ipc.setExportEnabled(true);

      // No file is represented as the project hasn't been saved yet - however, we mark the window as 'dirty'
      ipc.setFileRepresentation(null, true);
    } else {
      // Can do either if the project has been saved already
      ipc.setSaveEnabled(true, true);

      // Allow export when saved
      ipc.setExportEnabled(true);

      // File is represented, dirty depends on if the project has been edited
      ipc.setFileRepresentation(
        currentProject.projectFilePath,
        currentProject.isEdited
      );
    }
  }, [currentProject, isProjectEdited, setProjectEdited]);

  // Update 'go to home' option in menu when page is changed
  useEffect(() => {
    const homeEnabled = currentPage === ApplicationPage.PROJECT;

    ipc.setHomeEnabled(homeEnabled);
  }, [currentPage]);

  // Update clipboard options in edit menu when clipboard or selection is changed
  useEffect(() => {
    const cutCopyDeleteEnabled = getLengthOfRange(selfSelection) > 0;

    // Selection must not be empty as we need somewhere to paste to
    const pasteEnabled =
      getLengthOfRange(selfSelection) > 0 && clipboard.length > 0;

    ipc.setClipboardEnabled(
      cutCopyDeleteEnabled,
      cutCopyDeleteEnabled,
      pasteEnabled,
      cutCopyDeleteEnabled
    );
  }, [clipboard, selfSelection]);

  // Update edit word option in edit menu when selection is changed
  useEffect(() => {
    // Allow user to edit word if there is a single word selected and it is not already being edited
    const editWordEnabled =
      getLengthOfRange(selfSelection) === 1 &&
      selfSelection.startIndex !== editWordIndex;
    ipc.setEditWordEnabled(editWordEnabled);
  }, [selfSelection, editWordIndex]);

  useEffect(() => {
    const selectSentenceEnabled = getLengthOfRange(selfSelection) > 0;
    ipc.setSelectSentenceEnabled(selectSentenceEnabled);
  }, [selfSelection]);

  // Broadcast selection actions to other clients whenever the selection changes (this is debounced)
  useEffect(() => {
    dispatchBroadcast(selectionRangeSetTo(debouncedSelection));
  }, [debouncedSelection]);

  // Update merge/split options in edit menu when selection is changed
  useEffect(() => {
    if (words.length === 0) {
      ipc.setMergeSplitEnabled(false, false);
      return;
    }

    const { merge, split } = isMergeSplitAllowed(words, selfSelection);

    ipc.setMergeSplitEnabled(merge, split);
  }, [words, selfSelection]);

  // Update undo/redo options in edit menu when undo stack is changed
  useEffect(() => {
    const { stack, index } = undoStack;

    const undoEnabled = index > 0;
    const redoEnabled = index < stack.length;

    ipc.setUndoRedoEnabled(undoEnabled, redoEnabled);
  }, [undoStack]);

  // Update whether 'show/hide confidence underlines' is enabled, and also its label
  useEffect(() => {
    ipc.setConfidenceLinesEnabled(words !== null);
  }, [isShowingConfidenceUnderlines, words]);

  // Component doesn't render anything
  return null;
};

export default StoreChangeObserver;
