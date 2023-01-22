import { TimeLineElement } from '../../@types/timeLineItem.interface';

export type SplitEmptySpaceBetweenTwoElement = {
  emptySpaceBoxRect: DOMRect;
  draggingFlutterRect: DOMRect;
  leftSideElement: TimeLineElement;
  rightSideElement: TimeLineElement;
  oneSecondInPx: number;
};

export type AddSpaceToRightSideElementFromDraggingElement = {
  draggingElementIndex: number;
  oneSecondInPx: number;
  draggingFlutterRect: DOMRect;
  draggingElement: TimeLineElement;
  activeContainer: TimeLineElement[];
};
export type UpdateElementIfPointerUpOnTimeLineContainer = {
  arr: TimeLineElement[][];
  timeLineContainerIndex: number;
  activeContainerIndex: number;
  draggingElementIndex: number;
  timeLineContainerRect: DOMRect;
  draggingFlutterRect: DOMRect;
  oneSecondInPx: number;
};

export type UpdateElementIfFlutterOverDraggingElement = {
  arr: TimeLineElement[][];
  emptySpaceBoxId: string | null;
  draggingFlutterRect: DOMRect;
  activeContainerIndex: number;
  oneSecondInPx: number;
  draggingElementIndex: number;
};

export type UpdateElementIfItIsOverOnAnotherElementEmptySpaceBox = {
  arr: TimeLineElement[][];
  activeContainerIndex: number;
  draggingElementIndex: number;
  draggingFlutterRect: DOMRect;
  oneSecondInPx: number;
  emptySpaceBoxId: string;
  overElementId: string;
};

export type OnPointerOverAnotherTimeLineElement = {
  arr: TimeLineElement[][];
  activeContainerIndex: number;
  draggingElementIndex: number;
  draggingFlutterRect: DOMRect;
  oneSecondInPx: number;
  overElementId: string;
};

export type AddNewLineHandler = {
  arr: TimeLineElement[][];
  addLineId: string;
  activeContainerIndex: number;
  draggingElementIndex: number;
  oneSecondInPx: number;
  draggingFlutterRect: DOMRect;
};
