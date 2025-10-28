import { useEffect, RefObject } from "react";

/**
 * Hook to handle keyboard shortcuts for search input
 * - Ctrl+K / Cmd+K: focus and select search input
 * - "/": focus search input
 * - Shift+"/": focus search input
 * - Escape: blur search input
 */
export function useSearchShortcuts(
  inputRef: RefObject<HTMLInputElement | null>,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!inputRef.current) return;

      // Ctrl+K or Cmd+K to focus and select search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current.focus();
        inputRef.current.select();
      }

      // "/" to focus search (only if not already focused)
      if (e.key === "/" && !inputRef.current.matches(":focus")) {
        e.preventDefault();
        inputRef.current.focus();
      }

      // Shift+/ (?) to focus search (only if not already focused)
      if (e.shiftKey && e.key === "?" && !inputRef.current.matches(":focus")) {
        e.preventDefault();
        inputRef.current.focus();
      }

      // Escape to blur/unfocus search input
      if (e.key === "Escape" && inputRef.current.matches(":focus")) {
        e.preventDefault();
        inputRef.current.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputRef]);
}
