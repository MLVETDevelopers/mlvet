import { Box, styled, colors } from '@mui/material';
import { useRef } from 'react';

interface ResizeSliderProps {
  onDrag: (dragDistance: number) => void;
}

const Divider = styled(Box)({
  position: 'relative',
  width: '2px',
  backgroundColor: colors.grey[600],
});

const Slider = styled(Box)({
  opacity: 0,
  position: 'absolute',
  left: '-5px',
  right: '-5px',
  height: '100%',
  cursor: 'w-resize',
  '&:active': {
    cursor: 'pointer',
  },
});

const ResizeSlider = ({ onDrag }: ResizeSliderProps) => {
  const dragStartPositionRef = useRef(0);

  const onDragStartHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    dragStartPositionRef.current = e.clientX;
  };

  const onDragHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.clientX !== 0) {
      onDrag(e.clientX - dragStartPositionRef.current);
      dragStartPositionRef.current = e.clientX;
    }
  };

  return (
    <Divider id="divider">
      <Slider
        id="slider"
        onDragStart={onDragStartHandler}
        onDrag={onDragHandler}
      />
    </Divider>
  );
};

export default ResizeSlider;
