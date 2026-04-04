import {useEffect} from 'react';

/**
 * Listen for a key while `enabled` (document-level keydown).
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === key) {
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Remove listener on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [key, callback, enabled]);
}
