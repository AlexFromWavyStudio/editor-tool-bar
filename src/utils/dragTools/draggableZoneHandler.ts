import React from 'react';

import { TimeLineElement } from '../../@types/timeLineItem.interface';
import {
    addNewLineHandler,
    emptyArraysFilter,
    onPointerOverAnotherTimeLineElement,
    updateElementIfFlutterOverDraggingElement,
    updateElementIfItIsOverOnAnotherElementEmptySpaceBox,
    updateElementIfPointerUpOnTimeLineContainer,
} from './cases';
import { addLinesClassName, draggingFlutterId, timeLineContainerClassName } from './constants';

type DraggableZoneHandler = {
  event: PointerEvent;
  draggableElementRefValue: React.MutableRefObject<any | null>;
  setScenes: React.Dispatch<React.SetStateAction<TimeLineElement[][]>>;
  overElementIdRefValue: React.MutableRefObject<string | null>;
  oneSecondInPxRef: React.MutableRefObject<number>;
  refAddLineId: React.MutableRefObject<string | null>;
};
export const draggableZoneHandler = ({
  event,
  draggableElementRefValue,
  setScenes,
  overElementIdRefValue,
  oneSecondInPxRef,
  refAddLineId,
}: DraggableZoneHandler) => {
  const onMouseUpInTimeLineContainer = (
    event as any
  ).target?.className?.includes(timeLineContainerClassName);
  const onMouseUpInAddLine =
    event.target instanceof HTMLElement &&
    event.target.classList.contains(addLinesClassName);
  let timeLineContainerRect: any = null;
  let timeLineContainerIndex: any = null;
  let emptySpaceBoxId = (event as any).target?.id?.includes("emptySpaceBox")
    ? (event as any).target.id
    : null;

  if (onMouseUpInTimeLineContainer) {
    timeLineContainerIndex = (event as any).target.id.split("-")[1];
    timeLineContainerRect = (event as any).target?.getBoundingClientRect();
  }
  const draggingFlutterRect = document
    .getElementById(draggingFlutterId)
    ?.getBoundingClientRect();

  // main logic

  if (draggableElementRefValue.current && draggingFlutterRect) {
    const draggingElementRect = document
      .getElementById(draggableElementRefValue.current.id)
      ?.getBoundingClientRect();
    if (draggingElementRect) {
      if (onMouseUpInAddLine) {
        const addLineId = (event.target as HTMLElement).id;

        return setScenes((prev) => [
          ...emptyArraysFilter(
            addNewLineHandler({
              addLineId: addLineId,
              arr: prev,
              draggingFlutterRect,
              oneSecondInPx: oneSecondInPxRef.current,
              activeContainerIndex:
                draggableElementRefValue.current.draggingContainerIndex,
              draggingElementIndex:
                draggableElementRefValue.current.draggingElementIndex,
            })
          ),
        ]);
      }
      if (timeLineContainerRect && timeLineContainerIndex != null) {
        return setScenes((prev) => {
          return [
            ...emptyArraysFilter(
              updateElementIfPointerUpOnTimeLineContainer({
                arr: prev,
                timeLineContainerIndex: Number(timeLineContainerIndex),
                draggingFlutterRect,
                oneSecondInPx: oneSecondInPxRef.current,
                timeLineContainerRect,
                activeContainerIndex:
                  draggableElementRefValue.current.draggingContainerIndex,
                draggingElementIndex:
                  draggableElementRefValue.current.draggingElementIndex,
              })
            ),
          ];
        });
      }

      if (
        overElementIdRefValue.current === draggableElementRefValue.current.id &&
        timeLineContainerIndex === null
      ) {
        if (
          !emptySpaceBoxId ||
          emptySpaceBoxId.split("?")[1] === draggableElementRefValue.current.id
        ) {
          return setScenes((prev) => {
            return [
              ...emptyArraysFilter(
                updateElementIfFlutterOverDraggingElement({
                  emptySpaceBoxId,
                  arr: prev,
                  activeContainerIndex:
                    draggableElementRefValue.current.draggingContainerIndex,
                  draggingElementIndex:
                    draggableElementRefValue.current.draggingElementIndex,
                  draggingFlutterRect,
                  oneSecondInPx: oneSecondInPxRef.current,
                })
              ),
            ];
          });
        }
      }

      if (timeLineContainerIndex === null && emptySpaceBoxId) {
        const overId = emptySpaceBoxId.split("?")[1];
        if (draggableElementRefValue.current.id != overId) {
          return setScenes((prev) => {
            return [
              ...emptyArraysFilter(
                updateElementIfItIsOverOnAnotherElementEmptySpaceBox({
                  arr: prev,
                  activeContainerIndex:
                    draggableElementRefValue.current.draggingContainerIndex,
                  draggingElementIndex:
                    draggableElementRefValue.current.draggingElementIndex,
                  draggingFlutterRect,
                  oneSecondInPx: oneSecondInPxRef.current,
                  emptySpaceBoxId,
                  overElementId: overId,
                })
              ),
            ];
          });
        }
      }

      if (
        timeLineContainerIndex === null &&
        !emptySpaceBoxId &&
        draggableElementRefValue.current &&
        overElementIdRefValue.current != null &&
        overElementIdRefValue.current != draggableElementRefValue.current.id
      ) {
        return setScenes((prev) => [
          ...emptyArraysFilter(
            onPointerOverAnotherTimeLineElement({
              arr: prev,
              activeContainerIndex:
                draggableElementRefValue.current.draggingContainerIndex,
              draggingElementIndex:
                draggableElementRefValue.current.draggingElementIndex,
              draggingFlutterRect,
              oneSecondInPx: oneSecondInPxRef.current,
              overElementId: overElementIdRefValue.current as string,
            })
          ),
        ]);
      }
    }
  }
};
