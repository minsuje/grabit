import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { RootState } from '@/store/store';
import { ProgressComponent } from '@/components/ComponentSeong';
import { Link, useParams } from 'react-router-dom';
import ReactCanvasConfetti from '@/components/ReactCanvasConfetti';
import '@/App.css';
import axios from '@/api/axios';
import { privateApi } from '@/api/axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Challenge } from '@/types/types';

export default function ChallengeResult() {
  const [currentScore, setCurrentScore] = useState<number>(); // 사용자의 현재 점수
  const [earnedScore, setEarnedScore] = useState<number>(0); // 사용자가 획득한 점수
  const [tierName, setTierName] = useState<string>('');
  const [tierImageSrc, setTierImageSrc] = useState<string>('');
  const [showTierResult, setShowTierResult] = useState<boolean>(true);
  const { challenge_id } = useParams<any>();
  const [challengerInfo, setChallengerInfo] = useState<challengerInfo | any>([]);
  const [challengeInfo, setChallengeInfo] = useState<Challenge>();
  const [showConfetti, setShowConfetti] = useState<boolean>(false); // 컨페티 표시 상태 추가
  const [winMessage, setWinMessage] = useState<React.ReactNode>('');

  interface challengerInfo {
    score: number;
  }

  const info = useSelector((state: RootState) => state.result);
  const dispatch = useDispatch();
  // console.log('info console.log >>>>>>', info);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 결과', backPath: -1 }));
  }, [dispatch]);

  // 마이페이지
  useEffect(() => {
    axios
      .get(`http://52.79.228.200:3000/myPage`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('>>>>>>', response.data.userInfo[0].score_num);
        setCurrentScore(response.data.userInfo[0].score_num);
      })
      .catch((error) => {
        console.error('사용자 정보 불러오기 오류', error);
      });
  }, []);

  // 챌린지 상세 정보 보기 점수 업데이트
  useEffect(() => {
    privateApi
      .post(`http://52.79.228.200:3000/challengeDetail/${challenge_id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
        winner_userid_num: info.winner,
        total_money: info.totalMoney,
        challenge_id,
      })
      .then((response) => {
        console.log('점수업데이트~~~>>>>>>', response);
        setChallengerInfo(response.data.challengerInfo);
        setChallengeInfo(response.data.challengeInfo);
        response.data.challengerInfo.map((challenger: any, index: any) => {
          console.log(`Challenger ${index + 1}:`, challenger.nickname, challenger.score);
        });
      })
      .catch((error) => {
        console.error('점수업데이트에러', error);
      });
  }, []);

  // 티어 결과 숨기기 함수
  const handleHideTierResult = () => {
    setShowTierResult(false);
  };

  // 티어 및 이미지 업데이트 로직
  useEffect(() => {
    if (currentScore >= 2000) {
      setTierName('챌린저');
      setTierImageSrc('/challengerTear.png');
    } else if (currentScore >= 1500) {
      setTierName('다이아');
      setTierImageSrc('/diamondTear.png');
    } else if (currentScore >= 1000) {
      setTierName('플래티넘');
      setTierImageSrc('/platinumTear.png');
    } else if (currentScore >= 500) {
      setTierName('실버');
      setTierImageSrc('/silverTear.png');
    } else {
      setTierName('Unranked');
      setTierImageSrc('/grabit_profile.png');
    }
  }, [currentScore]);

  useEffect(() => {
    if (challengerInfo.length > 0 && typeof challengerInfo[0]?.score === 'number') {
      const scoreChange = challengerInfo[0].score; // 획득 점수
      const targetScore = currentScore + scoreChange; // 목표 점수 계산

      const intervalId = setInterval(() => {
        setCurrentScore((prevScore) => {
          // 점수 증가
          if (scoreChange > 0 && prevScore < targetScore) {
            return prevScore + 1;
          }
          // 점수 감소
          else if (scoreChange < 0 && prevScore > targetScore) {
            return prevScore - 1;
          }
          // 목표 점수에 도달하거나, 그 외의 경우 인터벌 종료
          clearInterval(intervalId);
          return targetScore; // 목표 점수 설정으로 정확한 값 보장
        });
      }, 50); // 10ms 마다 실행

      return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
    }
  }, [challengerInfo]);

  // ReactCanvasConfetti 효과
  useEffect(() => {
    if (challengerInfo.length > 0 && typeof challengerInfo[0]?.score === 'number') {
      const scoreChange = challengerInfo[0].score;

      if (scoreChange === 100) {
        setShowConfetti(true);
        // 승리 메시지에 녹색 적용
        setWinMessage(<span style={{ color: 'blue' }}>승리하셨습니다!</span>);
      } else {
        setShowConfetti(false);
        // 패배 메시지에 빨간색 적용
        setWinMessage(<span style={{ color: 'red' }}>패배하셨습니다.</span>);
      }
    }
  }, [challengerInfo]);

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
                className="flex flex-col "
              >
                <h2>{winMessage}</h2>
                <h2>당신의 티어: {tierName}</h2>
                <img src={tierImageSrc} alt={`${tierName} 티어 이미지`} className="tier-image" />
                <h2>획득 점수: {challengerInfo[0]?.score}</h2>
                <h2 className="text-6xl">{currentScore}</h2>
              </motion.div>

              <Button onClick={handleHideTierResult}>확인</Button>
            </div>
          </div>
        </div>
      )}

      {showConfetti && <ReactCanvasConfetti />}

      <div className="container ">
        <h1 className="mb-10  p-3 text-center text-3xl font-extrabold">{challengeInfo?.challenge_name} 결과</h1>
        <div className="flex text-center">
          <div className="text-center">
            <div>
              <span className="text-2xl font-black">{info.result[0].nickname}</span>
              <p>{info.result[0].Authcount}회 성공</p>
              <p>{challengerInfo[0]?.carrot}캐럿</p>
              <p>{challengerInfo[0]?.score} P </p>
            </div>
            <div className="text-center">
              <img src={tierImageSrc} alt="tear" className="mx-auto " />
            </div>
          </div>

          <div className="text-center">
            <div>
              <span className="text-2xl font-black">{info.result[1].nickname}</span>
              <p>{info.result[1].Authcount}회 성공</p>
              <p>{challengerInfo[1]?.carrot}캐럿</p>
              <p>{challengerInfo[1]?.score} P </p>
            </div>
            <div className="text-center">
              <img src={tierImageSrc} alt="tear" className="mx-auto " />
            </div>
          </div>

          {info.result[2] && (
            <div className="text-center">
              <div>
                <span className="text-2xl font-black">{info.result[2].nickname}</span>
                <p>{info.result[2].Authcount}회 성공</p>
                <p>{challengerInfo[2]?.carrot}캐럿</p>
                <p>{challengerInfo[2]?.score} P</p>
              </div>
              <div className="text-center">
                <img src={tierImageSrc} alt="tear" className="mx-auto " />
              </div>
            </div>
          )}

          {info.result[3] && (
            <div className="text-center">
              <div>
                <span className="text-2xl font-black">{info.result[3].nickname}</span>
                <p>{info.result[3].Authcount}회 성공</p>
                <p>{challengerInfo[3]?.carrot}캐럿</p>
                <p>{challengerInfo[3]?.score} P</p>
              </div>
              <div className="text-center">
                <img src={tierImageSrc} alt="tear" className="mx-auto" />
              </div>
            </div>
          )}
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
