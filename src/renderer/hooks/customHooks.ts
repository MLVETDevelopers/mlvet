import { useEffect } from 'react';

function useCustomHook(
  handleContinue: () => Promise<void>,
  condition: boolean
) {
  useEffect(() => {
    const handleKeypress = async (event: KeyboardEvent) => {
      if (
        (event.code === 'Enter' || event.code === 'NumpadEnter') &&
        !condition
      ) {
        handleContinue();
      }
    };

    window.addEventListener('keypress', handleKeypress);

    return () => {
      window.removeEventListener('keypress', handleKeypress);
    };
  }, [handleContinue, condition]);
}

export default useCustomHook;
