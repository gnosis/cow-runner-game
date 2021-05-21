import { useEffect } from 'react';
/**
 * useKeyPress
 * @param {[string]} keys - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */
export default function useKeypress(keys: string[], action: () => void) {
  useEffect(() => {
    function onKeyup(e: KeyboardEvent) {
      console.log(`Key up: "${e.key}": `, e)
      if (keys.includes(e.code)) {
        action()
      }
    }
    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  }, []);
}