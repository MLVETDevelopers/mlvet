import { useMemo, useState } from 'react';
import SliderUnstyled, {
  sliderUnstyledClasses,
} from '@mui/base/SliderUnstyled';
import { styled } from '@mui/material';
import { secondToTimestampUI } from 'main/timeUtils';
import colors from 'renderer/colors';

const Slider = styled(SliderUnstyled)(`
  width: 100%;
  padding: 10px 0;
  display: inline-block;
  position: relative;
  cursor: pointer;

  &:hover .${sliderUnstyledClasses.thumb} {
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  & .${sliderUnstyledClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 5px;
    background-color: ${colors.grey[300]};
  }

  & .${sliderUnstyledClasses.track} {
    display: block;
    position: absolute;
    height: 5px;
    background-color: ${colors.yellow[500]}CC;
  }

  & .${sliderUnstyledClasses.thumb} {
    position: absolute;
    width: 15px;
    height: 15px;
    margin-left: -5px;
    margin-top: -5px;
    border-radius: 50%;
    background-color: ${colors.yellow[500]};
    opacity: 0;
    transition: opacity 0.2s ease;
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
  cursor: 'pointer',
});

interface ScrubberProps {
  totalDuration: number;
  currentTimeSeconds: number;
  onScrubberChange: (newTime: number) => void;
}

const Scrubber = ({
  totalDuration,
  currentTimeSeconds,
  onScrubberChange,
}: ScrubberProps) => {
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const sliderValue = useMemo(() => {
    return (currentTimeSeconds / totalDuration) * 100;
  }, [currentTimeSeconds, totalDuration]);

  const sliderValueToSeconds = (value: number) => (value / 100) * totalDuration;

  const getNewTime = (newSliderValue: number | number[]) => {
    // The MUI slider component can return a number or an array of numbers. For this usage
    // we only get a single number, however we still need to check if the value is an array or
    // not. If it is an array, we take the first value. This does however have a side effect
    // of the value being null, in this case, we just return the current timestamp.
    if (typeof newSliderValue === 'number') {
      return sliderValueToSeconds(newSliderValue);
    }

    const value = newSliderValue.shift();
    return value ? sliderValueToSeconds(value) : currentTimeSeconds;
  };

  return (
    <div>
      <Slider
        defaultValue={0}
        value={sliderValue}
        onChange={(_, value) => onScrubberChange(getNewTime(value))}
      />
      <TimestampContainer>
        <Timestamp>{secondToTimestampUI(currentTimeSeconds, false)}</Timestamp>
        <Timestamp onClick={() => setShowRemainingTime(!showRemainingTime)}>
          {showRemainingTime
            ? `-${secondToTimestampUI(
                totalDuration - currentTimeSeconds,
                false
              )}`
            : secondToTimestampUI(totalDuration, false)}
        </Timestamp>
      </TimestampContainer>
    </div>
  );
};

export default Scrubber;
