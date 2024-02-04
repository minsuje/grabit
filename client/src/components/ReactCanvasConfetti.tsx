import canvasConfetti from 'canvas-confetti';
import { useEffect, useRef } from 'react';

function ReactCanvasConfetti() {
  const confettiRef = useRef(null);

  useEffect(() => {
    // 페이지가 렌더링될 때 폭죽 효과를 활성화
    if (confettiRef.current) {
      canvasConfetti({
        particleCount: 3, // 폭죽 파티클 수
        spread: 350, // 파티클 퍼짐 정도
        origin: { y: 0.5 }, // 폭죽이 시작하는 위치 (0.7은 상단 70% 위치)
        angle: 80,
        startVelocity: 45,
        gravity: 1.5,
        colors: ['#ff0000', '#00ff00', '#0000ff'],
      });
      // // 두 번째 방향에서 폭죽 효과
      // canvasConfetti({
      //     particleCount: 150,
      //     spread: 520,
      //     origin: { y: 0.4 },
      //     angle: 250,
      //     startVelocity: 45,
      //     gravity: 1.5,
      // });
      // // 세 번째 방향에서 폭죽 효과
      // canvasConfetti({
      //     particleCount: 250,
      //     spread: 320,
      //     origin: { y: 0.5 },
      //     angle: 350,
      //     startVelocity: 45,
      //     gravity: 1.5,
      //     colors: ['#ff0000', '#00ff00', '#0000ff'],
      // });
      // // 네 번째 방향에서 폭죽 효과
      // canvasConfetti({
      //     particleCount: 150,
      //     spread: 350,
      //     origin: { y: 0.7 },
      //     angle: 250,
      //     startVelocity: 45,
      //     gravity: 1.5,
      // });
      // // 다섯 번째 방향에서 폭죽 효과
      // canvasConfetti({
      //     particleCount: 150,
      //     spread: 350,
      //     origin: { y: 0.9 },
      //     angle: 250,
      //     startVelocity: 45,
      //     gravity: 1.5, // 중력의 영향을 없애고 위로 올라감
      //     colors: ['#ff0000', '#00ff00', '#0000ff'],
      // });
    }
  }, []);

  return <div className="canvas-confetti-container" ref={confettiRef}></div>;
}

export default ReactCanvasConfetti;
