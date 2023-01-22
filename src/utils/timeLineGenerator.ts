import { v4 } from 'uuid';

import { TimeLineElement } from '../@types/timeLineItem.interface';
import empty from '../assets/empty_rectangle.png';
import image from '../assets/IMAGE.png';

export const timeLineGenerator = (
  count: number,
  type: string,
  line?: number
) => {
  const timeLineMokItems: TimeLineElement[] = [];
  for (let i = 0; i <= count; i++) {
    let endTime = Math.random() * 1000 + 500;
    timeLineMokItems.push({
      line: line,
      id: v4(),
      type: "video",
      emptyDuration: 0,
      params: {
        duration: Math.random() * 10000 + 500,
        selectedDuration: endTime,
        startTime: 0,
        endTime: endTime,
        preview: [
          "https://picsum.photos/77/77",
          image,
          "https://picsum.photos/100/100",
          empty,
          "https://picsum.photos/75/75",
          "https://picsum.photos/76/76",
          image,
        ][Math.ceil(Math.random() * 6)],
      },
    });
  }
  return timeLineMokItems;
};
