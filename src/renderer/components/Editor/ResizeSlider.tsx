import { Box, styled, colors, BoxProps } from '@mui/material';
import { clamp } from 'main/timeUtils';
import React, { useCallback, DragEvent, useEffect, useRef } from 'react';

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
  left: '-16px',
  right: '-16px',
  top: '-16px',
  bottom: '-16px',
  cursor: 'ew-resize',
  '&:active': {
    cursor: 'pointer',
  },
  transition: '0.3s opacity ease',

  '&:hover': {
    opacity: 0.5,
    backgroundColor: colors.grey[600],
    borderRadius: '17px',
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

  const onMouseEnter = useCallback(
    (e: { pageX: number }) => {
      const dragDistance = e.pageX - dragStartPositionRef.current;
      const newWidth = clamp(
        minTargetWidth,
        dragStartWidth.current - dragDistance,
        maxTargetWidth
      );
      setTargetWidth(newWidth);
    },
    [
      dragStartPositionRef,
      minTargetWidth,
      dragStartWidth,
      maxTargetWidth,
      setTargetWidth,
    ]
  );

  const onMouseUp = useCallback(() => {
    dragStartPositionRef.current = 0;
    document.body.removeEventListener('mousemove', onMouseEnter);
  }, [dragStartPositionRef, onMouseEnter]);

  const onMouseDown = useCallback(
    (e: { pageX: number }) => {
      dragStartWidth.current = targetWidth;
      dragStartPositionRef.current = e.pageX;

      document.body.addEventListener('mousemove', onMouseEnter);
      document.body.addEventListener('mouseup', onMouseUp, { once: true });
    },
    [dragStartWidth, dragStartPositionRef, onMouseEnter, onMouseUp, targetWidth]
  );

  // Needed to avoid div 'forking' bug with weird cursor icon
  const onDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>) => e.preventDefault(),
    []
  );

  // Cleanup for event listeners when components unmounts
  useEffect(() => {
    return () => {
      document.body.removeEventListener('mousemove', onMouseEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Divider id="divider" {...props}>
      <Slider id="slider" onMouseDown={onMouseDown} onDragStart={onDragStart} />
    </Divider>
  );
};

export default React.memo(ResizeSlider);
