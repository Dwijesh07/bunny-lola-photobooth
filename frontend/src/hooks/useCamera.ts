import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

export const useCamera = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc;
    }
    return null;
  }, []);

  return {
    webcamRef,
    capture,
    isCameraReady,
    setIsCameraReady
  };
};