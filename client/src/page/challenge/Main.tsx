import { HotChallenge, Ranking } from '@/components/Component0117';
import { ListComponent1 } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState, useLayoutEffect } from 'react';
import { privateApi } from '@/api/axios';
import { Challenge, dailyMission } from '@/types/types';

import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { differenceInHours } from 'date-fns';
import { setUserid_num } from '@/store/loginSlice';

export default function Main() {
  const LoginId: number = 3;
  const dispatch = useDispatch();
  // const { accessToken, refreshToken } = useSelector((state: RootState) => state.login);
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  console.log('🚀 ~ refreshAccessToken ~ refreshToken:', refreshToken);
  console.log('🚀 ~ refreshAccessToken ~ accessToken:', accessToken);

  async function refreshAccessToken() {
    console.log('🚀 ~ refreshAccessToken ~ refreshToken:', refreshToken);
    console.log('🚀 ~ refreshAccessToken ~ accessToken:', accessToken);

    await privateApi(
      // .get('http://localhost:3000/refresh', {
      //   withCredentials: true,
      //   headers: { Authorization: `Bearer ${accessToken}` },
      // })
      {
        method: 'POST',
        url: 'http://localhost:3000/refresh',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
      // .get('http://localhost:3000/refresh', { withCredentials: true })
      .then((response) => {
        console.log('Refresh token success', response);
      })
      .catch((error) => {
        console.error('Refresh token error', error);
      });
  }


  const [userid_num, setUserid_num] = useState<number>(0);

  const [ingMyChallenge, setIngMyChallenge] = useState<Challenge[]>([]);
  const [dailymission, setDailymission] = useState<string>('');
  const [completed, setCompleted] = useState<string>('none');

  useEffect(() => {

    setUserid_num(Number(localStorage.getItem('userid_num')));
    console.log('userid >>>>>>>>>>>', userid_num);

    privateApi
      .get('http://3.34.122.205:3000/dailyMission', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('dailyMission >>>>>>>', response.data);
        setDailymission(response.data.mission_name[0].mission_content);
        setCompleted(response.data.completed);
      })
      .catch((error) => {
        console.error('main에서 일일미션 오류발생 :', error);
      });
    privateApi
      .get('http://3.34.122.205:3000/challengeList', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('challengeList >>>>>>>>>', response.data);
        setIngMyChallenge(response.data.ingMyChallenge);
      })
      .catch((error) => {
        console.error('ChallengeInProgress에서 진행중인챌린지 오류발생 :', error);
      });

    console.log('dailyMission', dailymission);
    console.log('completed', completed);
    console.log('ingMyChallenge', ingMyChallenge);
  }, [userid_num]);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '홈', backPath: '/' }));
  }, [dispatch]);


  return (
    <div className="my-8 flex flex-col gap-8">
      <h1>랭킹</h1>
      <Button onClick={refreshAccessToken}>refresh 요청</Button>
      {/* <Ranking /> */}
      <h1>오늘의 미션</h1>

      {completed === 'none' ? (
        <Link to={`/challengeDaily/${dailymission}`} className="text-black no-underline">
          <div>
            <div className="mb-[5%] flex flex-col rounded-lg bg-gray-200 p-6 shadow-md">
              <div className="flex justify-between">
                <p>{dailymission}</p>
                <p>
                  {23 - new Date().getHours()}시간 {59 - new Date().getMinutes()}분 남음
                </p>
              </div>
              <p>10P</p>
            </div>
          </div>
        </Link>
      ) : (
        <div>
          <div className="mb-[5%] flex flex-col rounded-lg bg-gray-200 p-6 shadow-md">
            <div className="flex justify-between">
              <p>{dailymission}</p>
              <p>{completed}</p>

              <p>오늘 미션 완료!!</p>
            </div>
            <p>10P</p>
          </div>
        </div>
      )}

      <h1>진행중인 챌린지</h1>
      {ingMyChallenge.length == 0 ? (
        <div className="p-3 text-gray-700">
          진행중인 챌린지가 없습니다. <br />
          챌린지를 직접 생성하거나 다른 사람이 만든 챌린지에 참여해보세요
          <Link to="/challengeList" className=" text-gray-400 no-underline">
            <div className=" ">챌린지 보러가기</div>
          </Link>
        </div>
      ) : (
        ingMyChallenge.map((challenge: Challenge, idx: number) => {
          return (
            <>
              <Link to={`/challengeInProgress/${challenge.challenge_id}`} className="text-black no-underline">
                <ListComponent1 key={idx} challenge={challenge} />
              </Link>
            </>
          );
        })
      )}
      <h1>지금 인기있는 주제</h1>
      <HotChallenge />
      <Link to="/challengeList" className="text-center text-gray-400 no-underline">
        <div>전체 챌린지 보러가기</div>
      </Link>
      <div className="flex flex-col gap-3 p-3 text-center">
        <Link to="/challengeCreate">
          <Button>챌린지 생성</Button>
        </Link>
        <Link
          to="/challengeInProgress/1
        "
        >
          <Button>진행중인 챌린지</Button>
        </Link>
        <Link to="/fileUpload">
          <Button>파일 업로드 테스트</Button>
        </Link>
        <Link to="/challengeEdit/1">
          <Button>1번 챌린지 수정</Button>
        </Link>
        <Link to="/mypage/2">
          <Button>마이페이지 </Button>
        </Link>
      </div>
    </div>
  );
}
