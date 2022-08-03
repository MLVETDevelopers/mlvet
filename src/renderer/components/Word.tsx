import styled from '@emotion/styled';
import { MouseEventHandler } from 'react';
import colors from '../colors';
import { handleSelectWord } from '../selection';

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
  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    seekToWord();
    handleSelectWord(event, index);
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
