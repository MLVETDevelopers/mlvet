import SliderUnstyled, {
  sliderUnstyledClasses,
} from '@mui/base/SliderUnstyled';
import { styled } from '@mui/material';
import { useMemo } from 'react';

const Slider = styled(SliderUnstyled)(`
  width: 100%;
  padding: 10px 0;
  display: inline-block;
  position: relative;
  cursor: pointer;
  touch-action: none;

  & .${sliderUnstyledClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 5px;
    background-color: #D9D9D9;
  }

  & .${sliderUnstyledClasses.track} {
    display: block;
    position: absolute;
    height: 5px;
    background-color: #FFB3554D;
  }

  & .${sliderUnstyledClasses.thumb} {
    position: absolute;
    width: 15px;
    height: 15px;
    margin-left: -5px;
    margin-top: -5px;
    border-radius: 50%;
    background-color: #FFB355;
  }
`);

const TimestampContainer = styled('div')({
  display: 'flex',
  flex: 1,
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginTop: -5,
});

const Timestamp = styled('div')({
  fontFamily: '"Roboto Mono", monospace',
  fontSize: 12,
});

interface ScrubberProps {
  startTime: number;
  endTime: number;
  currentTime: number;
}

const Scrubber = ({ startTime, endTime, currentTime }: ScrubberProps) => {
  const sliderValue = useMemo(() => {
    return (currentTime / endTime) * 100;
  }, [endTime, currentTime]);

  return (
    <div>
      <Slider defaultValue={0} value={sliderValue} />
      <TimestampContainer>
        <Timestamp>{startTime}</Timestamp>
        <Timestamp>{endTime}</Timestamp>
      </TimestampContainer>
    </div>
  );
};

export default Scrubber;
