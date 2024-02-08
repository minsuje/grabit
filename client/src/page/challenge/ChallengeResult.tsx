import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { RootState } from '@/store/store';
import { useNavigate, useParams } from 'react-router-dom';
import ReactCanvasConfetti from '@/components/ReactCanvasConfetti';
import '@/App.css';
import axios from '@/api/axios';
import { privateApi } from '@/api/axios';
import { motion } from 'framer-motion';

import { Challenge } from '@/types/types';
import Cta from '@/components/Cta';

export default function ChallengeResult() {
  const navigate = useNavigate();
  const [currentScore, setCurrentScore] = useState<number>(0); // 사용자의 현재 점수

  const [tierName, setTierName] = useState<string>('');
  const [tierImageSrc, setTierImageSrc] = useState<string>('');
  const [showTierResult, setShowTierResult] = useState<boolean>(true);
  const { challenge_id } = useParams<any>();
  const [challengerInfo] = useState<challengerInfo | any>([]);
  const [challengeInfo] = useState<Challenge>();
  const [showConfetti, setShowConfetti] = useState<boolean>(false); // 컨페티 표시 상태 추가
  const [win, setWin] = useState<boolean>(false);
  // const [winMessage, setWinMessage] = useState<React.ReactNode>('');

  interface challengerInfo {
    score: number;
  }

  const info = useSelector((state: RootState) => state.result);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 결과', backPath: -1 }));

    const timer = setTimeout(() => {
      handleHideTierResult();
    }, 5000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // 마이페이지
  useEffect(() => {
    axios
      .get(`/myPage`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        setCurrentScore(response.data.userInfo[0].score_num);
        console.log('mypage >>>>>', response);
      })
      .catch((error) => {
        console.error('사용자 정보 불러오기 오류', error);
      });
  }, []);

  // 챌린지 상세 정보 보기 점수 업데이트
  useEffect(() => {
    const userid_num = localStorage.getItem('userid_num');

    privateApi
      .post(`/challengeDetail/${challenge_id}`, {
        winner_userid_num: info.winner,
        total_money: info.totalMoney,
        challenge_id,
      })
      .then((response) => {
        console.log(response.data);
        const isWinner = response.data.challengeInfo.winner_userid_num.includes(Number(userid_num));
        const scoreChange = isWinner ? 100 : -50;
        setWin(isWinner);

        console.log(isWinner);
        console.log(scoreChange);

        setShowConfetti(isWinner);
        // setWinMessage(
        //   <span style={{ color: isWinner ? 'blue' : 'red' }}>{isWinner ? '승리하셨습니다!' : '패배하셨습니다.'}</span>,
        // );

        const targetScore = currentScore + scoreChange;
        // 점수를 점진적으로 변경하는 로직
        const adjustScore = () => {
          setCurrentScore((prevScore) => {
            if (scoreChange > 0 ? prevScore < targetScore : prevScore > targetScore) {
              // 점수 증가 또는 감소 조건에 따라 1씩 증가 또는 감소
              return prevScore + (scoreChange > 0 ? 1 : -1);
            } else {
              clearInterval(intervalId); // 목표 점수에 도달하면 중단
              return targetScore; // 목표 점수 설정
            }
          });
        };

        const intervalId = setInterval(adjustScore, 40);

        return () => clearInterval(intervalId);
      })
      .catch((error) => {
        console.error('점수업데이트에러', error);
      });
  }, [challenge_id, info.winner, info.totalMoney]);
  // 티어 결과 숨기기 함수
  const handleHideTierResult = () => {
    setShowTierResult(false);
  };

  // set setShowTierResult to false after 5 seconds

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
      setTierName('브론즈');
      setTierImageSrc('/silverTear.png');
    }
  }, [currentScore]);

  // useEffect(() => {
  //   if (challengerInfo.length > 0 && typeof challengerInfo[0]?.score === 'number') {
  //     const scoreChange = challengerInfo[0].score; // 획득 점수
  //     const targetScore = currentScore + scoreChange; // 목표 점수 계산

  //     const intervalId = setInterval(() => {
  //       setCurrentScore((prevScore) => {
  //         // 점수 증가
  //         if (scoreChange > 0 && prevScore < targetScore) {
  //           return prevScore + 1;
  //         }
  //         // 점수 감소
  //         else if (scoreChange < 0 && prevScore > targetScore) {
  //           return prevScore - 1;
  //         }
  //         // 목표 점수에 도달하거나, 그 외의 경우 인터벌 종료
  //         clearInterval(intervalId);
  //         return targetScore; // 목표 점수 설정으로 정확한 값 보장
  //       });
  //     }, 50); // 10ms 마다 실행

  //     return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  //   }
  // }, [challengerInfo]);

  // useEffect(() => {
  //   if (challengerInfo.length > 0 && typeof challengerInfo[0]?.score === 'number') {
  //     const scoreChange = challengerInfo[0].score;

  //     if (scoreChange === 100) {
  //       setShowConfetti(true);
  //       // 승리 메시지에 파란색 적용
  //       setWinMessage(<span style={{ color: 'blue' }}>승리하셨습니다!</span>);
  //     } else {
  //       setShowConfetti(false);
  //       // 패배 메시지에 빨간색 적용
  //       setWinMessage(<span style={{ color: 'red' }}>패배하셨습니다.</span>);
  //     }
  //   }
  // }, [challengerInfo]);

  function handleNavigate() {
    navigate('/main');
  }

  return (
    <>
      {showTierResult && (
        <div>
          <div className="challenge-result-page fixed z-[100] flex h-full w-full items-center justify-center">
            <div className="tier-info text-center">
              <motion.div
                // initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 0.9, 1, 5],
                  opacity: [0, 1, 1, 0],
                  filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(20px)'],
                }}
                transition={{ duration: 5, times: [0, 0.2, 0.9, 1] }}
                className="flex flex-col items-center justify-center text-white"
              >
                {win ? <h2 className="text-white">승리</h2> : <h2 className="text-white">패배</h2>}
                <h2 className="text-white">티어</h2>
                <h3>{tierName}</h3>
                <img src={tierImageSrc} alt={`${tierName} 티어 이미지`} className="tier-image w-40 rounded-full" />
                <div className="score flex flex-col gap-2">
                  <h2 className="text-white">획득 점수</h2>
                  <h2 className="text-white">{challengerInfo[0]?.score}</h2>
                  <h2 className="text-6xl text-white">{currentScore}</h2>
                </div>
              </motion.div>
            </div>
          </div>
          {/* <Cta text={'확인'} onclick={handleHideTierResult} /> */}
          <div>
            <div className="fixed bottom-0 left-0 right-0 top-0 h-full w-full items-center justify-center bg-white/80 p-8 backdrop-blur-3xl">
              <motion.div
                initial={{ x: -200 }}
                animate={{ scale: [1.5, 4], y: [0, -300], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 5, times: [0, 0.2, 0.9, 1] }}
                exit={{ opacity: 0 }}
                className="h-80 w-80 rounded-full bg-gradient-to-tr from-blue-500 to-rose-500"
              ></motion.div>
              {/* <motion.div
                animate={{ scale: [2, 4], x: [300, -300], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 5, times: [0, 0.2, 0.9, 1] }}
                exit={{ opacity: 0 }}
                className="h-80 w-80 rounded-full bg-gradient-to-tr from-rose-500 to-grabit-500"
              ></motion.div> */}
              <motion.div
                animate={{ scale: [1.5, 4], x: [-300, 300], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 5, times: [0, 0.2, 0.9, 1] }}
                exit={{ opacity: 0 }}
                className="h-80 w-80 rounded-full bg-gradient-to-tr from-grabit-500 to-violet-500"
              ></motion.div>
              <motion.div
                initial={{ x: 200 }}
                animate={{ scale: [1.5, 4], y: [-300, 300], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 5, times: [0, 0.2, 0.9, 1] }}
                exit={{ opacity: 0 }}
                className="h-80 w-80 rounded-full bg-gradient-to-tr from-fuchsia-500 to-grabit-500"
              ></motion.div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 top-0 h-full w-full items-center justify-center p-8 backdrop-blur-3xl"></div>
          </div>
        </div>
      )}

      {showConfetti && <ReactCanvasConfetti />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ duration: 6, times: [0, 0.8, 1] }}
        className="container h-full w-full"
      >
        <h1 className="mb-10  p-3 text-center text-3xl font-extrabold">{challengeInfo?.challenge_name} 결과</h1>
        <div className="grid grid-cols-3 text-center">
          {info.result[0] && (
            <div className="text-center">
              <div>
                <span className="text-2xl font-black">{info.result[0].nickname}</span>
                <p>{info.result[0].Authcount}회 성공</p>
                <p>{challengerInfo[0]?.carrot}캐럿</p>
                <p>{challengerInfo[0]?.score} P </p>
              </div>
              <div className="text-center">
                <img src={tierImageSrc} alt="tear" className="mx-auto w-20 rounded-full" />
              </div>
            </div>
          )}

          {info.result[1] && (
            <div className="text-center">
              <div>
                <span className="text-2xl font-black">{info.result[1].nickname}</span>
                <p>{info.result[1].Authcount}회 성공</p>
                <p>{challengerInfo[1]?.carrot}캐럿</p>
                <p>{challengerInfo[1]?.score} P </p>
              </div>
              <div className="text-center">
                <img src={tierImageSrc} alt="tear" className="mx-auto w-20 rounded-full" />
              </div>
            </div>
          )}

          {info.result[2] && (
            <div className="text-center">
              <div>
                <span className="text-2xl font-black">{info.result[2].nickname}</span>
                <p>{info.result[2].Authcount}회 성공</p>
                <p>{challengerInfo[2]?.carrot}캐럿</p>
                <p>{challengerInfo[2]?.score} P</p>
              </div>
              <div className="text-center">
                <img src={tierImageSrc} alt="tear" className="mx-auto w-20 rounded-full" />
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

        {/* <ProgressComponent ProgressName="진행률" total={info.totalAuth} value={info.result[0].Authcount} /> */}
        <div className="text-center ">
          {/* <Link to="/main">
            <button className="mb-10 mt-10">확인</button>
          </Link> */}
          {showTierResult ? null : <Cta text={'확인'} onclick={handleNavigate} />}
        </div>
      </motion.div>
    </>
  );
}
