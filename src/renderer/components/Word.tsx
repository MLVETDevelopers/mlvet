import styled from '@emotion/styled';
import { Fragment, MouseEventHandler, useRef } from 'react';
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
  mouseX: MousePosition['clientX'];
  mouseY: MousePosition['clientY'];
}

// TODO(chloe): move into util
const squaredDistance: (
  x1: number,
  x2: number,
  y1: number,
  y2: number
) => number = (x1, x2, y1, y2) => (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

const Word = ({
  index,
  seekToWord,
  isPlaying,
  isSelected,
  text,
  onMouseDown,
  onMouseUp,
  isBeingDragged,
  mouseX,
  mouseY,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    seekToWord();
    handleSelectWord(event, index);

    // Prevent event from being received by the transcription block and therefore intercepted
    event.stopPropagation();
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

  const dist = squaredDistance(
    mouseX ?? 0,
    ref.current?.offsetLeft ?? 0,
    mouseY ?? 0,
    ref.current?.offsetTop ?? 0
  );

  const mouseNear = dist < 1000;

  const dragStyles: React.CSSProperties = isBeingDragged
    ? {
        position: 'fixed',
        left: mouseX ?? undefined,
        top: mouseY ?? undefined,
      }
    : {
      background: mouseNear ? 'green' : undefined,
    };

  const style = {
    ...highlightStyles,
    ...dragStyles,
  };

  const renderedWord = (
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

  // const dropMarker = <div>DROP HERE</div>;

  return renderedWord;
};

export default Word;
