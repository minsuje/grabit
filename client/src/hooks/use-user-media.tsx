import { Capture_options } from '@/types/types';
import { useState, useEffect } from 'react';

export function useUserMedia(requestedMedia: Capture_options) {
  const [mediaStream, setMediaStream] = useState<null | MediaStream>(null);

  useEffect(() => {
    async function enableVideoStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
        console.log('stream', stream);
        setMediaStream(stream);
      } catch (err) {
        console.error('에러', err);
        // Handle the error
      }
    }

    if (!mediaStream) {
      enableVideoStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream, requestedMedia]);

  return mediaStream;
}
