import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import {
  selectionCleared,
  selectionRangeAdded,
} from 'renderer/store/selection/actions';
import colors from '../colors';

const WordInner = styled('div')`
  display: inline-block;
  cursor: pointer;

  &:hover {
    color: ${colors.grey['000']};
    background: ${colors.yellow[500]}80;
  }
`;

interface Props {
  index: number;
  seekToWord: () => void;
  isPlaying: boolean;
  text: string;
}

const Word = ({ index, seekToWord, isPlaying, text }: Props) => {
  const dispatch = useDispatch();

  const onClick: () => void = () => {
    seekToWord();
    dispatch(selectionCleared());
    dispatch(selectionRangeAdded({ startIndex: index, endIndex: index + 1 }));
  };

  return (
    <WordInner
      onClick={onClick}
      style={isPlaying ? { background: `${colors.yellow[500]}` } : {}}
    >
      {text}
    </WordInner>
  );
};

export default Word;
