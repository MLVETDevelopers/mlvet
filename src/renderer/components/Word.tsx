import styled from '@emotion/styled';
import { MouseEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { IndexRange } from 'sharedTypes';
import {
  selectionCleared,
  selectionRangeToggled,
} from '../store/selection/actions';
import colors from '../colors';
import { expandSelectionToWord } from '../selection';

const WordInner = styled('div')`
  display: inline-block;
  cursor: pointer;

  &:hover {
    color: ${colors.grey['000']};
  }
`;

interface Props {
  index: number;
  seekToWord: () => void;
  isPlaying: boolean;
  isSelected: boolean;
  text: string;
}

const Word = ({ index, seekToWord, isPlaying, isSelected, text }: Props) => {
  const dispatch = useDispatch();

  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    seekToWord();

    const singleWordRange: IndexRange = {
      startIndex: index,
      endIndex: index + 1,
    };

    // TODO(chloe): check ctrl key only on windows, meta key only on mac
    const hasCmdCtrlModifier = event.metaKey || event.ctrlKey;
    const hasShiftModifier = event.shiftKey;

    if (hasCmdCtrlModifier) {
      // Cmd/Ctrl is held, so toggle the current word
      dispatch(selectionRangeToggled(singleWordRange));
    } else if (hasShiftModifier) {
      // Shift is held, so expand the selection out to the clicked word
      expandSelectionToWord(index);
    } else {
      // No modifier, so reset the selection to only be this word
      dispatch(selectionCleared());
      dispatch(selectionRangeToggled(singleWordRange));
    }
  };

  const style: { background: string; color: string; fontWeight?: string } =
    (() => {
      if (isSelected) {
        return {
          background: colors.yellow[500],
          color: colors.white,
          fontWeight: 'bold',
        };
      }
      if (isPlaying) {
        return {
          background: colors.blue[500],
          color: colors.white,
        };
      }
      return {
        background: 'none',
        color: colors.white,
      };
    })();

  return (
    <WordInner onClick={onClick} style={style}>
      {text}
    </WordInner>
  );
};

export default Word;
