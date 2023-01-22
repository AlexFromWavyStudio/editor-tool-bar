import React, { useEffect, useRef } from 'react';
import { animated, to, useSpring } from 'react-spring';
import { Box } from '@chakra-ui/react';
import { useZoomAndRulerContext } from '../../hooks/useZoomAndRulerContext';

export const INITIAL_LEFT_TIME_MARKER_MARGIN = 10;

export const DEFAULT_TIME_MARKER_STYLES = {
    left: INITIAL_LEFT_TIME_MARKER_MARGIN,
    top: 0,
    config: {
        duration: 250
    }
};

export const TIME_MARKER_MOVE_EVENT_NAME = 'time-marker-move';
export const TIME_MARKER_PAUSE_EVENT_NAME = 'time-marker-pause';

const TimeMarker: React.FC = () => {
    const [styles, set] = useSpring(() => DEFAULT_TIME_MARKER_STYLES);
    const { oneSecondWidth, videoDuration } = useZoomAndRulerContext();
    const lastPointerMovementPositionXRef = useRef<number | null>(null);

    useEffect(() => {
        const scrollEl = document.getElementById('ScrolledElement');

        window.addEventListener(TIME_MARKER_MOVE_EVENT_NAME, markerMoveEventHandler);
        window.addEventListener(TIME_MARKER_PAUSE_EVENT_NAME, markerPauseEventHandler);

        if (scrollEl != null) {
            scrollEl.addEventListener('scroll', handleParentContainerScroll);
        }

        return () => {
            window.removeEventListener(TIME_MARKER_MOVE_EVENT_NAME, markerMoveEventHandler);
            window.removeEventListener(TIME_MARKER_PAUSE_EVENT_NAME, markerPauseEventHandler);

            if (scrollEl != null) {
                scrollEl.removeEventListener('scroll', handleParentContainerScroll);
            }
        };
    }, [oneSecondWidth, videoDuration?.fullVideoDuration]);

    const handleParentContainerScroll = (event: any) => {
        const top: number = event?.target?.scrollTop ?? 0;

        set({
            immediate: true,
            top
        })
    };

    const markerMoveEventHandler = (event: any) => {
        const millis = event?.detail;
        const left = millis * oneSecondWidth / 1000;
        
        
        if (millis + 250 >=(videoDuration?.fullVideoDuration as number) ?? 0) {
            const lastLeftPosition = (videoDuration?.fullVideoDuration ?? 0) / 1000 * oneSecondWidth;

            set({
                immediate: false,
                left: lastLeftPosition + INITIAL_LEFT_TIME_MARKER_MARGIN
            });
        } else {
            set({
                immediate: false,
                left: left + INITIAL_LEFT_TIME_MARKER_MARGIN
            });
        }
    };

    const markerPauseEventHandler = (event: any) => {
        const millis = event?.detail;
        const left = millis * oneSecondWidth / 1000;

        set({
            immediate: true,
            left: left + INITIAL_LEFT_TIME_MARKER_MARGIN
        })
    };

    const handlePointerMove = (event: PointerEvent) => {
        const { x } = event;
        lastPointerMovementPositionXRef.current = x;
        set({
            immediate: true,
            left: x
        })
    };

    const handlePointerUp = () => {
        const el = document.getElementById('ResizableFooterContent');

        if (el != null) {
            el.removeEventListener('pointermove', handlePointerMove);
        }

        if (lastPointerMovementPositionXRef.current != null) {
            // TODO set time
        }
    };

    const handleTimeMarkerPointerDown = () => {
        const el = document.getElementById('ResizableFooterContent');

        if (el != null) {
            el.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp);
        }
    };

    const numberStyleInterpolator = (numValue: number) => {
        return `${numValue}px`;
    }

    return (
     <animated.div
        className='TimeMarker'
        style={{
            position: 'absolute',
            zIndex: 150,
            left: to([styles.left], numberStyleInterpolator),
            top: to([styles.top], numberStyleInterpolator),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            cursor: 'pointer'
        }}
     >
        <Box
            className='TimeMarkerHandle'
            onPointerDown={handleTimeMarkerPointerDown}
        >
            <Box
                className='TimeMarkerHandle'
                style={{
                    width: '15px',
                    height: '13px',
                    backgroundColor: '#ea0083',
                    borderRadius: '1px'
                }}
            />
            <Box
                className='TimeMarkerHandle'
                style={{
                    width: '0',
                    height: '0',
                    borderLeft: '7.5px solid transparent',
                    borderRight: '7.5px solid transparent',
                    borderTop: '7.5px solid #ea0083',
                    borderBottom: '7.5px solid transparent',
                    backgroundColor: 'transparent'
                }}
            />
        </Box>
        <Box
            style={{
                width: '3px',
                height: '100%',
                background: '#ea0083',
                marginTop: '-10px',
            }}
        />
     </animated.div>   
    );
};

export default TimeMarker;