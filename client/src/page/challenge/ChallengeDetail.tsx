import { Label } from '@/components/ui/label';
import { useDispatch } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Challenge, users } from '@/types/types';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { setHeaderInfo } from '@/store/headerSlice';
import Cta from '@/components/Cta';
import { motion } from 'framer-motion';

function ChallengeDetail() {
  const userid_num = localStorage.getItem('userid_num');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { challenge_id } = useParams();
  const [challengeDetail, setChallengeDetail] = useState<Challenge>();
  const [loaded, setLoaded] = useState<boolean>(false);
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
      .patch(`/challengeAccept/${challenge_id}`)
      .then((response): void => {
        // console.log(response.data);
        if (response.data.msg) {
          alert(response.data.msg);
        } else {
          alert('참가 완료되었습니다.');
          navigate(-1);
        }
      })
      .catch((error): void => {
        console.error('ChallengeDetail에서 참가 axios 오류:', error);
      });
  };

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 정보', backPath: -1 }));
  }, [dispatch]);

  useEffect(() => {
    privateApi
      .get(`/challengeDetail/${challenge_id}`)
      .then((response): void => {
        setChallengeDetail(response.data.challengeDetail[0]);
        setChallengers(response.data.challengers);
        setLoaded(true);
      })
      .catch((error): void => {
        console.error('ChallengeDetail에서 axios 오류:', error);
      });
  }, []);

  return loaded ? (
    <div className="flex flex-col gap-8">
      <div className="title flex flex-col">
        <Label className="w-fit rounded-md bg-grabit-200 px-3 py-2 font-semibold text-grabit-700">
          {challengeDetail?.is_public ? '공개' : '비공개'}
        </Label>
        <h1 className="py-4 text-3xl font-bold text-grabit-800">
          {challengeDetail != undefined && challengeDetail.challenge_name}
        </h1>
      </div>

      <div>
        <div className="user-list mb-4 flex gap-2">
          <h2 className="flex w-fit min-w-20 text-lg font-bold text-grabit-700">참여자</h2>
        </div>

        <div className="user-list flex flex-col gap-4">
          <div
            className={`grid grid-cols-${challengers?.length} items-start justify-center gap-4 break-all text-center`}
          >
            {challengers.map((challenger: users, idx) => {
              return (
                <motion.div
                  className="flex w-full flex-col items-center gap-2"
                  key={idx}
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Avatar className="flex h-16 w-16 flex-col">
                    <AvatarImage
                      src={challenger.profile_img ? challenger.profile_img : '/grabit_profile.png'}
                      alt="@shadcn"
                      className="flex"
                    />
                    <AvatarFallback className="flex">CN</AvatarFallback>
                  </Avatar>
                  <span className="text-md font-semibold text-stone-500">{challenger.nickname}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="topic flex gap-2">
        <h2 className="flex w-fit min-w-20 text-lg font-bold text-grabit-700">주제</h2>
        <p className="flex w-full items-center justify-end text-right text-lg font-normal text-stone-500">
          {challengeDetail != undefined && challengeDetail.topic}
        </p>
      </div>

      <div className="startDate flex gap-2">
        <h2 className="flex w-fit min-w-20 text-lg font-bold text-grabit-700">시작 날짜</h2>
        <p className="flex w-full items-center justify-end text-right text-lg font-normal text-stone-500">
          {challengeDetail != undefined && format(challengeDetail.authentication_start_date, 'PPP EEE', { locale: ko })}
        </p>
      </div>

      <div className="endDate flex gap-2">
        <h2 className="flex w-fit min-w-20 text-lg font-bold text-grabit-700">끝 날짜</h2>
        <p className="flex w-full items-center justify-end text-right text-lg font-normal text-stone-500">
          {challengeDetail != undefined && format(challengeDetail.authentication_end_date, 'PPP EEE', { locale: ko })}
        </p>
      </div>

      <div className="term flex gap-2">
        <h2 className="flex w-fit min-w-20 text-lg font-bold text-grabit-700">인증 주기</h2>
        <p className="flex w-full items-center justify-end text-right text-lg font-normal text-stone-500">
          주 {challengeDetail != undefined && challengeDetail.term}일
        </p>
      </div>

      <div className="authTime flex gap-2">
        <h2 className="flex w-fit min-w-20 text-lg font-bold text-grabit-700">인증 시간</h2>
        <p className="flex w-full items-center justify-end text-right text-lg font-normal text-stone-500">
          {challengeDetail != undefined &&
            challengeDetail.authentication_start_time + '시 ~ ' + challengeDetail.authentication_end_time + '시 '}
        </p>
      </div>
      <div className="text-center">
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          확인
        </Button>
      </div>

      {challengeDetail?.is_public &&
        challengers.length < 4 &&
        !challengers.find((challenger) => challenger.userid_num == Number(userid_num)) && (
          <Cta text={'참가하기'} onclick={participate} />
        )}

      {/* {!challengeDetail?.is_public && <Cta text={'비공개 챌린지입니다'} onclick={handleBack} disabled />} */}
      {/* <Cta text={'확인'} onclick={() => navigate(-1)} /> */}

      {challengeDetail?.is_public && challengers.length == 4 && (
        <Cta text={'인원초과'} disabled onclick={() => participate} />
      )}
    </div>
  ) : (
    <div>불러오는 중...</div>
  );
}

export default ChallengeDetail;
