import { Box } from '@chakra-ui/react';
import { useState } from 'react';

import { TimeLineElement } from '../@types/timeLineItem.interface';
import { DragZoneContextWrapper } from '../hooks/useDragZoneContext';
import { MenuAndSelectContextWrapper } from '../hooks/useMenuAndSelectContext';
import { ZoomAndRulerContextWrapper } from '../hooks/useZoomAndRulerContext';
import { timeLineGenerator } from '../utils/timeLineGenerator';
import VideoDragZone from './dragZone/videoDragZone';
import Lasso from './lassoSelect/lassoSelect';
import PlayerControlButtons from './playerControlButtons';
import ResizableContainer from './resizableContainer/resizableContainer';

const Footer = () => {
  const [scenes, setScenes] = useState<TimeLineElement[][]>([
    timeLineGenerator(7, "video"),
    timeLineGenerator(4, "video"),
    timeLineGenerator(9, "video"),
  ]);
  return (
    <ZoomAndRulerContextWrapper>
      <MenuAndSelectContextWrapper setScenes={setScenes}>
        <DragZoneContextWrapper setScenes={setScenes}>
          <>
            <Lasso />
            <Box width={"100%"} position={"absolute"} bottom={"0px"}>
              <PlayerControlButtons />
              <Box
                w={"100%"}
                h={"1px"}
                boxShadow={"0px 4px 10px 4px rgba(0,0,0,0.24)"}
              ></Box>
              <ResizableContainer>
                <VideoDragZone scenes={scenes} setScenes={setScenes} />
              </ResizableContainer>
            </Box>
          </>
        </DragZoneContextWrapper>
      </MenuAndSelectContextWrapper>
    </ZoomAndRulerContextWrapper>
  );
};

export default Footer;
