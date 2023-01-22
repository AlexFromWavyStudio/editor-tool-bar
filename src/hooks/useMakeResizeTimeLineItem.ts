import { Dispatch, SetStateAction } from 'react';

import { TimeLineElement } from '../@types/timeLineItem.interface';

type MakeResizeTimeLineItemHook = {
  setScenes: Dispatch<SetStateAction<TimeLineElement[][]>>;
  currentZoom: number;
  oneSecondWidth: number;
};

export const useMakeResizeTimeLineItem = ({
  setScenes,
  oneSecondWidth,
}: MakeResizeTimeLineItemHook) => {
  const makeResizeTimeLineItem = (
    itemId: number | string,
    width: number,
    direction: "right" | "left"
  ) => {
    setScenes((prev) => {
      const mutableTimeLineContainersArray = prev.map((container) => {
        return container.map((item) => {
          if (item.id === itemId) {
            // px to milliseconds, can be positive and negative number
            const widthToSeconds = (width / oneSecondWidth) * 1000;

            if (direction === "right") {
              item.params.endTime = item.params.endTime + widthToSeconds;
            }
            if (direction === "left") {
              item.params.endTime = item.params.startTime + widthToSeconds;
            }
            item.params.selectedDuration =
              item.params.selectedDuration + widthToSeconds;
          }
          return item;
        });
      });
      return [...mutableTimeLineContainersArray];
    });
  };

  return { makeResizeTimeLineItem };
};
