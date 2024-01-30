// import { ProgressComponent } from '@/components/ComponentSeong';
import ReactCanvasConfetti from '@/components/ReactCanvasConfetti';
import { Button } from '@/components/ui/button';
// import { ListComponent2 } from '@/components/ComponentSeong';
import ChallengeData from '@/data/ChallengeData';
import { Link } from 'react-router-dom';
import '@/App.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { RootState } from '@/store/store';
import { ProgressComponent } from '@/components/ComponentSeong';
import axios from '@/api/axios';

export default function ChallengeResult() {
  const [goalmony, setGoalmoney] = useState('');
  const [scoreNum, setScoreNum] = useState<number>(0);

  const info = useSelector((state: RootState) => state.result);
  console.log('>>>>>>>>', info);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 결과', backPath: -1 }));
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`http://3.34.122.205:3000/challengeDetail/1`)
      .then((response) => {
        console.log('챌린지 데이터>>>>>>', response.data);
      })
      .catch((error) => {
        console.error('챌린지 데이터  axios 오류', error);
      });
  }, []);

  console.log(ChallengeData);

  const getTierImage = (score: number) => {
    if (score >= 2000) return '/challengerTear.png';
    if (score >= 1500) return '/diamondTear.png';
    if (score >= 1000) return '/platinumTear.png';
    return '/silverTear.png';
  };

  const getTierName = (score: number) => {
    if (score >= 2000) return '챌린저';
    if (score >= 1500) return '다이아몬드';
    if (score >= 1000) return '플래티넘';
    return '실버';
  };
  const tierImageSrc = getTierImage(scoreNum);
  const tierName = getTierName(scoreNum);

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
          <h1 className="text-2xl font-black">{info.result[0].nickname}</h1>
          <h1 className="text-2xl font-black">{info.result[1].nickname}</h1>
          <p>{info.result[0].Authcount}회 성공</p>
          <p>{info.result[1].Authcount}회 성공</p>
          <p>+3000 캐럿</p>
          <p>-3000 캐럿</p>
          <p>+100P</p>
          <p>-50P</p>
        </div>
        <ProgressComponent ProgressName="진행률" total={info.totalAuth} value={info.result[0].Authcount} />
        <div className="mt-10 grid grid-cols-2 place-content-center gap-2">
          <div className="relative text-center">
            <div className="text-center">
              <p>총점</p>
              <img src={tierImageSrc} alt="tear" className="mx-auto w-[30%]" />
              <p>총점</p>
            </div>
          </div>
          <div className="text-center">
            <p>총점</p>
            <img src={tierImageSrc} alt="tear" className="mx-auto w-[30%]" />
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
