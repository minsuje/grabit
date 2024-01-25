import { useState, useRef, RefObject } from 'react';
import Measure from 'react-measure';
import { useUserMedia } from '@/hooks/use-user-media';
import { useCardRatio } from '@/hooks/use-card-ratio';
import { useOffsets } from '@/hooks/use-offsets';
import { Button } from '@/components/ui/button';

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: 'environment' },
};
interface VoidFunction {
  onCapture: (blob: Blob) => void;
  onClear: () => void;
}

export function CameraAction({ onCapture, onClear }: VoidFunction) {
  const canvasRef: RefObject<HTMLCanvasElement> | null = useRef(null);
  const videoRef: RefObject<HTMLVideoElement> | null = useRef(null);

  const [container, setContainer] = useState({ width: 10, height: 10 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  //   const [isFlashing, setIsFlashing] = useState(false);

  const mediaStream = useUserMedia(CAPTURE_OPTIONS);
  const [aspectRatio, calculateRatio] = useCardRatio(1.586);
  const offsets = useOffsets(
    videoRef.current && videoRef.current.videoWidth,
    videoRef.current && videoRef.current.videoHeight,
    container.width,
    container.height,
  );

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  interface contentRect {
    bounds: {
      bottom: number;
      height: number;
      left: number;
      right: number;
      top: number;
      width: number;
    };
    entry: Object;
  }
  function handleResize(contentRect: contentRect) {
    console.log('handleResize 실행', contentRect);
    setContainer({
      width: contentRect.bounds.width,
      height: Math.round(contentRect.bounds.width / 1.586),
    });
  }

  function handleCanPlay() {
    if (videoRef && videoRef.current) {
      console.log('videoRef.current.videoHeight', videoRef.current.videoHeight);
      calculateRatio(videoRef.current.videoHeight, videoRef.current.videoWidth);
      console.log('aspectRatio', aspectRatio);
      videoRef.current.play();
      setIsVideoPlaying(true);
      console.log(isVideoPlaying);
    }
  }

  function handleCapture() {
    if (canvasRef && canvasRef.current && videoRef && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      console.log('context', context);
      if (context) {
        context.drawImage(
          videoRef.current, //그릴 이미지(비디오)의 원본
          offsets.x, //그릴 이미지의 시작 좌표(x축)
          offsets.y, //그릴 이미지의 시작 좌표(y축)
          container.width, //그릴 이미지의 원본 폭
          container.height, //그릴 이미지의 원본 높이
          0, //그릴 이미지를 그릴 캔버스의 x축에서의 시작 위치
          0, //그릴 이미지를 그릴 캔버스의 y축에서의 시작 위치
          container.width, //그릴 이미지를 그릴 캔버스의 폭
          container.height, //그릴 이미지를 그릴 캔버스의 높이
        );
      }

      console.log('context', context);
      console.log('videoRef.current', videoRef.current);
      console.log('canvasRef.current', canvasRef.current);

      canvasRef.current.toBlob(
        (blob) => {
          if (blob) {
            onCapture(blob);
            console.log('blob', blob);
          }
        },
        'image/jpeg',
        1,
      );
    }

    setIsCanvasEmpty(false);
    // setIsFlashing(true);
  }

  function handleClear() {
    if (canvasRef && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setIsCanvasEmpty(true);
        onClear();
      }
    }
  }

  if (!mediaStream) {
    return null;
  }

  return (
    <Measure bounds onResize={handleResize}>
      {({ measureRef }) => (
        <div className="flex-col  w-full">
          {' '}
          {/**Wrapper */}
          <div
            className="relative w-full"
            ref={measureRef}
            style={{
              height: `${container.height}px`,
            }}
          >
            {/**Container*/}
            <video
              className=""
              ref={videoRef}
              hidden={!isVideoPlaying}
              onCanPlay={handleCanPlay}
              autoPlay
              playsInline
              muted
              style={{
                top: `-${offsets.y}px`,
                left: `-${offsets.x}px`,
              }}
            />

            <div className="" hidden={!isVideoPlaying} />

            <canvas
              className="absolute top-0 left-0 bottom-0 right-0"
              ref={canvasRef}
              style={{
                top: `0px`,
                left: `0px`,
              }}
            />

            {/* <div flash={isFlashing} onAnimationEnd={() => setIsFlashing(false)} /> */}
          </div>
          {isVideoPlaying && (
            <Button className="absolute" onClick={isCanvasEmpty ? handleCapture : handleClear}>
              {isCanvasEmpty ? 'Take a picture' : 'Take another picture'}
            </Button>
          )}
        </div>
      )}
    </Measure>
  );
}
