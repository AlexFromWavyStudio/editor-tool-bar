import { useSpring } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

import { useMenuAndSelectContext } from './useMenuAndSelectContext';

export type PointCoordinates = { x: number; y: number };

const componentDefaultSpringStyles = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
};

export const useLassoSelect = (areaElementId: string) => {
  const [springStyles, setSpringStyles] = useSpring(
    () => componentDefaultSpringStyles
  );
  const lassoStartingPointValues = useRef<PointCoordinates | null>(null);
  const [isLassoStarted, setIsLassoStarted] = useState(false);
  const { setSelectedElements } = useMenuAndSelectContext();

  const handleSelectedItems = ({ startingX, startingY, x, y }: any) => {
    const allItems = document.getElementsByClassName("timeLineItems");
    const selectedItems = [...allItems]
      .map((item) => {
        const elementCoords = item.getBoundingClientRect();

        const startX = Math.min(startingX, x);
        const endX = Math.max(startingX, x);
        const startY = Math.min(startingY, y);
        const endY = Math.max(startingY, y);
        if (
          elementCoords.x >= startX &&
          elementCoords.x <= endX &&
          elementCoords.y >= startY &&
          elementCoords.y <= endY
        ) {
          return item.id;
        }
      })
      .filter((el) => el != undefined);
    return selectedItems;
  };
  const handleMouseMove = (event: MouseEvent) => {
    if (lassoStartingPointValues.current == null) {
      return;
    }

    const { x: startingX, y: startingY } = lassoStartingPointValues.current;
    const { x, y } = event;
    const width = Math.max(x, startingX) - Math.min(x, startingX);
    const height = Math.max(y, startingY) - Math.min(y, startingY);
    const left = Math.min(x, startingX);
    const top = Math.min(y, startingY);

    setSpringStyles({
      left,
      top,
      width,
      height,
      immediate: true,
    });
  };

  const handlePointerDown = (event: PointerEvent) => {
    const className = String((event.target as any)?.className);
    const parentElementClassName = String(
      (event.target as any)?.parentElement?.className
    );

    if (
      className?.includes("ResizeHandle") ||
      className?.includes("timeLineItems") ||
      parentElementClassName?.includes("ResizeHandle") ||
      className?.includes("addContainerButton") ||
      className?.includes("TimeMarker") ||
      parentElementClassName?.includes("TimeMarker") ||
      className?.includes("TimeMarkerHandle") ||
      parentElementClassName?.includes("TimeMarkerHandle")
    ) {
      return;
    }

    const el = document.getElementById(areaElementId);

    if (el == null) {
      return;
    }

    const { x, y } = event;
    lassoStartingPointValues.current = { x, y };

    el.addEventListener("mousemove", handleMouseMove);
    setIsLassoStarted(true);
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (lassoStartingPointValues.current != null) {
      const { x: startingX, y: startingY } = lassoStartingPointValues.current;
      const { x, y } = event;

      const selectedArray = handleSelectedItems({ startingX, startingY, x, y });
      setSelectedElements(selectedArray as string[]);
      lassoStartingPointValues.current = null;
    }

    if (isLassoStarted) {
      setIsLassoStarted(false);
    }

    setSpringStyles({ ...componentDefaultSpringStyles, immediate: true });
  };

  useEffect(() => {
    const el = document.getElementById(areaElementId);

    if (el == null) {
      return;
    }

    el.addEventListener("pointerdown", handlePointerDown);
    el.addEventListener("pointerup", handlePointerUp);
  }, []);

  return {
    springStyles,
    handlePointerDown,
    handlePointerUp,
    isLassoStarted,
    handleMouseMove,
  };
};
