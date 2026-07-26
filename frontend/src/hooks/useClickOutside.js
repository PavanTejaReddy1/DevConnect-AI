import { useEffect } from 'react';

export default function useClickOutside(ref, onOutsideClick, isActive = true) {
  useEffect(() => {
    if (!isActive) return undefined;

    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onOutsideClick();
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') onOutsideClick();
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [ref, onOutsideClick, isActive]);
}
