import { Label } from '@/components/ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RootState } from '@/store/store';
import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Challenge, users } from '@/types/types';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { setHeaderInfo } from '@/store/headerSlice';
import Cta from '@/components/Cta';

function ChallengeDetail() {
  const { userid_num } = useSelector((state: RootState) => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { challenge_id } = useParams();
  const [challengeDetail, setChallengeDetail] = useState<Challenge>();
  const [challengers, setChallengers] = useState<users[]>([
    {
      userid_num: 1,
      login_type: 'normal',
      userid: 'userid',
      social_userid: 'userid',
      password: 'password',
      name: 'name',
      nickname: 'nickname',
      profile_img: null,
      score_num: 30,
      money: 1000,
    },
  ]);

  const participate = () => {
    privateApi
      .get(`http://3.34.122.205:3000/challengeAccept/${challengeDetail?.challenge_id}`)
      .then((response): void => {
        console.log('response', response.data);
      })
      .catch((error): void => {
        console.error('ChallengeDetail에서 참가 axios 오류:', error);
      });
  };

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 정보', backPath: -1 }));
  }, [dispatch]);

  useEffect(() => {
    console.log(challenge_id);
    privateApi
      .get(`http://3.34.122.205:3000/challengeDetail/${challenge_id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })

      .then((response): void => {
        console.log('response', response.data);
        setChallengeDetail(response.data.challengeDetail[0]);
        setChallengers(response.data.challengers);
      })
      .catch((error): void => {
        console.error('ChallengeDetail에서 axios 오류:', error);
      });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="py-4 text-3xl font-bold">챌린지 정보</h1>

      <div>
        <div className="user-list mb-4 flex gap-2">
          <h2 className="flex w-full py-4 font-['JalnanGothic'] text-xl font-bold text-grabit-700">참여자</h2>
          <div className="flex w-fit items-center space-x-2">
            <Label className="rounded-md bg-grabit-200 px-3 py-2 font-semibold text-grabit-700">
              {challengeDetail?.is_public ? '공개' : '비공개'}
            </Label>
          </div>
        </div>

        <div className="user-list flex flex-col gap-4">
          {/* <div className="flex flex-col items-center gap-2"> */}
          <div
            className={`grid grid-cols-${challengers.length} items-start justify-center gap-4 break-all text-center`}
          >
            {challengers.map((challenger: users, idx) => {
              return (
                <div className="flex w-full flex-col items-center gap-2" key={idx}>
                  <Avatar className="flex h-16 w-16 flex-col">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="flex" />
                    <AvatarFallback className="flex">CN</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-stone-600">{challenger.nickname}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="challengeName">
        <h2 className="flex w-full py-4 font-['JalnanGothic'] text-xl font-bold text-grabit-700">챌린지명</h2>
        <p className="text-lg font-medium text-stone-600">
          {challengeDetail != undefined && challengeDetail.challenge_name}
        </p>
      </div>

      <div className="topic">
        <h2 className="flex w-full py-4 font-['JalnanGothic'] text-xl font-bold text-grabit-700">주제</h2>
        <p className="text-lg font-medium text-stone-600">{challengeDetail != undefined && challengeDetail.topic}</p>
      </div>

      <div className="startDate">
        <h2 className="flex w-full py-4 font-['JalnanGothic'] text-xl font-bold text-grabit-700">시작날짜</h2>
        <p className="text-lg font-medium text-stone-600">
          {challengeDetail != undefined && format(challengeDetail.authentication_start_date, 'PPP EEE', { locale: ko })}
        </p>
      </div>

      <div className="endDate">
        <h2 className="flex w-full py-4 font-['JalnanGothic'] text-xl font-bold text-grabit-700">끝날짜</h2>
        <p className="text-lg font-medium text-stone-600">
          {challengeDetail != undefined && format(challengeDetail.authentication_end_date, 'PPP EEE', { locale: ko })}
        </p>
      </div>

      <div className="term">
        <h2 className="flex w-full py-4 font-['JalnanGothic'] text-xl font-bold text-grabit-700">인증 주기</h2>
        <p className="text-lg font-medium text-stone-600">
          주 {challengeDetail != undefined && challengeDetail.term}일
        </p>
      </div>

      <div className="authTime">
        <h2 className="flex w-full py-4 font-['JalnanGothic'] text-xl font-bold text-grabit-700">인증 시간</h2>
        <p className="text-lg font-medium text-stone-600">
          {challengeDetail != undefined &&
            challengeDetail.authentication_start_time + '시 ~ ' + challengeDetail.authentication_end_time + '시 '}
        </p>
      </div>

      {challengeDetail?.is_public &&
        challengers.length < 4 &&
        challengers.find((challenger) => challenger.userid_num == userid_num) == undefined && (
          <Cta text={'참가하기'} onclick={() => participate} />
        )}

      {challengeDetail?.is_public && challengers.length == 4 && (
        <Cta text={'참가하기'} disabled onclick={() => participate} />
      )}
    </div>
  );
}

export default ChallengeDetail;
