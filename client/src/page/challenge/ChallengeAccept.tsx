import { Label } from '@/components/ui/label';
import { useDispatch } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Challenge, users } from '@/types/types';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import { setHeaderInfo } from '@/store/headerSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function ChallengeAccept() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const accept = () => {
    privateApi
      .patch(`/challengeAccept/${challengeDetail?.challenge_id}`)
      .then((response): void => {
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

  const refuse = () => {
    privateApi
      .patch(`/challengeReject/${challengeDetail?.challenge_id}`)
      .then((res) => {
        console.log(res);
        alert('참가 거절되었습니다.');
        navigate(-1);
      })
      .catch((error): void => {
        console.error('ChallengeDetail에서 참가 axios 오류:', error);
      });
  };

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 상세', backPath: -1 }));
  }, [dispatch]);

  useEffect(() => {
    privateApi
      .get(`/challengeDetail/${challenge_id}`)
      .then((response): void => {
        setChallengeDetail(response.data.challengeDetail[0]);
        setChallengers(response.data.challengers);
      })
      .catch((error): void => {
        console.error('ChallengeDetail에서 axios 오류:', error);
      });
  }, []);

  return (
    <div className="">
      <h1 className="py-4 text-3xl font-bold">챌린지 정보</h1>

      <div>
        <div className="user-list flex">
          <h2 className="flex w-full py-4 text-xl font-bold">참여자</h2>
          <div className="flex w-fit items-center space-x-2">
            <Label className="w-8">{challengeDetail?.is_public ? '공개' : '비공개'}</Label>
          </div>
        </div>

        <div className="user-list flex flex-col gap-4">
          <div className="flex items-center gap-2">
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
      <h2 className="py-4 text-xl font-bold">챌린지명</h2>
      <div>{challengeDetail != undefined && challengeDetail.challenge_name}</div>
      <h2 className="py-4 text-xl font-bold">주제</h2>
      <div>{challengeDetail != undefined && challengeDetail.topic}</div>

      <h2 className="py-4 text-xl font-bold">시작날짜</h2>
      <div>
        {challengeDetail != undefined && format(challengeDetail.authentication_start_date, 'PPP EEE', { locale: ko })}
      </div>
      <h2 className="py-4 text-xl font-bold">끝날짜</h2>
      <div>
        {challengeDetail != undefined && format(challengeDetail.authentication_end_date, 'PPP EEE', { locale: ko })}
      </div>

      <h2 className="py-4 text-xl font-bold">인증 주기</h2>
      <div>주 {challengeDetail != undefined && challengeDetail.term}일</div>

      <h2 className="py-4 text-xl font-bold">인증 시간</h2>
      <div>
        {challengeDetail != undefined &&
          challengeDetail.authentication_start_time + '시 ~ ' + challengeDetail.authentication_end_time + '시 '}
      </div>

      <div className="flex justify-center gap-5">
        <Button onClick={accept}>수락</Button>
        <Button onClick={refuse}>거절</Button>
      </div>
    </div>
  );
}

export default ChallengeAccept;
