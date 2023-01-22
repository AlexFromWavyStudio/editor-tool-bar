import { Box, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { BiRotateLeft, BiRotateRight } from 'react-icons/bi';
import { TfiControlPause, TfiControlPlay, TfiControlSkipBackward, TfiControlSkipForward } from 'react-icons/tfi';

import { useZoomAndRulerContext } from '../../hooks/useZoomAndRulerContext';

const PlayerControlButtons = () => {
  const { isVideoPlaying, setIsVideoPlaying } = useZoomAndRulerContext();

  const handleTogglePlaying = () => setIsVideoPlaying((prev) => !prev);

  return (
    <Box
      width={"100%"}
      height={"40px"}
      position={"relative"}
      top={"100%"}
      paddingBottom={"50px"}
      display={"flex"}
      justifyContent={"center"}
      gap={"20px"}
    >
      <IconButton aria-label="skip_backward">
        <TfiControlSkipBackward />
      </IconButton>
      <IconButton aria-label="skip_time_down">
        <BiRotateLeft />
      </IconButton>
      <IconButton onClick={handleTogglePlaying} aria-label="play&pause">
        {isVideoPlaying ? <TfiControlPause /> : <TfiControlPlay />}
      </IconButton>
      <IconButton aria-label="skip_time_down">
        <BiRotateRight />
      </IconButton>
      <IconButton aria-label="skip_forward">
        <TfiControlSkipForward />
      </IconButton>
    </Box>
  );
};
export default PlayerControlButtons;
