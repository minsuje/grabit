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
import { privateApi } from '@/api/axios';
import { motion } from 'framer-motion';

export default function ChallengeResult() {
  const [goalmony, setGoalmoney] = useState('');
  const [scoreNum, setScoreNum] = useState(500);
  const [nickName, setNickName] = useState<string>('');
  const [showTierResult, setShowTierResult] = useState(true);
  const [prevScore, setPrevScore] = useState(null); // 이전 점수 상태

  const info = useSelector((state: RootState) => state.result);
  console.log('>>>>>>>>', info);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 결과', backPath: -1 }));
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`http://3.34.122.205:3000/challengeDetail/2`)
      .then((response) => {
        console.log('챌린지 데이터>>>>>>', response.data);
      })
      .catch((error) => {
        console.error('챌린지 데이터  axios 오류', error);
      });
  }, []);

  useEffect(() => {
    privateApi
      .get(`http://localhost:3000/myPage`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('res>>>>>>', response);
        setNickName(response.data.userInfo[0].nickname);
      })
      .catch((error) => {
        console.error('사용자 정보 불러오기 오류', error);
      });
  }, []);

  // http://localhost:3000/myPage
  console.log(ChallengeData);
  // 점수 변화 감지하고 티어 결과 보여주기 로직

  // 티어 결과 숨기기 함수
  const handleHideTierResult = () => {
    setShowTierResult(false);
  };

  // 이전 스코어 <= 500
  const getTierImage = (scoreNum: number) => {
    if (scoreNum >= 2000) return '/challengerTear.png';
    if (scoreNum >= 1500) return '/diamondTear.png';
    if (scoreNum >= 1000) return '/platinumTear.png';
    if (scoreNum >= 500) return '/silverTear.png';
  };

  const getTierName = (scoreNum: number) => {
    if (scoreNum >= 2000) return '챌린저';
    if (scoreNum >= 1500) return '다이아몬드';
    if (scoreNum >= 1000) return '플래티넘';
    if (scoreNum >= 500) return '실버';
  };
  const tierImageSrc = getTierImage(scoreNum);
  const tierName = getTierName(scoreNum);

  return (
    <>
      {showTierResult && (
        <div className="full-screen-overlay">
          <div className="challenge-result-page">
            <div className="tier-info w-[50]% text-center">
              <h2>당신의 티어: {tierName} </h2>

              {/* <img src={tierImageSrc} alt={`${tierName} 티어 이미지`} className="tier-image" /> */}
              {/* <ReactCanvasConfetti /> */}

              {/* 티어 이미지 framer */}
              <motion.div
                initial={{ scale: 0 }} // 시작 스케일
                animate={{ scale: 0.5 }} // 종료 스케일
                transition={{ duration: 2.5 }} // 애니메이션 지속 시간
              >
                <h2 className="text-6xl">{scoreNum}</h2>
                <img src={tierImageSrc} alt={`${tierName} 티어 이미지`} className="tier-image" />
              </motion.div>
              <Button className="return-button mt-5" onClick={handleHideTierResult}>
                확인
              </Button>

              {/* className="h-[100px] w-[100px] bg-slate-400" */}
            </div>

            {/* 조건부 콘텐츠 렌더링 */}
            {/* <div className=" flex flex-col content-center justify-center text-center">
              {scoreNum >= 2000 && <p>챌린저 티어에 오신 것을 환영합니다! 최상위 티어의 특별한 혜택을 즐겨보세요.</p>}
              {scoreNum >= 1500 && scoreNum < 2000 && <p>다이아몬드 티어입니다! 다음 티어로의 도전을 응원합니다!</p>}
              {scoreNum >= 1000 && scoreNum < 1500 && <p>플래티넘 티어를 달성하셨습니다! 계속해서 노력해 주세요.</p>}
              {scoreNum < 1000 && <p>실버 티어입니다. 더 높은 티어를 향해 도전하세요!</p>}
            </div> */}
          </div>

          <div className="flex h-[150px] items-center justify-center">
            <div className="challenge-result-container">
              {/* ReactCanvasConfetti 컴포넌트를 사용하여 폭죽 효과 활성화 */}
              <ReactCanvasConfetti />
            </div>
          </div>
        </div>
      )}

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
        <div className="mt-10 grid grid-cols-2 place-content-center gap-2">
          <div className="relative text-center">
            <div className="text-center">
              <p>총점</p>
              <img src={tierImageSrc} alt="tear" className="mx-auto w-[30%]" />
              <p></p>
            </div>
          </div>
          <div className="text-center">
            <p>총점</p>
            <img src={tierImageSrc} alt="tear" className="mx-auto w-[30%]" />
            <p>총점</p>
          </div>
        </div>
        <ProgressComponent ProgressName="진행률" total={info.totalAuth} value={info.result[0].Authcount} />
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
