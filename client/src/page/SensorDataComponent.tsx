import React, { useEffect, useState } from 'react';

const SensorDataComponent = () => {
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const handleOrientation = (event) => {
      const { alpha, beta, gamma } = event;
      setOrientation({ alpha, beta, gamma });
    };

    const handleMotion = (event) => {
      const { acceleration } = event;
      if (acceleration) {
        setMotion(acceleration);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return (
    <div>
      <h1>Device Orientation and Motion Data</h1>
      <p>
        Orientation - Alpha: {orientation.alpha} Beta: {orientation.beta} Gamma: {orientation.gamma}
      </p>
      <p>
        Motion - X: {motion.x} Y: {motion.y} Z: {motion.z}
      </p>
    </div>
  );
};

export default SensorDataComponent;
