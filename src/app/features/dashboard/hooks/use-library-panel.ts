import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';

const FLOATING_LIBRARY_WIDTH = 360;
const FLOATING_LIBRARY_DOCK_GAP = 20;

export interface UseLibraryPanelReturn {
  libraryPanelRef: React.RefObject<HTMLDivElement | null>;
  isLibraryVisible: boolean;
  isLibraryCollapsed: boolean;
  libraryPosition: { x: number; y: number };
  handleStartLibraryDrag: (event: ReactPointerEvent<HTMLElement>) => void;
  toggleLibraryVisibility: () => void;
  expandLibrary: () => void;
  collapseLibraryToDock: () => void;
}

export function useLibraryPanel(): UseLibraryPanelReturn {
  const libraryPanelRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [isLibraryVisible, setIsLibraryVisible] = useState(false);
  const [isLibraryCollapsed, setIsLibraryCollapsed] = useState(false);
  const [libraryPosition, setLibraryPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const placePanel = () => {
      const width = window.innerWidth;
      const x = isLibraryCollapsed
        ? width - FLOATING_LIBRARY_DOCK_GAP
        : Math.max(16, width - FLOATING_LIBRARY_WIDTH - 32);
      const y = 170;
      setLibraryPosition((current) => (current.x === 0 && current.y === 0 ? { x, y } : current));
    };

    placePanel();
    window.addEventListener('resize', placePanel);
    return () => window.removeEventListener('resize', placePanel);
  }, [isLibraryCollapsed]);

  const handleStartLibraryDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (isLibraryCollapsed) return;

    const panel = libraryPanelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextX = Math.min(
        Math.max(8, moveEvent.clientX - dragOffsetRef.current.x),
        window.innerWidth - rect.width - 8
      );
      const nextY = Math.min(
        Math.max(88, moveEvent.clientY - dragOffsetRef.current.y),
        window.innerHeight - 120
      );
      setLibraryPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const toggleLibraryVisibility = () => {
    setIsLibraryVisible((current) => {
      if (current) {
        setIsLibraryCollapsed(false);
        return false;
      }

      setIsLibraryCollapsed(false);
      setLibraryPosition((position) => ({
        ...position,
        x: Math.max(16, window.innerWidth - FLOATING_LIBRARY_WIDTH - 32),
      }));
      return true;
    });
  };

  const expandLibrary = () => {
    setIsLibraryVisible(true);
    setIsLibraryCollapsed(false);
    setLibraryPosition((position) => ({
      ...position,
      x: Math.max(16, window.innerWidth - FLOATING_LIBRARY_WIDTH - 32),
    }));
  };

  const collapseLibraryToDock = () => {
    setIsLibraryVisible(true);
    setIsLibraryCollapsed(true);
    setLibraryPosition((position) => ({
      ...position,
      x: window.innerWidth - FLOATING_LIBRARY_DOCK_GAP,
    }));
  };

  return {
    libraryPanelRef,
    isLibraryVisible,
    isLibraryCollapsed,
    libraryPosition,
    handleStartLibraryDrag,
    toggleLibraryVisibility,
    expandLibrary,
    collapseLibraryToDock,
  };
}
