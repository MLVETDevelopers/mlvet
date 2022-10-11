import { useDebounce } from '@react-hook/debounce';
import { useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useWindowResizer = (
  handler: (newWindowSize: { width: number; height: number }) => void
) => {
  const [windowSize, setWindowSize] = useDebounce(
    { width: window.innerWidth, height: window.innerHeight },
    0.1
  );

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setWindowSize]);

  useEffect(() => handler(windowSize), [windowSize, handler]);
};

export const useKeypress = (
  eventHandler: (() => void) | (() => Promise<void>),
  isKeypressEnabled: boolean,
  keypressCodes: string[]
) => {
  useEffect(() => {
    const handleKeypress = async (event: KeyboardEvent) => {
      if (keypressCodes.includes(event.code) && isKeypressEnabled) {
        eventHandler();
      }
    };

    window.addEventListener('keydown', handleKeypress);

    return () => {
      window.removeEventListener('keydown', handleKeypress);
    };
  }, [eventHandler, isKeypressEnabled, keypressCodes]);
};

export const useEventListener = (
  eventToListenTo: string,
  eventHandler: (event: any) => void
) => {
  useEffect(() => {
    window.addEventListener(eventToListenTo, eventHandler);
    return () => {
      window.removeEventListener(eventToListenTo, eventHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
