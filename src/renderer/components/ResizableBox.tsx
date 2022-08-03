import { Box, BoxProps, styled } from '@mui/material';
import { clamp } from 'main/timeUtils';
import { useRef, useState } from 'react';

interface ResizableBoxProps extends BoxProps {
  width: number;
  minWidth: number;
}

const ResizeBorder = styled(Box)({
  position: 'absolute',
  zIndex: 8000,
  backgroundColor: '#4444ff',
  '&:active': {
    cursor: 'pointer',
  },
});

const HorizontalResizeBorder = styled(ResizeBorder)({
  height: '100%',
  width: '10px',
  top: 0,
  bottom: 0,
  cursor: 'w-resize',
});

const VerticalResizeBorder = styled(ResizeBorder)({
  width: '100%',
  height: '4px',
  left: 0,
  right: 0,
  cursor: 'n-resize',
});

interface ResizableProperties {
  dragStartPosition: {
    x: number;
    y: number;
  };
  dragStartSize: {
    width: number;
    height: number;
  };
}

const ResizableBox = ({ width, children, minWidth }: ResizableBoxProps) => {
  const resizablePropsRef = useRef<ResizableProperties>({
    dragStartSize: { width, height: 0 },
    dragStartPosition: { x: 0, y: 0 },
  });
  const [size, setSize] = useState({ width, height: 0 });

  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    resizablePropsRef.current.dragStartPosition = {
      x: e.clientX,
      y: e.clientY,
    };
    resizablePropsRef.current.dragStartSize = size;
  };

  const onDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.clientX !== 0) {
      let newWidth =
        resizablePropsRef.current.dragStartSize.width -
        (e.clientX - resizablePropsRef.current.dragStartPosition.x);
      newWidth = clamp(newWidth, minWidth, 4000);
      setSize({ ...size, width: newWidth });
    }
  };

  return (
    <Box
      sx={{
        width: `${size.width}px`,
        backgroundColor: 'red',
        position: 'relative',
      }}
    >
      <HorizontalResizeBorder
        sx={{ left: 0 }}
        onDragStart={onDragStart}
        onDrag={onDrag}
      />
      {children}
    </Box>
  );
};

export default ResizableBox;
