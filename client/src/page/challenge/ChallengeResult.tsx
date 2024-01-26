// import { ProgressComponent } from '@/components/ComponentSeong';
import ReactCanvasConfetti from '@/components/ReactCanvasConfetti';
import { Button } from '@/components/ui/button';
// import { ListComponent2 } from '@/components/ComponentSeong';
import ChallengeData from '@/data/ChallengeData';
import { Link } from 'react-router-dom';
import '@/App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

export default function ChallengeResult() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 결과', backPath: -1 }));
  }, [dispatch]);

  console.log(ChallengeData);

  return (
    <>
      <div className="flex h-[150px] items-center justify-center">
        <div className="challenge-result-container">
          <h1>축하합니다</h1>
          {/* ReactCanvasConfetti 컴포넌트를 사용하여 폭죽 효과 활성화 */}
          <ReactCanvasConfetti />
        </div>
      </div>

      <div className="container">
        <div className="mb-10 p-3 text-center text-5xl font-extrabold">30,000 원</div>
        <div className="grid grid-cols-2 gap-4 p-1 text-center">
          <h1 className="text-2xl font-black">나</h1>
          <h1 className="text-2xl font-black">상대</h1>
          <p>3회 성공</p>
          <p>5회 성공</p>
          <p>+3000 캐럿</p>
          <p>-3000 캐럿</p>
          <p>+100P</p>
          <p>-50P</p>
        </div>
        <div className="mt-10 grid grid-cols-2 place-content-center gap-2">
          <div className="relative text-center">
            <div className="text-center">
              <p>티어</p>
              <img src="/tear.png" alt="tear" className="mx-auto w-[30%]" />
              <p>총점</p>
            </div>
          </div>
          <div className="text-center">
            <p>티어</p>
            <img src="/tear.png" alt="tear" className="mx-auto w-[30%]" />
            <p>총점</p>
          </div>
        </div>
        <br />
        <br />
        {/* 나 :<ProgressComponent /> */}
        <br />
        {/* 상대 :<ProgressComponent /> */}
        <br />
        <br />
        {/* <ListComponent2 challenge={ChallengeData[0]} /> */}
        <div className="text-center ">
          <Link to="/main">
            <Button className="mb-10 mt-10">확인</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
