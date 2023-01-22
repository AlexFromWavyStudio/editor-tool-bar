import { Box } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { animated } from 'react-spring';

import { useDragZoneContext } from '../../hooks/useDragZoneContext';
import { Resizable } from '../../utils/resizable/resizable';
import DraggItem from '../dragItems/draggItem';
import EditorControlPanel from '../editorControlPanel';
import TimeMarker from '../TimeMarker';
import TimeScaleRuler from '../timeScaleRuler/timeScaleRuler';

const TopHandle = ({
  isHover,
  setControlHover,
}: {
  isHover: boolean;
  setControlHover: (v: boolean) => void;
}) => (
  <Box
    onMouseEnter={() => setControlHover(true)}
    onMouseLeave={() => setControlHover(false)}
    style={{
      position: "relative",
      height: "7px",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      opacity: isHover ? 1 : 0.5,
      cursor: "ns-resize",
    }}
  >
    <Box
      position={"absolute"}
      w={"100%"}
      h={"3px"}
      bg={isHover ? "custom.onHoverColor" : "transparent"}
    ></Box>
  </Box>
);

const ResizableContainer = ({ children }: { children: JSX.Element }) => {
  const [boxHeight, setBoxHeight] = useState(200);
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

  const { onMouseMove, draggableElement, springStyle } = useDragZoneContext();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <Resizable
      enable={{
        top: true,
      }}
      onResizeStart={() => setOptions({ ...options, isResizing: true })}
      onResizeStop={(e, direction, ref, d) => {
        setOptions({
          ...options,
          isResizing: false,
        });
        setBoxHeight((prev) => prev + d.height);
      }}
      size={{ width: "100%", height: boxHeight }}
      minHeight={200}
      maxHeight={500}
      maxWidth={"100%"}
      handleComponent={{
        top: (
          <TopHandle
            setControlHover={setControlHover}
            isHover={options.isControlHover || options.isResizing}
          />
        ),
      }}
    >
      <Box
        id="ResizableFooterContent"
        bg="custom.primary"
        width={"100%"}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
      >
        <EditorControlPanel />

        <Box
          id='ScrolledElement'
          position={"relative"}
          w={"100%"}
          h={"100%"}
          display={"flex"}
          flexWrap={"wrap"}
          padding={"0px 16px 40px 16px"}
          overflowY={"scroll"}
          overflowX={"scroll"}
          ref={scrollRef}
        >
          <TimeMarker />
          <TimeScaleRuler />

          <Box
            display={"flex"}
            gap={"2px"}
            flexDirection={"column"}
            onMouseMove={onMouseMove}
          >
            {children}
          </Box>
          {draggableElement && springStyle && (
            <animated.div
              style={{
                backgroundImage: `url("${draggableElement.params.preview}")`,
                pointerEvents: "none",
                position: "fixed",
                zIndex: 10000000,
                top: springStyle.top,
                left: springStyle.left,
                background: "white",
              }}
            >
              <Box zIndex={1000}>
                <DraggItem item={draggableElement} />
              </Box>
            </animated.div>
          )}
        </Box>
      </Box>
    </Resizable>
  );
};
export default ResizableContainer;
