/**
 * Since the camera container resembles a licence card, the height must always be less than the
 * width (regardless of the resolution of the camera). This is achieved by calculating a ratio
 * that is always >= 1 by dividing by the largest dimension.
 **/

import { useState, useCallback } from 'react';

export function useCardRatio(initialParams: number) {
  const [aspectRatio, setAspectRatio] = useState(initialParams);

  const calculateRatio = useCallback((height: number, width: number): void => {
    if (height && width) {
      const isLandscape = height <= width;
      const ratio = isLandscape ? width / height : height / width;

      setAspectRatio(ratio);
    }
  }, []);

  return [aspectRatio, calculateRatio] as const;
}
