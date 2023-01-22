import { Box } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import { TimeLineElement } from '../../@types/timeLineItem.interface';
import EmptyBackground from '../../assets/empty_space.webp';
import { useDragZoneContext } from '../../hooks/useDragZoneContext';
import { useMenuAndSelectContext } from '../../hooks/useMenuAndSelectContext';
import { useZoomAndRulerContext } from '../../hooks/useZoomAndRulerContext';
import { Resizable } from '../../utils/resizable/resizable';
import ItemContextMenu from './itemContextMenu';
import ResizeHandleComponent from './resizeHandleComponent';

type TimeLineItemProps = {
  item: TimeLineElement;
  lineId?: number;
  draggingContainerIndex: number;
  draggingElementIndex: number;
  makeResizeTimeLineItem: (
    itemId: number | string,
    width: number,
    direction: "right" | "left"
  ) => void;
};

const Item = ({
  item,
  makeResizeTimeLineItem,
  draggingElementIndex,
  draggingContainerIndex,
}: TimeLineItemProps) => {
  const { oneSecondWidth } = useZoomAndRulerContext();
  const { selectedElements, handleContextMenu } = useMenuAndSelectContext();
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

  const itemBorder = `2.5px solid ${
    selectedElements.includes(item.id) ? "#FB3BAC" : "transparent"
  }`;

  const { draggableElement, onPointerDown, overElementId } =
    useDragZoneContext();

  return (
    <>
      <Resizable
        enable={{
          left: true,
          right: true,
        }}
        onResizeStart={() => setOptions({ ...options, isResizing: true })}
        onResizeStop={(e, direction, ref, d) => {
          setOptions({
            ...options,
            isResizing: false,
          });
          makeResizeTimeLineItem(
            item.id,
            d.width,
            direction as "right" | "left"
          );
        }}
        size={{ width: itemWidth, height: 52 }}
        minHeight={52}
        handleComponent={{
          left: (
            <ResizeHandleComponent
              setControlHover={setControlHover}
              isHover={options.isControlHover || options.isResizing}
              side={"left"}
              isDragging={!!draggableElement}
              isHidden={
                draggableElement?.id === item.id || overElementId === item.id
              }
            />
          ),
          right: (
            <ResizeHandleComponent
              setControlHover={setControlHover}
              isDragging={!!draggableElement}
              isHover={options.isControlHover || options.isResizing}
              side={"right"}
              isHidden={
                draggableElement?.id === item.id || overElementId === item.id
              }
            />
          ),
        }}
      >
        <Box
          border={itemBorder}
          backgroundImage={itemPreviewBackground}
          className={"timeLineItems"}
          position={"relative"}
          onContextMenu={handleContextMenu(item.id)}
          onPointerDown={onPointerDown({
            ...(item as any),
            draggingContainerIndex,
            draggingElementIndex,
          })}
          w={itemWidth}
          id={item.id}
          style={{
            userSelect: "none",
            opacity:
              draggableElement?.id === item.id || overElementId === item.id
                ? 0.5
                : 1,
            zIndex: 2,
            height: "52px",
            width: "100%",
            borderRadius: "5.5px",
            backgroundColor: "white",
          }}
        ></Box>
      </Resizable>
      <ItemContextMenu />
    </>
  );
};

export default Item;
