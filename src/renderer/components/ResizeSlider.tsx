import { Box, styled, colors, BoxProps } from '@mui/material';
import { clamp } from 'main/timeUtils';
import { useRef } from 'react';

interface ResizeSliderProps extends BoxProps {
  targetWidth: number;
  setTargetWidth: (targetWidth: number) => void;
  options: { minTargetWidth: number; maxTargetWidth: number };
}

const Divider = styled(Box)({
  position: 'relative',
  width: '2px',
  backgroundColor: colors.grey[600],
  borderRadius: '1px',
});

const Slider = styled(Box)({
  opacity: 0,
  position: 'absolute',
  left: '-5px',
  right: '-5px',
  top: '-5px',
  bottom: '-5px',
  cursor: 'ew-resize',
  '&:active': {
    cursor: 'pointer',
  },
  transition: '0.3s opacity ease',

  '&:hover': {
    opacity: 0.5,
    backgroundColor: colors.grey[600],
    borderRadius: '7px',
    transition: '0.3s opacity ease',
  },
});

const ResizeSlider = ({
  targetWidth,
  setTargetWidth,
  options: { minTargetWidth, maxTargetWidth },
  ...props
}: ResizeSliderProps) => {
  const dragStartWidth = useRef(targetWidth);
  const dragStartPositionRef = useRef(0);

  const onMouseMove = (e: { pageX: number }) => {
    const dragDistance = e.pageX - dragStartPositionRef.current;
    const newWidth = clamp(
      minTargetWidth,
      dragStartWidth.current - dragDistance,
      maxTargetWidth
    );
    setTargetWidth(newWidth);
  };

  const onMouseUp = () => {
    dragStartPositionRef.current = 0;
    document.body.removeEventListener('mousemove', onMouseMove);
  };

  const onMouseDown = (e: { pageX: number }) => {
    dragStartWidth.current = targetWidth;
    dragStartPositionRef.current = e.pageX;

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp, { once: true });
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Divider id="divider" {...props}>
      <Slider id="slider" onMouseDown={onMouseDown} />
    </Divider>
  );
};

export default ResizeSlider;
