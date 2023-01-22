import { TimeLineElement } from '../../@types/timeLineItem.interface';
import {
  AddNewLineHandler,
  AddSpaceToRightSideElementFromDraggingElement,
  OnPointerOverAnotherTimeLineElement,
  SplitEmptySpaceBetweenTwoElement,
  UpdateElementIfFlutterOverDraggingElement,
  UpdateElementIfItIsOverOnAnotherElementEmptySpaceBox,
  UpdateElementIfPointerUpOnTimeLineContainer,
} from './cases.types';
import { topAddLineId } from './constants';

export const updateElementIfPointerUpOnTimeLineContainer = ({
  arr,
  timeLineContainerIndex,
  activeContainerIndex,
  draggingElementIndex,
  timeLineContainerRect,
  draggingFlutterRect,
  oneSecondInPx,
}: UpdateElementIfPointerUpOnTimeLineContainer): any => {
  const newArray = [...arr];
  const timeLineContainer = arr[timeLineContainerIndex];
  const activeContainer = arr[activeContainerIndex];
  const element = arr[activeContainerIndex][draggingElementIndex];

  addSpaceToRightSideElementFromDraggingElement({
    draggingElement: element,
    draggingElementIndex: draggingElementIndex,
    draggingFlutterRect,
    oneSecondInPx,
    activeContainer,
  });

  newArray[activeContainerIndex] = activeContainer.filter(
    (_, i) => i != draggingElementIndex
  );

  if (
    timeLineContainerIndex != activeContainerIndex &&
    timeLineContainer.length === 0
  ) {
    const difference = (draggingFlutterRect.x / oneSecondInPx) * 1000;
    element.emptyDuration = difference < 0 ? 0 : difference;
    timeLineContainer.push(element);
    newArray[timeLineContainerIndex] = timeLineContainer;
    return newArray;
  }
  const lastContainerRect = document
    .getElementById(timeLineContainer[timeLineContainer.length - 1].id)
    ?.getBoundingClientRect();
  if (!lastContainerRect) return newArray;

  if (
    timeLineContainerIndex === activeContainerIndex &&
    draggingElementIndex === arr[activeContainerIndex].length - 1
  ) {
    const difference =
      ((draggingFlutterRect.x -
        lastContainerRect.right +
        draggingFlutterRect.width) /
        oneSecondInPx) *
      1000;
    element.emptyDuration = element.emptyDuration + difference;
  } else {
    const difference =
      ((draggingFlutterRect.x - lastContainerRect.right) / oneSecondInPx) *
      1000;
    element.emptyDuration = difference < 0 ? 0 : difference;
  }

  newArray[timeLineContainerIndex].push(element);

  return newArray;
};

export const updateElementIfFlutterOverDraggingElement = ({
  emptySpaceBoxId,
  draggingFlutterRect,
  arr,
  draggingElementIndex,
  oneSecondInPx,
  activeContainerIndex,
}: UpdateElementIfFlutterOverDraggingElement) => {
  const newArr = [...arr];
  const activeContainer = arr[activeContainerIndex];
  const element = activeContainer[draggingElementIndex];

  const draggingElementRect = document
    .getElementById(element.id)
    ?.getBoundingClientRect();

  if (!draggingElementRect) return newArr;

  if (!emptySpaceBoxId) {
    const difference =
      ((draggingElementRect.x - draggingFlutterRect.x) / oneSecondInPx) * 1000;

    const nextElementAfterDraggingElementIndex = draggingElementIndex + 1;
    const nextElementAfterDraggingElement =
      activeContainer[nextElementAfterDraggingElementIndex];
    if (difference < 0) {
      element.emptyDuration = element.emptyDuration + Math.abs(difference);
      if (
        nextElementAfterDraggingElement &&
        nextElementAfterDraggingElement.emptyDuration > 0
      ) {
        if (
          nextElementAfterDraggingElement.emptyDuration - Math.abs(difference) <
          0
        ) {
          nextElementAfterDraggingElement.emptyDuration = 0;
        } else {
          nextElementAfterDraggingElement.emptyDuration =
            nextElementAfterDraggingElement.emptyDuration -
            Math.abs(difference);
        }
      }
    } else if (element.emptyDuration - difference < 0) {
      if (nextElementAfterDraggingElement) {
        nextElementAfterDraggingElement.emptyDuration =
          nextElementAfterDraggingElement.emptyDuration + element.emptyDuration;
      }
      element.emptyDuration = 0;
    } else {
      element.emptyDuration = element.emptyDuration - difference;
      if (nextElementAfterDraggingElement) {
        nextElementAfterDraggingElement.emptyDuration =
          nextElementAfterDraggingElement.emptyDuration + difference;
      }
    }
    activeContainer[draggingElementIndex] = element;
    if (nextElementAfterDraggingElement) {
      activeContainer[nextElementAfterDraggingElementIndex] =
        nextElementAfterDraggingElement;
    }
    newArr[activeContainerIndex] = activeContainer;
    return newArr;
  }

  const emptySpaceBoxRect = document
    .getElementById(emptySpaceBoxId)
    ?.getBoundingClientRect();

  if (!emptySpaceBoxRect) return newArr;
  if (emptySpaceBoxId.split("?")[1] != element.id) return newArr;

  const nextElementAfterDraggingElementIndex = draggingElementIndex + 1;
  const nextElementAfterDraggingElement =
    activeContainer[nextElementAfterDraggingElementIndex];

  const difference =
    ((emptySpaceBoxRect.right - draggingFlutterRect.x) / oneSecondInPx) * 1000;
  if (element.emptyDuration - difference < 0) {
    if (nextElementAfterDraggingElement) {
      nextElementAfterDraggingElement.emptyDuration =
        nextElementAfterDraggingElement.emptyDuration + element.emptyDuration;
    }
    element.emptyDuration = 0;
  } else {
    element.emptyDuration = element.emptyDuration - difference;
    if (nextElementAfterDraggingElement) {
      nextElementAfterDraggingElement.emptyDuration =
        nextElementAfterDraggingElement.emptyDuration + difference;
    }
  }

  if (nextElementAfterDraggingElement) {
    activeContainer[nextElementAfterDraggingElementIndex] =
      nextElementAfterDraggingElement;
  }
  activeContainer[draggingElementIndex] = element;
  newArr[activeContainerIndex] = activeContainer;

  return newArr;
};

export const updateElementIfItIsOverOnAnotherElementEmptySpaceBox = ({
  arr,
  activeContainerIndex,
  draggingElementIndex,
  draggingFlutterRect,
  oneSecondInPx,
  emptySpaceBoxId,
  overElementId,
}: UpdateElementIfItIsOverOnAnotherElementEmptySpaceBox) => {
  const newArr = [...arr];
  const activeContainer = arr[activeContainerIndex];
  const element = activeContainer[draggingElementIndex];
  const overContainerIndex = Object.keys(arr).find((key) =>
    arr[Number(key)].find((el) => el.id === overElementId)
  );
  let overContainerIndexNumber;

  if (overContainerIndex === undefined) return newArr;

  overContainerIndexNumber = Number(overContainerIndex);
  const overContainer = arr[overContainerIndexNumber];
  const overElementIndex = Object.keys(overContainer).find(
    (key) => overContainer[Number(key)].id === overElementId
  );
  let overElementIndexNumber: number;

  if (overElementIndex === undefined) return newArr;

  overElementIndexNumber = Number(overElementIndex);
  const overElement = overContainer[overElementIndexNumber];
  const emptySpaceBoxRect = document
    .getElementById(emptySpaceBoxId)
    ?.getBoundingClientRect();

  if (!emptySpaceBoxRect) return newArr;
  if (
    overElementIndexNumber === 0 &&
    overContainerIndexNumber != activeContainerIndex
  ) {
    const mutatedActiveContainer =
      addSpaceToRightSideElementFromDraggingElement({
        draggingElement: element,
        draggingElementIndex,
        draggingFlutterRect,
        oneSecondInPx,
        activeContainer,
      });

    newArr[activeContainerIndex] = mutatedActiveContainer.filter(
      (_, i) => i != draggingElementIndex
    );

    const { leftSideElement, rightSideElement } =
      splitEmptySpaceBetweenTwoElement({
        rightSideElement: overElement,
        leftSideElement: element,
        emptySpaceBoxRect,
        draggingFlutterRect,
        oneSecondInPx,
      });
    overContainer.shift();
    newArr[overContainerIndexNumber] = [
      leftSideElement,
      rightSideElement,
      ...overContainer,
    ];
    return newArr;
  }
  const activeElementRect = document
    .getElementById(activeContainer[draggingElementIndex].id)
    ?.getBoundingClientRect();
  if (
    overContainerIndexNumber === activeContainerIndex &&
    overElementIndexNumber - 1 === draggingElementIndex &&
    activeElementRect
  ) {
    const overElementEmptyDuration =
      ((emptySpaceBoxRect.right - draggingFlutterRect.right) / oneSecondInPx) *
      1000;
    const elementEmptyDuration =
      ((draggingFlutterRect.x - activeElementRect.x) / oneSecondInPx) * 1000;
    if (elementEmptyDuration < 0) {
      element.emptyDuration = 0;
    } else {
      element.emptyDuration = element.emptyDuration + elementEmptyDuration;
    }
    if (overElementEmptyDuration < 0) {
      overElement.emptyDuration = 0;
    } else {
      overElement.emptyDuration = overElementEmptyDuration;
    }
    activeContainer[overElementIndexNumber] = overElement;
    activeContainer[draggingElementIndex] = element;
    newArr[activeContainerIndex] = activeContainer;
    newArr[activeContainerIndex] = activeContainer;

    return newArr;
  }

  if (
    overContainerIndexNumber === activeContainerIndex &&
    overElementIndexNumber - 1 != draggingElementIndex
  ) {
    addSpaceToRightSideElementFromDraggingElement({
      draggingElement: element,
      draggingElementIndex,
      draggingFlutterRect,
      oneSecondInPx,
      activeContainer,
    });
    const { leftSideElement, rightSideElement } =
      splitEmptySpaceBetweenTwoElement({
        leftSideElement: element,
        rightSideElement: overElement,
        oneSecondInPx,
        draggingFlutterRect,
        emptySpaceBoxRect,
      });

    activeContainer[overElementIndexNumber] = rightSideElement;

    /* here used null how temporary element 
      so that the indexes of the elements do 
      not change until the array receives updated elements
    */
    const filteredActiveContainer: any = activeContainer.map((el, index) => {
      if (index === draggingElementIndex) {
        return null;
      }
      return el;
    });

    newArr[activeContainerIndex] = filteredActiveContainer
      .flatMap((el: any, index: any) => {
        if (index === overElementIndexNumber) {
          return [leftSideElement, el];
        }
        return el;
      })
      .filter((el: any) => el != null);
    return newArr;
  }

  if (overContainerIndexNumber != activeContainerIndex) {
    addSpaceToRightSideElementFromDraggingElement({
      draggingElement: element,
      draggingElementIndex,
      draggingFlutterRect,
      oneSecondInPx,
      activeContainer,
    });
    const { leftSideElement, rightSideElement } =
      splitEmptySpaceBetweenTwoElement({
        leftSideElement: element,
        rightSideElement: overElement,
        draggingFlutterRect,
        emptySpaceBoxRect,
        oneSecondInPx,
      });

    overContainer[overElementIndexNumber] = rightSideElement;

    newArr[activeContainerIndex] = activeContainer.filter(
      (_, i) => i != draggingElementIndex
    );
    newArr[overContainerIndexNumber] = overContainer.flatMap((el, index) => {
      if (index === overElementIndexNumber) {
        return [leftSideElement, el];
      }
      return el;
    });
    return newArr;
  }

  return newArr;
};

export const onPointerOverAnotherTimeLineElement = ({
  arr,
  activeContainerIndex,
  draggingElementIndex,
  draggingFlutterRect,
  oneSecondInPx,
  overElementId,
}: OnPointerOverAnotherTimeLineElement) => {
  const newArr = [...arr];
  const activeContainer = arr[activeContainerIndex];
  const element = activeContainer[draggingElementIndex];

  const overElementRect = document
    .getElementById(overElementId)
    ?.getBoundingClientRect();
  if (!overElementRect) return newArr;

  const overContainerIndex = Object.keys(arr).find((key) =>
    arr[Number(key)].find((el) => el.id === overElementId)
  );
  let overContainerIndexNumber: number;

  if (overContainerIndex === undefined) return newArr;

  overContainerIndexNumber = Number(overContainerIndex);
  const overContainer = arr[overContainerIndexNumber];
  const overElementIndex = Object.keys(overContainer).find(
    (key) => overContainer[Number(key)].id === overElementId
  );
  let overElementIndexNumber: number;

  if (overElementIndex === undefined) return newArr;

  overElementIndexNumber = Number(overElementIndex);

  const activeRightElementIndex = draggingElementIndex + 1;
  const activeRightElement = activeContainer[activeRightElementIndex];
  const overRightElementIndex = overElementIndexNumber + 1;
  const overRightElement = overContainer[overRightElementIndex];

  if (activeRightElement) {
    if (overElementIndexNumber + 1 != draggingElementIndex) {
      activeRightElement.emptyDuration =
        activeRightElement.emptyDuration +
        element.emptyDuration +
        (draggingFlutterRect.width / oneSecondInPx) * 1000;
    } else {
      activeRightElement.emptyDuration =
        activeRightElement.emptyDuration + element.emptyDuration;
    }
    activeContainer[activeRightElementIndex] = activeRightElement;
  }
  if (overRightElement) {
    const newDuration =
      overRightElement.emptyDuration -
      (draggingFlutterRect.width / oneSecondInPx) * 1000;
    if (newDuration < 0) {
      overRightElement.emptyDuration = 0;
    } else {
      overRightElement.emptyDuration = newDuration;
    }
    element.emptyDuration = 0;
    overContainer[overRightElementIndex] = overRightElement;
  }

  if (activeContainerIndex === overContainerIndexNumber) {
    const filteredContainer = overContainer.map((el, i) => {
      if (i === draggingElementIndex) {
        return null;
      }
      return el;
    });
    (newArr as any)[activeContainerIndex] = filteredContainer
      .flatMap((el, i) => {
        if (i === overElementIndexNumber) {
          return [el, element];
        }
        return el;
      })
      .filter((el) => el != null);

    return newArr;
  }
  newArr[activeContainerIndex] = activeContainer.filter(
    (_, el) => el != draggingElementIndex
  );
  newArr[overContainerIndexNumber] = overContainer
    .flatMap((el, i) => {
      if (i === overElementIndexNumber) {
        return [el, element];
      }
      return el;
    })
    .filter((el) => el != null);

  return newArr;
};

const addSpaceToRightSideElementFromDraggingElement = ({
  draggingElementIndex,
  oneSecondInPx,
  draggingFlutterRect,
  draggingElement,
  activeContainer,
}: AddSpaceToRightSideElementFromDraggingElement) => {
  const rightSideElementFromDraggingElementIndex = draggingElementIndex + 1;
  const rightSideElementFromDraggingElement =
    activeContainer[rightSideElementFromDraggingElementIndex];

  if (rightSideElementFromDraggingElement) {
    rightSideElementFromDraggingElement.emptyDuration =
      rightSideElementFromDraggingElement.emptyDuration +
      draggingElement.emptyDuration +
      (draggingFlutterRect.width / oneSecondInPx) * 1000;
    activeContainer[rightSideElementFromDraggingElementIndex] =
      rightSideElementFromDraggingElement;
  }
  return activeContainer;
};

const splitEmptySpaceBetweenTwoElement = ({
  emptySpaceBoxRect,
  draggingFlutterRect,
  leftSideElement,
  rightSideElement,
  oneSecondInPx,
}: SplitEmptySpaceBetweenTwoElement) => {
  if (emptySpaceBoxRect.width < draggingFlutterRect.width) {
    rightSideElement.emptyDuration = 0;
    leftSideElement.emptyDuration = 0;
  } else {
    const elementEmptyDuration =
      ((draggingFlutterRect.x - emptySpaceBoxRect.x) / oneSecondInPx) * 1000;
    const overElementEmptyDuration =
      ((emptySpaceBoxRect.right - draggingFlutterRect.right) / oneSecondInPx) *
      1000;
    if (elementEmptyDuration < 0) {
      leftSideElement.emptyDuration = 0;
    } else {
      leftSideElement.emptyDuration = elementEmptyDuration;
    }
    if (overElementEmptyDuration < 0) {
      rightSideElement.emptyDuration = 0;
    } else {
      rightSideElement.emptyDuration = overElementEmptyDuration;
    }
  }

  return {
    leftSideElement,
    rightSideElement,
  };
};

export const addNewLineHandler = ({
  arr,
  addLineId,
  activeContainerIndex,
  draggingElementIndex,
  oneSecondInPx,
  draggingFlutterRect,
}: AddNewLineHandler) => {
  const activeContainer = arr[activeContainerIndex];
  const draggingElement = activeContainer[draggingElementIndex];
  const rightElementFromDraggingElementIndex = draggingElementIndex + 1;
  const rightElementFromDraggingElement =
    activeContainer[rightElementFromDraggingElementIndex];
  if (rightElementFromDraggingElement) {
    rightElementFromDraggingElement.emptyDuration =
      rightElementFromDraggingElement.emptyDuration +
      draggingElement.emptyDuration +
      (draggingFlutterRect.width / oneSecondInPx) * 1000;
    activeContainer[rightElementFromDraggingElementIndex] =
      rightElementFromDraggingElement;
  }
  const filteredActiveContainer = activeContainer.filter(
    (el) => el.id != draggingElement.id
  );
  draggingElement.emptyDuration =
    (draggingFlutterRect.x / oneSecondInPx) * 1000;

  const newArr = [...arr];
  newArr[activeContainerIndex] = filteredActiveContainer;
  if (addLineId === topAddLineId) {
    return [[draggingElement], ...newArr];
  } else {
    return [...newArr, [draggingElement]];
  }
};

export const emptyArraysFilter = (arr: TimeLineElement[][]) => {
  return arr.filter((container) => container.length != 0);
};
