import React, { useRef, useMemo, useEffect } from "react";
import Countdown from "react-countdown";
import { Box, Text } from '@chakra-ui/react';

export interface VideoTimerProps {
    initialTime: number;
}

export const videoTimerCustomEvents = {
    startTimer: 'startVideoTimer',
    pauseTimer: 'pauseVideoTimer',
    stopTimer: 'stopVideoTimer'
};

const VideoTimer: React.FC<VideoTimerProps> = ({
    initialTime = 10000
}) => {
    const countdownRef = useRef<Countdown | null>(null);

    const minutesOfInitialTime = Math.floor(initialTime / 60000);
    const secondsOfInitialTime = Math.floor((initialTime % 60000) / 1000);
    const millisecondsOfInitialTime = Math.floor((initialTime % 1000));
    const formattedMinutessOfInitialTime =
    minutesOfInitialTime <= 9 ? `0${minutesOfInitialTime}` : minutesOfInitialTime;
    const formattedSecondsOfInitialTime =
    secondsOfInitialTime <= 9 ? `0${secondsOfInitialTime}` : secondsOfInitialTime;
    const formattedMillisecondssOfInitialTime =
    millisecondsOfInitialTime <= 9 ? `0${millisecondsOfInitialTime}`
    : String(millisecondsOfInitialTime).substring(0, 2);
    const date = useMemo(() => {
        return Date.now() + initialTime;
    }, [initialTime]);

    useEffect(() => {
        window.addEventListener(videoTimerCustomEvents.startTimer, handleStartTimer);
        window.addEventListener(videoTimerCustomEvents.pauseTimer, handlePauseTimer);
        window.addEventListener(videoTimerCustomEvents.stopTimer, handleStopTimer);

        return () => {
            window.removeEventListener(videoTimerCustomEvents.startTimer, handleStartTimer);
            window.removeEventListener(videoTimerCustomEvents.pauseTimer, handlePauseTimer);
            window.removeEventListener(videoTimerCustomEvents.stopTimer, handleStopTimer);
        };
    }, []);

    const handleStartTimer = () => {
        countdownRef.current?.start();
    };

    const handleStopTimer = () => {
        countdownRef.current?.stop();
    };

    const handlePauseTimer = () => {
        countdownRef.current?.pause();
    };

    return (
        <Countdown
            ref={countdownRef}
            date={date}
            intervalDelay={0}
            precision={3}
            autoStart={false}
            renderer={(props: any) => {
            const resultMs = initialTime - props.total;
            const minutes = Math.floor(resultMs / 60000);
            const seconds = Math.floor((resultMs % 60000) / 1000);
            const milliseconds = Math.floor((resultMs % 1000));

            const formattedMinutes = minutes <= 9 ? `0${minutes}` : minutes;
            const formattedSeconds = seconds <= 9 ? `0${seconds}` : seconds;
            const formattedMilliseconds = milliseconds <= 9 ? `0${milliseconds}`
            : String(milliseconds).substring(0, 2);
        
            return (
                <Box
                    display='flex'
                >
                    <Text
                    width='80px'
                    textAlign='left'
                    >
                        {formattedMinutes}:{formattedSeconds}:{formattedMilliseconds}
                    </Text>
                    <Text textAlign={'center'}>/</Text>
                    <Text
                        width='80px'
                        textAlign='right'
                    >
                        {formattedMinutessOfInitialTime}:{formattedSecondsOfInitialTime}:{formattedMillisecondssOfInitialTime}
                    </Text>
                </Box>
            );
            }}
        >
            <Box
                display='flex'
                >
                    <Text
                        width='80px'
                        textAlign='left'
                    >
                        00:00:00
                    </Text>
                    <Text textAlign={'center'}>/</Text>
                    <Text
                        width='80px'
                        textAlign='right'
                    >
                        {formattedMinutessOfInitialTime}:{formattedSecondsOfInitialTime}:{formattedMillisecondssOfInitialTime}
                    </Text>
                </Box>
        </Countdown>
    );
};

export default VideoTimer;