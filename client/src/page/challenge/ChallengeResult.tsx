import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { RootState } from '@/store/store';
import { ProgressComponent } from '@/components/ComponentSeong';
import { Link } from 'react-router-dom';
import ReactCanvasConfetti from '@/components/ReactCanvasConfetti';
import '@/App.css';
import axios from '@/api/axios';
import { privateApi } from '@/api/axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function ChallengeResult() {
  const [currentScore, setCurrentScore] = useState<number>(0); // 사용자의 현재 점수
  const [earnedScore, setEarnedScore] = useState<number>(-50); // 사용자가 획득한 점수
  const [finalScore, setFinalScore] = useState<number>(currentScore + earnedScore); // 최종 점수
  const [tierName, setTierName] = useState<string>('');
  const [tierImageSrc, setTierImageSrc] = useState<string>('');
  const [showTierResult, setShowTierResult] = useState<boolean>(true);

  const info = useSelector((state: RootState) => state.result);
  const dispatch = useDispatch();
  console.log(info);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 결과', backPath: -1 }));
  }, [dispatch]);

  useEffect(() => {
    privateApi
      .get(`http://localhost:3000/myPage`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('res>>>>>>', response);
        setFinalScore(response.data.userInfo[0].score_num + earnedScore);
      })
      .catch((error) => {
        console.error('사용자 정보 불러오기 오류', error);
      });
  }, []);

  // 티어 결과 숨기기 함수
  const handleHideTierResult = () => {
    setShowTierResult(false);
  };

  // 티어 및 이미지 업데이트 로직
  useEffect(() => {
    if (finalScore >= 2000) {
      setTierName('챌린저');
      setTierImageSrc('/challengerTear.png');
    } else if (finalScore >= 1500) {
      setTierName('다이아');
      setTierImageSrc('/diamondTear.png');
    } else if (finalScore >= 1000) {
      setTierName('플래티넘');
      setTierImageSrc('/platinumTear.png');
    } else if (finalScore >= 500) {
      setTierName('실버');
      setTierImageSrc('/silverTear.png');
    } else {
      setTierName('Unranked');
      setTierImageSrc('/defaultTear.png');
    }
  }, [finalScore]);

  // 점수 변화 감지하고 티어 결과 보여주기 로직
  useEffect(() => {
    let score = currentScore;
    const interval = setInterval(() => {
      if (score < finalScore) {
        score += 3;
        setCurrentScore(score);
      } else if (score > finalScore) {
        // 추가된 부분: 점수가 finalScore보다 크면 감소
        score--;
        setCurrentScore(score);
      } else {
        clearInterval(interval);
      }
    }, 1); // 10ms 간격으로 점수를 1씩 증가 또는 감소

    return () => clearInterval(interval);
  }, [finalScore]);
  // 현재 점수에 따른 티어 정보 추출

  return (
    <>
      {showTierResult && (
        <div className="full-screen-overlay">
          <div className="challenge-result-page">
            <div className="tier-info text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 3 }}
              >
                <h2>당신의 티어: {tierName}</h2>
                <img src={tierImageSrc} alt={`${tierName} 티어 이미지`} className="tier-image" />
                <h2>획득 점수: {earnedScore}</h2>
                <h2 className="text-6xl">{currentScore}</h2>
              </motion.div>

              <Button onClick={handleHideTierResult}>확인</Button>
            </div>
          </div>
        </div>
      )}
      <ReactCanvasConfetti />
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
              <p>{finalScore}</p>
            </div>
          </div>
          <div className="text-center">
            <p>총점</p>
            <img src={tierImageSrc} alt="tear" className="mx-auto w-[30%]" />
            <p>{finalScore}</p>
          </div>
        </div>
        <ProgressComponent ProgressName="진행률" total={info.totalAuth} value={info.result[0].Authcount} />
        <div className="text-center ">
          <Link to="/main">
            <button className="mb-10 mt-10">확인</button>
          </Link>
        </div>
      </div>
    </>
  );
}
