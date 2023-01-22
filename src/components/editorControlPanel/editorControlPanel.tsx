import { Box, IconButton, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { FaRedoAlt, FaUndoAlt } from 'react-icons/fa';
import { FiScissors, FiTrash2 } from 'react-icons/fi';
import { RxViewVertical } from 'react-icons/rx';
import { VscZoomIn, VscZoomOut } from 'react-icons/vsc';

import { useMenuAndSelectContext } from '../../hooks/useMenuAndSelectContext';
import { maxZoom, minZoom, useZoomAndRulerContext } from '../../hooks/useZoomAndRulerContext';
import { TIME_MARKER_MOVE_EVENT_NAME, TIME_MARKER_PAUSE_EVENT_NAME } from '../TimeMarker/TimeMarker';
import VideoTimer from '../VideoTimer';
import { videoTimerCustomEvents } from '../VideoTimer/VideoTimer';

const EditorControlPanel = () => {
  const { zoomIn, zoomOut, currentZoom, videoDuration, isVideoPlaying } =
    useZoomAndRulerContext();
  const { selectedElements, handleDelete, handleDuplicate, splitElements } =
    useMenuAndSelectContext();

  useEffect(() => {
    let i = 0;
    let interval: null | ReturnType<typeof setInterval> = null;

    if (isVideoPlaying) {
      window.dispatchEvent(new CustomEvent(videoTimerCustomEvents.startTimer));
      interval = setInterval(() => {
        if (i >= (videoDuration?.fullVideoDuration as number) ?? 0) {
          if (interval != null) {
            clearInterval(interval);
          }
          return;
        }
        i += 250;

        window.dispatchEvent(
          new CustomEvent(TIME_MARKER_MOVE_EVENT_NAME, {
            detail: i,
          })
        );
      }, 250);
    } else {
      window.dispatchEvent(new CustomEvent(videoTimerCustomEvents.stopTimer));
      if (interval != null) {
        clearInterval(interval);
      }
      window.dispatchEvent(
        new CustomEvent(TIME_MARKER_PAUSE_EVENT_NAME, {
          detail: 0,
        })
      );
    }

    return () => {
      if (interval != null) {
        clearInterval(interval);
      }
    };
  }, [videoDuration?.fullVideoDuration, isVideoPlaying]);

  const disabled = !selectedElements.length;
  return (
    <Box
      w={"100%"}
      h={"50px"}
      display={"flex"}
      alignItems={"center"}
      padding={"0px 16px"}
      zIndex={10}
      justifyContent={"space-between"}
      borderBottom={"2px solid #e1f5ff"}
    >
      <Box display={"flex"} gap={"10px"} width={"200px"}>
        <IconButton style={ButtonStyles} aria-label="">
          <FaUndoAlt opacity={0.6} />
        </IconButton>
        <IconButton style={ButtonStyles} aria-label="">
          <FaRedoAlt opacity={0.6} />
        </IconButton>
        <IconButton
          style={ButtonStyles}
          disabled={disabled}
          onPointerDown={handleDelete}
          aria-label="delete_btn"
        >
          <FiTrash2 />
        </IconButton>
        <IconButton
          style={ButtonStyles}
          disabled={disabled}
          onPointerDown={splitElements}
          aria-label="split_btn"
        >
          <FiScissors />
        </IconButton>
        <IconButton
          style={ButtonStyles}
          disabled={disabled}
          onPointerDown={handleDuplicate}
          aria-label="duplicate_btn"
        >
          <RxViewVertical />
        </IconButton>
      </Box>
      <Box>
        <VideoTimer initialTime={videoDuration?.fullVideoDuration ?? 0} />
      </Box>
      <Box
        display={"flex"}
        gap={"10px"}
        justifyContent={"flex-end"}
        width={"200px"}
      >
        <IconButton
          style={ButtonStyles}
          onPointerDown={zoomOut}
          disabled={currentZoom === minZoom || isVideoPlaying}
          aria-label="zoomOut"
        >
          <VscZoomOut />
        </IconButton>
        <IconButton
          style={ButtonStyles}
          onPointerDown={zoomIn}
          disabled={currentZoom === maxZoom || isVideoPlaying}
          aria-label="zoomIn"
        >
          <VscZoomIn />
        </IconButton>
      </Box>
    </Box>
  );
};
export default EditorControlPanel;

const ButtonStyles = {
  background: "transparent",
};
