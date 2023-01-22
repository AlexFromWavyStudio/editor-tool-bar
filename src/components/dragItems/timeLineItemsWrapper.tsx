import { Box } from '@chakra-ui/react';
import { Dispatch, Fragment, SetStateAction, useEffect } from 'react';

import { TimeLineElement } from '../../@types/timeLineItem.interface';
import { useMakeResizeTimeLineItem } from '../../hooks/useMakeResizeTimeLineItem';
import { useZoomAndRulerContext } from '../../hooks/useZoomAndRulerContext';
import Item from './timeLineItem';

type TimeLineItemsWrapper = {
  scenes: TimeLineElement[][];
  container: TimeLineElement[];
  setScenes: Dispatch<SetStateAction<TimeLineElement[][]>>;
  draggingContainerIndex: number;
};

const TimeLineItemsWrapper = ({
  scenes,
  setScenes,
  container,
  draggingContainerIndex,
}: TimeLineItemsWrapper) => {
  const { oneSecondWidth, setVideoDuration, currentZoom } =
    useZoomAndRulerContext();
  const { makeResizeTimeLineItem } = useMakeResizeTimeLineItem({
    setScenes,
    currentZoom,
    oneSecondWidth,
  });

  const makeCountFullVideoDuration = () => {
    const fullVideoDuration = Math.max(
      ...scenes.map((container) => {
        return container.reduce(
          (accumulator: number, scene: TimeLineElement) => {
            if (scene.type === "video") {
              return accumulator + scene.params.selectedDuration;
            }
            return accumulator;
          },
          0
        );
      })
    );
    const fullVideoDurationInPx = (fullVideoDuration / 1000) * oneSecondWidth;
    setVideoDuration({ fullVideoDurationInPx, fullVideoDuration });
  };
  useEffect(() => {
    makeCountFullVideoDuration();
  }, [scenes, oneSecondWidth]);

  return (
    <>
      {container.map((item, index) => (
        <Fragment key={item.id}>
          {item.emptyDuration > 0 && (
            <Box
              className="emptyZone"
              id={`emptySpaceBox?${item.id}`}
              h={"100%"}
              width={(item.emptyDuration / 1000) * oneSecondWidth}
            ></Box>
          )}
          <Item
            item={item}
            draggingContainerIndex={draggingContainerIndex}
            draggingElementIndex={index}
            makeResizeTimeLineItem={makeResizeTimeLineItem}
          />
        </Fragment>
      ))}
    </>
  );
};

export default TimeLineItemsWrapper;
