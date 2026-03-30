import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  isCapturing: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, isCapturing }) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  return (
    <div className="relative">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user"
        }}
        className="w-full rounded-lg shadow-lg"
      />
      {isCapturing && (
        <button
          onClick={capture}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 btn-pink"
        >
          📸 Capture
        </button>
      )}
    </div>
  );
};

export default CameraView;