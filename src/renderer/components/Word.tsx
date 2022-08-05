import styled from '@emotion/styled';
import { MouseEventHandler, useEffect, useRef } from 'react';
import colors from '../colors';
import { handleSelectWord } from '../selection';
import { MousePosition } from '@react-hook/mouse-position';

const WordInner = styled('div')`
  display: inline-block;
  cursor: pointer;
  color: ${colors.white};
  transition: padding 0.1s, background 0.1s;
  padding: 0 2px;
  margin: 2px 0;

  &:hover {
    color: ${colors.grey['000']};
    background: ${colors.yellow[500]}50;
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
  isBeingDragged: boolean;
  mouse: MousePosition;
  isDropBeforeActive: boolean;
  isDropAfterActive: boolean;
  setDropBeforeActive: () => void;
  setDropAfterActive: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// TODO(chloe): move into util
/**
 * Determines if a point is inside a rectangle,
 * also returning true for boundary cases.
 */
const pointIsInsideRect: (point: Point, rect: Rect) => boolean = (
  point,
  rect
) =>
  point.x >= rect.x &&
  point.x <= rect.x + rect.w &&
  point.y >= rect.y &&
  point.y <= rect.y + rect.h;

const Word = ({
  index,
  seekToWord,
  isPlaying,
  isSelected,
  text,
  onMouseDown,
  onMouseUp,
  isBeingDragged,
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

  const mouseInLeft = pointIsInsideRect(
    { x: mouse.clientX ?? 0, y: mouse.clientY ?? 0 },
    {
      x: ref.current?.offsetLeft ?? 0,
      y: ref.current?.offsetTop ?? 0,
      w: (ref.current?.offsetWidth ?? 0) / 2,
      h: ref.current?.offsetHeight ?? 0,
    }
  );

  const mouseInRight = pointIsInsideRect(
    { x: mouse.clientX ?? 0, y: mouse.clientY ?? 0 },
    {
      x: (ref.current?.offsetLeft ?? 0) + (ref.current?.offsetWidth ?? 0) / 2,
      y: ref.current?.offsetTop ?? 0,
      w: (ref.current?.offsetWidth ?? 0) / 2,
      h: ref.current?.offsetHeight ?? 0,
    }
  );

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
