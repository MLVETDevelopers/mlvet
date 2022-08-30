import { MousePosition } from '@react-hook/mouse-position';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { isTakeGroup } from 'renderer/utils/takeDetection';
import { TakeGroup, Transcription, Word } from 'sharedTypes';
import TakeGroupComponent from './TakeGroupComponent';
import { DragState, WordMouseHandler } from './WordDragManager';
import WordOuterComponent from './WordOuterComponent';

interface TranscriptionChunkProps {
  chunk: Word | TakeGroup;
  chunkIndex: number;
  onWordMouseDown: WordMouseHandler;
  onWordMouseMove: any;
  dragState: DragState;
  isWordBeingDragged: (wordIndex: number) => boolean;
  mousePosition: MousePosition | null;
  mouseThrottled: MousePosition | null;
  dropBeforeIndex: number | null;
  setDropBeforeIndex: Dispatch<SetStateAction<number | null>>;
  cancelDrag: () => void;
  editWord: any;
  nowPlayingWordIndex: number | null;
  transcription: Transcription;
  seekToWord: (wordIndex: number) => void;
  submitWordEdit: () => void;
  selectionSet: Set<any>;
  popoverWidth: number;
  transcriptionBlockRef: RefObject<HTMLElement>;
}

const TranscriptionChunk = ({
  chunk,
  chunkIndex,
  onWordMouseDown,
  onWordMouseMove,
  dragState,
  isWordBeingDragged,
  mousePosition,
  mouseThrottled,
  dropBeforeIndex,
  setDropBeforeIndex,
  cancelDrag,
  editWord,
  nowPlayingWordIndex,
  transcription,
  seekToWord,
  submitWordEdit,
  selectionSet,
  popoverWidth,
  transcriptionBlockRef,
}: TranscriptionChunkProps) => {
  return isTakeGroup(chunk) ? (
    <TakeGroupComponent
      takeGroup={chunk as TakeGroup}
      chunkIndex={chunkIndex}
      onWordMouseDown={onWordMouseDown}
      onWordMouseMove={onWordMouseMove}
      dragState={dragState}
      isWordBeingDragged={isWordBeingDragged}
      mousePosition={mousePosition}
      mouseThrottled={mouseThrottled}
      dropBeforeIndex={dropBeforeIndex}
      setDropBeforeIndex={setDropBeforeIndex}
      cancelDrag={cancelDrag}
      editWord={editWord}
      nowPlayingWordIndex={nowPlayingWordIndex}
      transcription={transcription}
      seekToWord={seekToWord}
      submitWordEdit={submitWordEdit}
      selectionSet={selectionSet}
    />
  ) : (
    <WordOuterComponent
      word={chunk as Word}
      index={chunkIndex}
      transcription={transcription}
      seekToWord={seekToWord}
      selectionSet={selectionSet}
      onWordMouseDown={onWordMouseDown}
      onWordMouseMove={onWordMouseMove}
      dragState={dragState}
      isWordBeingDragged={isWordBeingDragged}
      mouse={mousePosition}
      mouseThrottled={mouseThrottled}
      dropBeforeIndex={dropBeforeIndex}
      setDropBeforeIndex={setDropBeforeIndex}
      cancelDrag={cancelDrag}
      submitWordEdit={submitWordEdit}
      editWord={editWord}
      nowPlayingWordIndex={nowPlayingWordIndex}
      isInInactiveTake={false}
      popoverWidth={popoverWidth}
      transcriptionBlockRef={transcriptionBlockRef}
    />
  );
};

export default TranscriptionChunk;
