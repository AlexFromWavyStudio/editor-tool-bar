import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { SpringValue, useSpring } from 'react-spring';

import { TimeLineElement } from '../@types/timeLineItem.interface';
import { bottomAddLineId, topAddLineId } from '../utils/dragTools/constants';
import { draggableZoneHandler } from '../utils/dragTools/draggableZoneHandler';
import { useZoomAndRulerContext } from './useZoomAndRulerContext';

const noop = () => {};
const onPointerDownNoop = () => () => {};

interface DragZoneContext {
  draggableElement: any;
  setDraggableElement: Dispatch<SetStateAction<any>>;
  onPointerDown: (
    item: TimeLineElement
  ) => React.PointerEventHandler<HTMLDivElement>;
  onMouseMove: React.MouseEventHandler<HTMLDivElement>;
  springStyle: SpringStyle | null;
  overElementId: string | null;
  addNewContainer: () => void;
  addLineId: string | null;
}
type SpringStyle = {
  left: SpringValue<number>;
  top: SpringValue<number>;
};

const DragZoneContext = createContext<DragZoneContext>({
  draggableElement: null,
  setDraggableElement: noop,
  onPointerDown: onPointerDownNoop,
  onMouseMove: noop,
  springStyle: null,
  overElementId: null,
  addNewContainer: noop,
  addLineId: null,
});

export const useDragZoneContext = () => useContext(DragZoneContext);

export const DragZoneContextWrapper = ({
  children,
  setScenes,
}: {
  children: JSX.Element;
  setScenes: Dispatch<SetStateAction<TimeLineElement[][]>>;
}) => {
  const defaultSpringValue = {
    top: -1000,
    left: -1000,
    immediate: true,
  };
  const [springStyle, setSpringStyle] = useSpring(() => defaultSpringValue);

  const { oneSecondWidth } = useZoomAndRulerContext();

  const [draggableElement, setDraggableElement] = useState<any | null>(null);
  const [overElementId, setOverElementId] = useState<string | null>(null);
  const [addLineId, setAddLine] = useState<string | null>(null);

  const overElementIdRefValue = useRef<null | string>(null);
  const draggableElementRefValue = useRef<any>(null);
  const oneSecondInPxRef = useRef<number>(oneSecondWidth);
  const refAddLineId = useRef<string | null>(null);

  const onPointerDown = (item: any) => (event: any) => {
    const {
      nativeEvent: { offsetX, offsetY },
    } = event;
    setDraggableElement({ ...item, offsetX, offsetY });
    draggableElementRefValue.current = item;
    oneSecondInPxRef.current = oneSecondWidth;
  };

  const onPointerUp = (event: PointerEvent) => {
    draggableZoneHandler({
      event,
      draggableElementRefValue,
      overElementIdRefValue,
      oneSecondInPxRef,
      setScenes,
      refAddLineId,
    });

    setDraggableElement(null);
    setOverElementId(null);
    overElementIdRefValue.current = null;
    draggableElementRefValue.current = null;
    setSpringStyle(defaultSpringValue);
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const {
      nativeEvent: { x, y },
    } = event;

    const className = String((event.target as any)?.className);
    const someId = (event as any).target?.id;

    if (someId === bottomAddLineId || someId === topAddLineId) {
      setAddLine(someId);
      refAddLineId.current = someId;
    } else {
      setAddLine(null);
      refAddLineId.current = null;
    }

    if (
      (className?.includes("timeLineItems") ||
        className?.includes("ResizeHandle")) &&
      draggableElement
    ) {
      const overElId = (event.target as any).id;
      if (overElId != overElementId) {
        setOverElementId(overElId);
        overElementIdRefValue.current = overElId;
      }
    } else {
      setOverElementId(null);
    }
    if (draggableElement) {
      setSpringStyle({
        top: y - draggableElement.offsetY,
        left: x - draggableElement.offsetX,
        immediate: true,
      });
    }
  };

  const addNewContainer = () => {
    setScenes((prev) => {
      if (!prev[0].length) {
        return prev;
      }
      return [[], ...prev];
    });
  };

  const Provider = {
    onMouseMove,
    onPointerDown,
    draggableElement,
    setDraggableElement,
    springStyle,
    overElementId,
    addNewContainer,
    addLineId,
  };

  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    return () => document.removeEventListener("pointerup", onPointerUp);
  }, []);
  return (
    <DragZoneContext.Provider value={Provider}>
      {children}
    </DragZoneContext.Provider>
  );
};
