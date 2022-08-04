import styled from '@emotion/styled';
import { MouseEventHandler } from 'react';
import colors from '../colors';
import { handleSelectWord } from '../selection';

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
}

const Word = ({ index, seekToWord, isPlaying, isSelected, text }: Props) => {
  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    seekToWord();
    handleSelectWord(event, index);

    // Prevent event from being received by the transcription block and therefore intercepted
    event.stopPropagation();
  };

  const style: React.CSSProperties = (() => {
    if (isSelected) {
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

  return (
    <WordInner onClick={onClick} style={style}>
      {text}
    </WordInner>
  );
};

export default Word;
