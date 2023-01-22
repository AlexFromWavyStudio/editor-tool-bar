import { Box, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useZoomAndRulerContext } from '../../hooks/useZoomAndRulerContext';

type DashSize = "small" | "large";

const Dash = ({
  seconds,
  oneSecondWidth,
}: {
  size: DashSize;
  seconds: number;
  oneSecondWidth: number;
  markerColor?: string;
}) => (
  <Box
    display={"flex"}
    alignItems={"flexStart"}
    position={"relative"}
    w={oneSecondWidth / 2}
    flexDirection={"column"}
  >
    <Text
      color={"custom.markerColor"}
      textAlign={"left"}
      userSelect={"none"}
      fontSize={"10px"}
      fontWeight={600}
    >
      {seconds}
    </Text>
    <Text
      position={"absolute"}
      bottom={"0px"}
      userSelect={"none"}
      color={"custom.markerColor"}
      fontSize={"10px"}
      fontWeight={800}
    >
      |
    </Text>{" "}
  </Box>
);
const TimeScaleRuler = () => {
  const { oneSecondWidth, videoDuration, windowSize } =
    useZoomAndRulerContext();

  const { markersArr, timeRollerWidth } = useMemo(() => {
    const timeRollerWidth =
      videoDuration?.fullVideoDurationInPx &&
      videoDuration?.fullVideoDurationInPx > windowSize
        ? videoDuration.fullVideoDurationInPx
        : windowSize;

    const makersCount = Math.ceil(timeRollerWidth / oneSecondWidth);
    const markersArr: number[] = [];
    for (let i = 0; i < makersCount; i++) {
      markersArr.push(i);
    }
    return {
      markersArr,
      timeRollerWidth,
    };
  }, [videoDuration]);

  return (
    <Box
      w='unset'
      h={"30px"}
      display={"flex"}
      flexDirection={"row"}
      position={"relative"}
      top={0}
      bg={"#e1f5ff"}
      zIndex={2}
    >
      {markersArr.map((time, index) => {
        return (
          <Box
            key={index}
            display={"flex"}
            w={oneSecondWidth}
            textAlign={"left"}
            zIndex={10}
          >
            <Dash
              oneSecondWidth={oneSecondWidth}
              seconds={time}
              key={`${index}large`}
              size="large"
            />
            <Dash
              oneSecondWidth={oneSecondWidth}
              seconds={time + 0.5}
              key={`${index}small`}
              size="small"
            />
          </Box>
        );
      })}
    </Box>
  );
};
export default TimeScaleRuler;
