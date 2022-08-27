import { Avatar } from '@mui/material';
import { useState } from 'react';
import { Take, TakeGroup } from 'sharedTypes';
import TakeComponent from './TakeComponent';

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
      {Array.isArray(takeGroup?.takes) &&
        takeGroup.takes.map((take: Take, index: number) => (
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
              {takeGroup.activeTakeIndex === index || isTakeGroupOpened ? (
                <TakeComponent take={takeGroup?.takes?.[index] as Take} />
              ) : null}
            </div>
          </>
        ))}
    </>
  );
};

export default TakeGroupComponent;
