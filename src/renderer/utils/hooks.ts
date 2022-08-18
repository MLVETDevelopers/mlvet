import { useEffect } from 'react';
import { FunctionReturnVoid, FunctionReturnPromiseVoid } from 'sharedTypes';

function useKeypress(
  eventHandler: FunctionReturnPromiseVoid | FunctionReturnVoid,
  isKeypressEnabled: boolean,
  keypressCodes: string[]
) {
  useEffect(() => {
    const handleKeypress = async (event: KeyboardEvent) => {
      if (keypressCodes.includes(event.code) && isKeypressEnabled) {
        eventHandler();
      }
    };

    window.addEventListener('keypress', handleKeypress);

    return () => {
      window.removeEventListener('keypress', handleKeypress);
    };
  }, [eventHandler, isKeypressEnabled, keypressCodes]);
}

export default useKeypress;
