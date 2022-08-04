import { Box, styled, colors, BoxProps } from '@mui/material';
import { useRef } from 'react';

interface ResizeSliderProps extends BoxProps {
  onDragHandler: (dragDistance: number) => void;
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

const ResizeSlider = ({ onDragHandler, ...props }: ResizeSliderProps) => {
  const dragStartPositionRef = useRef(0);

  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    dragStartPositionRef.current = e.clientX;
    console.log('onDragStart');
  };

  const onDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.clientX !== 0) {
      onDragHandler(e.clientX - dragStartPositionRef.current);
      dragStartPositionRef.current = e.clientX;
    }
    console.log('onDrag');
  };

  const onDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('onDragEnd', e.clientX);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Divider id="divider" {...props}>
      <Slider
        id="slider"
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />
    </Divider>
  );
};

export default ResizeSlider;
