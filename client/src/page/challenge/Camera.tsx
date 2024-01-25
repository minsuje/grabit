import { useState } from 'react';
import { CameraAction } from '../../camera/camera';
import { Button } from '@/components/ui/button';

function Camera() {
  const [isCameraOpen, setIsCameraOpen] = useState<Boolean>(false);
  const [cardImage, setCardImage] = useState<Blob>();

  return (
    <>
      <div className="flex-col align-middle">
        <div>
          {isCameraOpen && (
            <CameraAction
              onCapture={(blob: Blob) => {
                setCardImage(blob);
                console.log('blob', blob);
              }}
              onClear={() => setCardImage(undefined)}
            />
          )}
        </div>

        {cardImage && (
          <div className="text-center">
            <h2>미리보기</h2>
            {/* <img className="absolute w-[50%] h-auto" src={cardImage && URL.createObjectURL(cardImage)} /> */}
          </div>
        )}
        <div className="fixed bottom-0 right-0 left-0 flex justify-center align-middle">
          <Button onClick={() => setIsCameraOpen(true)}>Open Camera</Button>
          <Button
            onClick={() => {
              setIsCameraOpen(false);
              setCardImage(undefined);
              console.log(isCameraOpen);
            }}
          >
            Close Camera
          </Button>
        </div>
      </div>
    </>
  );
}

export default Camera;
