import canvasConfetti from 'canvas-confetti';
import { useEffect, useRef } from 'react';

function ReactCanvasConfetti() {
    const confettiRef = useRef(null);

    useEffect(() => {
        // 페이지가 렌더링될 때 폭죽 효과를 활성화
        if (confettiRef.current) {
            canvasConfetti({
                particleCount: 1500, // 폭죽 파티클 수
                spread: 1555, // 파티클 퍼짐 정도
                origin: { y: -0.5 }, // 폭죽이 시작하는 위치 (0.7은 상단 70% 위치)
                angle: 180,
                startVelocity: 45,
                gravity: 1.5,
            });
        }
    }, []);

    return <div className="canvas-confetti-container" ref={confettiRef}></div>;
}

export default ReactCanvasConfetti;
