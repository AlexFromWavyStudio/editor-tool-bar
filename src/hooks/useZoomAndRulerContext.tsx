import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';

const noop = () => {};
export const maxZoom = 1;
export const minZoom = 15;

type VoidFunction = () => void;
type VideoDuration = {
  fullVideoDuration: number;
  fullVideoDurationInPx: number;
};

interface ZoomAndRulerContext {
  zoomIn: VoidFunction;
  zoomOut: VoidFunction;
  currentZoom: number;
  setRulerWidth: Dispatch<SetStateAction<number | null>>;
  setVideoDuration: Dispatch<SetStateAction<VideoDuration | null>>;
  videoDuration: VideoDuration | null;
  rulerWidth: number | null;
  oneSecondWidth: number;
  windowSize: number;
  isVideoPlaying: boolean;
  setIsVideoPlaying: Dispatch<SetStateAction<boolean>>;
}

const ZoomAndRulerContext = createContext<ZoomAndRulerContext>({
  zoomIn: noop,
  zoomOut: noop,
  currentZoom: 1,
  setRulerWidth: noop,
  rulerWidth: null,
  oneSecondWidth: 100,
  setVideoDuration: noop,
  videoDuration: null,
  windowSize: 0,
  isVideoPlaying: false,
  setIsVideoPlaying: noop
});

export const useZoomAndRulerContext = () => useContext(ZoomAndRulerContext);

export const ZoomAndRulerContextWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [currentZoom, setCurrentZoom] = useState<number>(10);
  const [rulerWidth, setRulerWidth] = useState<number | null>(null);
  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);
  const [videoDuration, setVideoDuration] = useState<VideoDuration | null>(
    null
  );
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const zoomIn = () => {
    if (isVideoPlaying) {
      return;
    }

    setCurrentZoom((prev) => {
      if (prev > maxZoom) {
        return --prev;
      }
      return prev;
    });
  };

  const zoomOut = () => {
    if (isVideoPlaying) {
      return;
    }

    setCurrentZoom((prev) => {
      if (prev < minZoom) {
        return ++prev;
      }
      return prev;
    });
  };

  const oneSecondWidth = useMemo(
    () => windowSize / currentZoom,
    [currentZoom, windowSize]
  );

  const Provider = {
    zoomIn,
    zoomOut,
    setRulerWidth,
    currentZoom,
    rulerWidth,
    oneSecondWidth,
    videoDuration,
    setVideoDuration,
    windowSize,
    setIsVideoPlaying,
    isVideoPlaying
  };

  const windowResizeHandler = (e: any) => {
    setWindowSize(e.currentTarget.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", windowResizeHandler);
    return () => window.removeEventListener("resize", windowResizeHandler);
  }, []);

  return (
    <ZoomAndRulerContext.Provider value={Provider}>
      {children}
    </ZoomAndRulerContext.Provider>
  );
};
