import { useEffect } from 'react';

function useKeypress(
  eventHandler: () => Promise<void>,
  condition: boolean,
  keypressCodes: string[]
) {
  useEffect(() => {
    const handleKeypress = async (event: KeyboardEvent) => {
      if (keypressCodes.includes(event.code) && !condition) {
        eventHandler();
      }
    };

    window.addEventListener('keypress', handleKeypress);

    return () => {
      window.removeEventListener('keypress', handleKeypress);
    };
  }, [eventHandler, condition, keypressCodes]);
}

export default useKeypress;
