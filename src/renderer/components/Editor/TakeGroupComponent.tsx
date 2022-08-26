import { useState } from 'react';
import { TakeGroup } from 'sharedTypes';

interface TakeGroupComponentProps {
  takeGroup: TakeGroup;
}

const TakeGroupComponent = ({ takeGroup }: TakeGroupComponentProps) => {
  const [isTakeGroupOpened, setIsTakeGroupOpened] = useState(false);

  const openTakeGroup = () => {
    setIsTakeGroupOpened(true);
    console.log('Opened Take Group');
  };

  return (
    <>
      {takeGroup.takes.map((take: Take, index: number) => (
        <>
          {isTakeGroupOpened ? (
            <Avatar
              onClick={() => console.log(take, index)}
              sx={{
                height: 22,
                width: 22,
                fontSize: 12,
                color: '#1D201F',
                bgcolor:
                  takeGroup.activeTakeIndex === index ? '#FFB355' : '#ABA9A9',
              }}
            >
              {index + 1}
            </Avatar>
          ) : null}

          <Avatar
            onClick={openTakeGroup}
            style={{
              width: '10px',
              height: '10px',
              borderWidth: '0px',
              borderLeftWidth: '2px',
              backgroundColor: 'green',
              display: 'block',
            }}
          />
          <div
            className="take"
            style={{
              border: 'true',
              borderStyle: 'solid',
              borderWidth: '0px',
              borderLeftWidth: '2px',
              borderColor: '#FFB355',
            }}
          >
            {takeGroup.activeTakeIndex === index || isTakeGroupOpened
              ? takeGroup.takes[takeIndex].words.map((wordA, indexA) => {
                  return wordA.deleted ? null : (
                    <Fragment key={`${wordA.originalIndex}-${wordA.pasteKey}`}>
                      {space(
                        `space-${wordA.originalIndex}-${wordA.pasteKey}`,
                        dragState !== null && dropBeforeIndex === indexA
                      )}
                      <Word
                        key={`word-${wordA.originalIndex}-${wordA.pasteKey}`}
                        seekToWord={() => seekToWord(indexA)}
                        isPlaying={indexA === nowPlayingWordIndex}
                        isSelected={selectionSet.has(indexA)}
                        text={wordA.word}
                        index={indexA}
                        onMouseDown={onWordMouseDown(indexA)}
                        onMouseMove={() => onWordMouseMove(indexA)}
                        dragState={dragState}
                        isBeingDragged={isWordBeingDragged(indexA)}
                        mouse={
                          isWordBeingDragged(indexA) ? mouse : mouseThrottled
                        }
                        isDropBeforeActive={dropBeforeIndex === indexA}
                        isDropAfterActive={dropBeforeIndex === indexA + 1}
                        setDropBeforeIndex={setDropBeforeIndex}
                        cancelDrag={cancelDrag}
                      />
                      {indexA === transcription.words.length - 1 &&
                        space(
                          `space-end`,
                          dragState !== null &&
                            dropBeforeIndex === transcription.words.length
                        )}
                    </Fragment>
                  );
                })
              : null}
          </div>
        </>
      ))}
    </>
  );
};

export default TakeGroupComponent;
