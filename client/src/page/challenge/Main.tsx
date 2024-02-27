import MainRanking from '@/components/MainRanking';
import { ListComponent1 } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { privateApi } from '@/api/axios';
import { Challenge } from '@/types/types';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import HotChallenge from '@/components/HotChallenge';
import { BsPlus } from 'react-icons/bs';
import { motion } from 'framer-motion';

export default function Main() {
  const dispatch = useDispatch();

  const [userid_num, setUserid_num] = useState<number>(0);
  const [ingMyChallenge, setIngMyChallenge] = useState<Challenge[]>([]);
  const [endedMyChallenge, setEndedMyChallenge] = useState<Challenge[]>([]);
  const [dailymission, setDailymission] = useState<string>('');
  const [completed, setCompleted] = useState<string>('none');

  useEffect(() => {
    setUserid_num(Number(localStorage.getItem('userid_num')));

    privateApi
      .get('/dailyMission', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        setDailymission(response.data.mission.title);
        setCompleted(response.data.completed);
      })
      .catch((error) => {
        console.error('main에서 일일미션 오류발생 :', error);
      });

    privateApi
      .get('/challengeList', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        setIngMyChallenge(response.data.ingMyChallenge);
        setEndedMyChallenge(response.data.endedMyChallenge);
      })
      .catch((error) => {
        console.error('ChallengeInProgress에서 진행중인챌린지 오류발생 :', error);
      });
  }, [userid_num]);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '홈', backPath: '/' }));
  }, [dispatch]);

  return (
    <div className="my-8 flex flex-col gap-16">
      <div className="flex flex-col">
        <div className="ranking flex flex-col">
          <h1 className="text-grabit-800">랭킹</h1>
          <MainRanking />
        </div>
        <div className="today-mission flex flex-col gap-6">
          <h1 className="text-grabit-800">오늘의 미션</h1>
          {completed === 'none' ? (
            <Link to={`/challengeDaily`} className="text-black no-underline">
              <div>
                <div className="flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-lg shadow-grabit-600/10">
                  <div className="flex justify-between gap-2">
                    <h2 className="text-grabit-600">{dailymission}</h2>
                    {/* <p className=" text-grabit-400"></p> */}
                  </div>
                  <div className="flex w-full items-center justify-end gap-2 text-right text-2xl font-extrabold text-grabit-800">
                    10
                    <span className="mb-[0px] align-top text-sm font-bold text-grabit-400">포인트</span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div>
              <div className="flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-lg shadow-grabit-600/10">
                <div className="flex justify-between">
                  <h2>{dailymission}</h2>
                  <p>오늘 미션 완료!!</p>
                </div>
                <p>10P</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {endedMyChallenge.length !== 0 && (
        <>
          <h1>완료된 챌린지</h1>
          <div className="flex flex-col gap-4">
            {endedMyChallenge.map((challenge: Challenge, index) => {
              return (
                <Link
                  key={index}
                  to={`/challengeInProgress/${challenge.challenge_id}`}
                  className="text-black no-underline"
                >
                  <div>
                    <div className="bg-gray-white flex flex-col gap-6 rounded-xl p-6 shadow-lg shadow-grabit-600/10">
                      <div className="flex items-center justify-center">
                        <h2 className="flex w-full">{challenge.challenge_name}</h2>
                        <p className="w-28 text-stone-500">챌린지 완료</p>
                      </div>
                      <Button>결과 확인하기</Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <div className="challenge-in-progress flex flex-col gap-8">
        <h1 className="text-grabit-800">진행중인 챌린지</h1>
        {ingMyChallenge.length == 0 ? (
          <div className="flex flex-col gap-4 rounded-xl bg-white p-8 text-center text-grabit-400 shadow-lg shadow-grabit-600/10">
            진행중인 챌린지가 없습니다. <br />
            챌린지를 직접 생성하거나 <br />
            다른 사람이 만든 챌린지에 참여해보세요
            <Link to="/challengeList" className=" text-gray-400 no-underline">
              <Button className="">챌린지 보러가기</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {ingMyChallenge.map((challenge: Challenge, idx: number) => {
              return (
                <Link key={idx} to={`/challengeInProgress/${challenge.challenge_id}`} className="flex flex-col gap-2">
                  <ListComponent1 challenge={challenge} />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="trending-challenge flex flex-col gap-8">
        <h1 className="text-grabit-800">지금 인기있는 주제</h1>
        <HotChallenge />

        <Link to="/challengeList" className="text-center text-gray-400 no-underline">
          <div>전체 챌린지 보러가기</div>
        </Link>
      </div>
      <Link to="/challengeNotice">
        <motion.div
          initial={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 rounded-full bg-grabit-700 p-4 text-center shadow-lg shadow-grabit-600/20"
        >
          {/* <Button>챌린지 생성</Button> */}
          <BsPlus color="white" size={32} />
        </motion.div>
      </Link>
    </div>
  );
}
