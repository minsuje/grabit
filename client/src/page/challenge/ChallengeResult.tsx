// import { ProgressComponent } from '@/components/ComponentSeong';
import ReactCanvasConfetti from '@/components/ReactCanvasConfetti';
import { Button } from '@/components/ui/button';
// import { ListComponent2 } from '@/components/ComponentSeong';
import ChallengeData from '@/data/ChallengeData';
import { Link } from 'react-router-dom';
import '@/App.css';

export default function ChallengeResult() {
  console.log(ChallengeData);

  return (
    <>
      <div className="flex justify-center items-center h-[150px]">
        <div className="challenge-result-container">
          <h1>축하합니다</h1>
          {/* ReactCanvasConfetti 컴포넌트를 사용하여 폭죽 효과 활성화 */}
          <ReactCanvasConfetti />
        </div>
      </div>

      <div className="container">
        <div className="text-center font-extrabold text-5xl p-3 mb-10">30,000 원</div>
        <div className="grid grid-cols-2 gap-4 text-center p-1">
          <h1 className="font-black text-2xl">나</h1>
          <h1 className="font-black text-2xl">상대</h1>
          <p>3회 성공</p>
          <p>5회 성공</p>
          <p>+3000 캐럿</p>
          <p>-3000 캐럿</p>
          <p>+100P</p>
          <p>-50P</p>
        </div>
        <div className="grid grid-cols-2 gap-2 place-content-center mt-10">
          <div className="text-center relative">
            <div className="text-center">
              <p>티어</p>
              <img src="/tear.png" alt="tear" className="w-[30%] mx-auto" />
              <p>총점</p>
            </div>
          </div>
          <div className="text-center">
            <p>티어</p>
            <img src="/tear.png" alt="tear" className="w-[30%] mx-auto" />
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
            <Button className="mt-10 mb-10">확인</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
