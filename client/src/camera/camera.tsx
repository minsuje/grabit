import { useState, useRef, RefObject } from 'react';
// import Measure from 'react-measure';
import { useUserMedia } from '@/hooks/use-user-media';
// import { useCardRatio } from '@/hooks/use-card-ratio';
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

  // const [container, setContainer] = useState({ width: 0, height: 0 });
  const container = { width: 0, height: 0 }
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  //   const [isFlashing, setIsFlashing] = useState(false);

  const mediaStream = useUserMedia(CAPTURE_OPTIONS);
  // const [aspectRatio, calculateRatio] = useCardRatio(1.586);
  const offsets = useOffsets(
    videoRef.current && videoRef.current.videoWidth,
    videoRef.current && videoRef.current.videoHeight,
    container.width,
    container.height,
  );
  console.log('offsets', offsets);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  // interface contentRect {
  //   bounds: {
  //     bottom: number;
  //     height: number;
  //     left: number;
  //     right: number;
  //     top: number;
  //     width: number;
  //   };
  //   entry: Object;
  // }
  // function handleResize(contentRect: contentRect) {
  //   setContainer({
  //     width: contentRect.bounds.width,
  //     height: Math.round(contentRect.bounds.width / 1.586),
  //   });
  // }

  function handleCanPlay() {
    if (videoRef && videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  }

  function handleCapture() {
    if (canvasRef && canvasRef.current && videoRef && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // 비디오의 크기에 맞게 캔버스의 크기 설정
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        // 비디오 프레임을 캔버스에 그림
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
      }

      canvasRef.current.toBlob(
        (blob) => {
          if (blob) {
            onCapture(blob);
          }
        },
        'image/png',
        1,
      );
    }

    setIsCanvasEmpty(false);
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
    // <Measure bounds onResize={handleResize}>
    //   {({ measureRef }) => (
    <div className="flex-col  w-full">
      {' '}
      {/**Wrapper */}
      <div
        className=" w-full"
        style={{
          height: `${container.height}px`,
        }}
      >
        {/**Container*/}
        <div className="mx-auto">
          <video
            className="block"
            ref={videoRef}
            hidden={!isVideoPlaying || !isCanvasEmpty}
            onCanPlay={handleCanPlay}
            autoPlay
            playsInline
            muted
            style={{
              top: `-${offsets.y}px`,
              left: `-${offsets.x}px`,
            }}
          />
        </div>

        <div className="" hidden={!isVideoPlaying} />

        <canvas
          className="absolute top-24 left-0 bottom-0 right-0 mx-6"
          ref={canvasRef}
          style={{
            width: `0px`,
            height: `0px`,
          }}
        />

        {/* <div flash={isFlashing} onAnimationEnd={() => setIsFlashing(false)} /> */}
      </div>
      {isVideoPlaying && (
        <Button className="relative" onClick={isCanvasEmpty ? handleCapture : handleClear}>
          {isCanvasEmpty ? '찰칵' : '다시 찍기'}
        </Button>
      )}
    </div>
    //   )}
    // </Measure>
  );
}
