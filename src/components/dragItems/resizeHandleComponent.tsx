import { Box } from '@chakra-ui/react';

const ResizeHandleComponent = ({
  isHover,
  setControlHover,
  side,
  isHidden,
  isDragging,
}: {
  isHover: boolean;
  setControlHover: (v: boolean) => void;
  side: "left" | "right";
  isHidden?: boolean;
  isDragging?: boolean;
}) => (
  <Box
    className="ResizeHandle"
    onMouseEnter={() => setControlHover(true)}
    onMouseLeave={() => setControlHover(false)}
    bg={"#8e47cc"}
    style={{
      zIndex: isDragging ? 2 : 2,
      pointerEvents: isDragging ? "none" : "auto",
      borderRadius: side === "left" ? "5px 0px 0px 5px" : "0px 5px 5px 0px",
      position: "absolute",
      height: "52px",
      width: "13px",
      display: "flex",
      gap: "2px",
      alignItems: "center",
      justifyContent: "center",
      opacity: isHidden ? 0 : isHover ? 0.5 : 1,
      cursor: "ew-resize",
      right: side === "right" ? 0 : undefined,
      left: side === "left" ? 0 : undefined,
    }}
  >
    {/*<VscGripper style={{ userSelect: "none" }} />*/}
    <Box w={"2px"} h={"65%"} bg={"white"} borderRadius={"1px"}></Box>
    <Box w={"2px"} h={"65%"} bg={"white"} borderRadius={"1px"}></Box>
  </Box>
);
export default ResizeHandleComponent;
