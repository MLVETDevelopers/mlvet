import { useDebounce } from '@react-hook/debounce';
import { useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useWindowResizer = (handler: (newWindowSize: number) => void) => {
  const [windowSize, setWindowSize] = useDebounce(window.innerWidth, 0.1);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setWindowSize]);

  useEffect(() => handler(windowSize), [windowSize, handler]);
};
