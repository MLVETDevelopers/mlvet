/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import { Box, Button, styled } from '@mui/material';
import { bold } from 'chalk';
import { useRef, useState } from 'react';
import colors from 'renderer/colors';

const RestorePopover = () => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const arrowRef = useRef<HTMLElement>(null);

  const { x, y, reference, floating, strategy, refs } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'top',
    strategy: 'fixed',
    middleware: [
      offset(6),
      shift(),
      arrow({
        element: () => {
          return arrowRef;
        },
      }),
    ],
  });

  const Arrow = styled(Box)({
    position: 'absolute',
    background: colors.grey[600],
    width: '8px',
    height: '8px',
    transform: 'rotate(45deg)',
  });

  function update() {
    computePosition(refs.reference.current!, refs.floating.current!, {
      placement: 'top',
      middleware: [
        offset(6),
        flip(),
        shift({ padding: 5 }),
        arrow({
          element: () => {
            return arrowRef.current;
          },
        }),
      ],
      // eslint-disable-next-line @typescript-eslint/no-shadow
    }).then(({ x, y, middlewareData }) => {
      Object.assign(refs.floating.current!.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      // Accessing the data
      const { x: arrowX } = middlewareData.arrow as any;

      Object.assign(arrowRef.current!.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        bottom: '-4px',
      });
    });
  }

  function handleButtonClick() {
    setPopoverVisible(!popoverVisible);
    update();
  }

  return (
    <>
      <Button id="button" aria-describedby="tooltip" ref={reference}>
        My button
      </Button>
      <Box
        id="tooltip"
        role="tooltip"
        ref={floating}
        onClick={handleButtonClick}
        sx={{
          background: colors.grey[600],
          fontWeight: bold,
          padding: '5px',
          borderRadius: '4px',
          fontSize: '90%',
          pointerEvents: 'none',
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          display: popoverVisible ? 'block' : '',
        }}
      >
        My tooltip
        <Arrow id="arrow" ref={arrowRef} />
      </Box>
    </>
  );
};

export default RestorePopover;
