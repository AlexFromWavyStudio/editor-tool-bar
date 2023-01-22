import { Box } from '@chakra-ui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';

import { TimeLineElement } from '../../@types/timeLineItem.interface';
import { useDragZoneContext } from '../../hooks/useDragZoneContext';
import {
  addLinesClassName,
  bottomAddLineId,
  timeLineContainerClassName,
  topAddLineId,
} from '../../utils/dragTools/constants';
import TimeLineItemsWrapper from '../dragItems/timeLineItemsWrapper';
import Divider from './divider';

type VideoDragZone = {
  scenes: TimeLineElement[][];
  setScenes: Dispatch<SetStateAction<TimeLineElement[][]>>;
};
const VideoDragZone = ({ scenes, setScenes }: VideoDragZone) => {
  const { addLineId } = useDragZoneContext();
  return (
    <>
      <Box
        opacity={addLineId === topAddLineId ? 0.5 : 0}
        id={topAddLineId}
        w={"100%"}
        height={"35px"}
        className={addLinesClassName}
        bg={"custom.lightBlue"}
      ></Box>
      {scenes.map((container: TimeLineElement[], index: number) => {
        return (
          <Fragment key={index}>
            <Divider />

            <Box
              minWidth={"100%"}
              width={"100%"}
              bg={"custom.secondary"}
              display={"flex"}
              id={`prefix-${index}`}
              className={timeLineContainerClassName}
            >
              <TimeLineItemsWrapper
                draggingContainerIndex={index}
                container={container}
                scenes={scenes}
                setScenes={setScenes}
              />
            </Box>
            {scenes.length - 1 === index && <Divider />}
          </Fragment>
        );
      })}
      <Box
        id={bottomAddLineId}
        opacity={addLineId === bottomAddLineId ? 0.5 : 0}
        w={"100%"}
        className={addLinesClassName}
        height={"35px"}
        bg={"custom.lightBlue"}
      ></Box>
    </>
  );
};
export default VideoDragZone;
