import { Box } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import { TimeLineElement } from '../../@types/timeLineItem.interface';
import EmptyBackground from '../../assets/empty_space.webp';
import { useDragZoneContext } from '../../hooks/useDragZoneContext';
import { useZoomAndRulerContext } from '../../hooks/useZoomAndRulerContext';
import { draggingFlutterId } from '../../utils/dragTools/constants';
import { Resizable } from '../../utils/resizable/resizable';
import ResizeHandleComponent from './resizeHandleComponent';

type TimeLineItemProps = {
  item: TimeLineElement;
};

const DraggItem = ({ item }: TimeLineItemProps) => {
  const { oneSecondWidth } = useZoomAndRulerContext();
  const itemWidth = (item.params.selectedDuration / 1000) * oneSecondWidth;
  const [options, setOptions] = useState({
    isControlHover: false,
    isResizing: false,
    isItemHover: false,
  });
  const setControlHover = useCallback(
    (isHover: boolean) => {
      setOptions({ ...options, isControlHover: isHover });
    },
    [options]
  );

  const itemPreviewBackground = `url("${
    item.type === "empty_space" ? EmptyBackground : item.params.preview
  }")`;
  const { draggableElement } = useDragZoneContext();

  return (
    <Resizable
      enable={{
        left: true,
        right: true,
      }}
      onResizeStart={() => setOptions({ ...options, isResizing: true })}
      size={{ width: itemWidth, height: 52 }}
      minHeight={52}
      handleComponent={{
        left: (
          <ResizeHandleComponent
            setControlHover={setControlHover}
            isHover={options.isControlHover || options.isResizing}
            side={"left"}
          />
        ),
        right: (
          <ResizeHandleComponent
            setControlHover={setControlHover}
            isHover={options.isControlHover || options.isResizing}
            side={"right"}
          />
        ),
      }}
    >
      <Box
        backgroundImage={itemPreviewBackground}
        id={draggingFlutterId}
        w={itemWidth}
        style={{
          opacity: draggableElement?.id === item.id ? 0 : 1,
          zIndex: 2,
          height: "52px",
          width: "100%",
          borderRadius: "5.5px",
          backgroundColor: "white",
        }}
      ></Box>
    </Resizable>
  );
};

export default DraggItem;
