import styled from '@emotion/styled';
import { MouseEventHandler, useEffect, useRef, useMemo } from 'react';
import { MousePosition } from '@react-hook/mouse-position';
import { Point, pointIsInsideRect } from 'renderer/util';
import colors from '../colors';
import { handleSelectWord } from '../selection';

const makeWordInner = (isDragActive: boolean) => styled('div')`
  display: inline-block;
  cursor: pointer;
  color: ${colors.white};
  transition: padding 0.1s, background 0.1s;
  padding: 0 2px;
  margin: 2px 0;

  &:hover {
    color: ${colors.grey['000']};
    background: ${isDragActive ? 'none' : `${colors.yellow[500]}50`};
  }
`;

interface Props {
  index: number;
  seekToWord: () => void;
  isPlaying: boolean;
  isSelected: boolean;
  text: string;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
  onMouseUp: MouseEventHandler<HTMLDivElement>;
  isBeingDragged: boolean; // whether THIS word is currently being dragged
  isDragActive: boolean; // whether ANY word is currently being dragged
  mouse: MousePosition;
  isDropBeforeActive: boolean;
  isDropAfterActive: boolean;
  setDropBeforeActive: () => void;
  setDropAfterActive: () => void;
}

const Word = ({
  index,
  seekToWord,
  isPlaying,
  isSelected,
  text,
  onMouseDown,
  onMouseUp,
  isBeingDragged,
  isDragActive,
  mouse,
  isDropBeforeActive,
  isDropAfterActive,
  setDropBeforeActive,
  setDropAfterActive,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    seekToWord();
    handleSelectWord(event, index);

    // Prevent event from being received by the transcription block and therefore intercepted
    event.stopPropagation();
  };

  // TODO(chloe) optimise

  const xPosition = ref.current?.offsetLeft ?? 0;
  const yPosition = ref.current?.offsetTop ?? 0;
  const halfWidth = (ref.current?.offsetWidth ?? 0) / 2;
  const height = ref.current?.offsetHeight ?? 0;
  const mouseX = mouse.clientX ?? 0;
  const mouseY = mouse.clientY ?? 0;

  const mousePoint: Point = {
    x: mouseX,
    y: mouseY,
  };

  const mouseInLeft = pointIsInsideRect(mousePoint, {
    x: xPosition,
    y: yPosition,
    w: halfWidth,
    h: height,
  });

  const mouseInRight = pointIsInsideRect(mousePoint, {
    x: xPosition + halfWidth,
    y: yPosition,
    w: halfWidth,
    h: height,
  });

  useEffect(() => {
    if (mouseInLeft && !isDropBeforeActive) {
      setDropBeforeActive();
    }
    if (mouseInRight && !isDropAfterActive) {
      setDropAfterActive();
    }
  }, [
    mouseInLeft,
    mouseInRight,
    isDropBeforeActive,
    isDropAfterActive,
    setDropBeforeActive,
    setDropAfterActive,
  ]);

  const defaultStyles: React.CSSProperties = {
    zIndex: 0,
  };

  const highlightStyles: React.CSSProperties = (() => {
    if (isSelected || isBeingDragged) {
      return {
        background: `${colors.yellow[500]}cc`,
        color: colors.white,
        fontWeight: 'bold',
      };
    }
    if (isPlaying) {
      return {
        background: colors.blue[500],
        color: colors.white,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
      };
    }
    return {};
  })();

  const dragStyles: React.CSSProperties = isBeingDragged
    ? {
        position: 'fixed',
        left: mouse.clientX ?? undefined,
        top: mouse.clientY ?? undefined,
        zIndex: 100,
      }
    : {};

  const style = {
    ...defaultStyles,
    ...highlightStyles,
    ...dragStyles,
  };

  const WordInner = useMemo(() => makeWordInner(isDragActive), [isDragActive]);

  return (
    <WordInner
      ref={ref}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{ ...style, position: isBeingDragged ? 'fixed' : 'relative' }}
    >
      {text}
    </WordInner>
  );
};

export default Word;
