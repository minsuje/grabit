import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format, differenceInDays, addHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { privateApi } from '@/api/axios';
import { useParams } from 'react-router-dom';
import { Challenge, users } from '@/types/types';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
import { motion } from 'framer-motion';
import Cta from '@/components/Cta';

async function patchChallenge(
  challenge_id: string | undefined,
  challengeDetail: Challenge,
  startDay: Date | undefined,
  period: number,
) {
  startDay && addHours(startDay, 9);

  let challengeData = challengeDetail;
  if (startDay != undefined) {
    challengeData = {
      ...challengeDetail,
      authentication_start_date: startDay,
      authentication_end_date: addDays(startDay, period),
    };
  }

  const result = await privateApi({
    method: 'PATCH',
    url: `/challengeEdit/${challenge_id}`,
    data: challengeData,
  });
  if (result.status == 200) {
    alert('정상적으로 수정되었습니다.');
  } else {
    alert('오류가 발생했습니다. 다시 시도해주세요');
  }
}

async function deleteChallenge(challenge_id: string | undefined) {
  if (confirm('정말 삭제하시겠습니까?')) {
    await privateApi({
      method: 'DELETE',
      url: `/challengeEdit/${challenge_id}`,
    });
  }
}

function ChallengeEdit() {
  const dispatch = useDispatch();
  const { challenge_id } = useParams();
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 수정', backPath: -1 }));
  }, [dispatch]);

  useEffect(() => {
    {
      privateApi
        .get(`/challengeDetail/${challenge_id}`)
        .then((response) => {
          setChallengeDetail(response.data.challengeDetail[0]);
          setChallengers(response.data.challengers);
        })
        .catch((error) => {
          console.error('ChallengeEdit에서 오류발생 :', error);
        });
    }
  }, []);

  const [challengeDetail, setChallengeDetail] = useState<Challenge>({
    challenge_id: 1,
    userid_num: 1,
    challenge_name: '',
    topic: '',
    challenger_userid_num: [{ resultConfirm: false, userid_num: 30, isAccept: true }],
    goal_money: 1000,
    is_public: true,
    auth_keyword: '',
    term: 3,
    winner_userid_num: null,
    authentication_start_date: new Date('2024-02-01'),
    authentication_end_date: new Date('2024-02-08'),
    authentication_start_time: 4,
    authentication_end_time: 5,
  });

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

  const period = differenceInDays(challengeDetail.authentication_end_date, challengeDetail.authentication_start_date);
  let periodChanged = period;

  const handleStartDate = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      if (addDays(date, 1) < new Date()) {
        alert('오늘 이전 날짜는 선택할 수 없습니다.');
        setDate(new Date());
      }
    }
  };

  const hours: number[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i);
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="py-4 text-3xl font-bold">챌린지 수정</h1>
      <div>
        <div className="user-list flex">
          <h2 className="flex w-full py-4">참여자</h2>
          <div className="flex w-fit items-center space-x-2">
            <Label className="w-8">{challengeDetail.is_public ? '공개' : '비공개'}</Label>
          </div>
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

      <div className="flex flex-col gap-4">
        <h2 className="">챌린지명</h2>
        <Input
          // {...register('challenge_name')}
          value={challengeDetail.challenge_name}
          onChange={(e) => {
            setChallengeDetail((challengeDetail) => {
              return { ...challengeDetail, challenge_name: e.target.value };
            });
          }}
        />
      </div>
      {/* {errors.challenge_name && <p className="text-xs text-red-500">{errors.challenge_name.message}</p>} */}

      <div className="flex flex-col gap-4">
        <h2 className="">주제</h2>
        <Select
          onValueChange={(value) => {
            setChallengeDetail((challengeDetail) => {
              return { ...challengeDetail, topic: value };
            });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={challengeDetail.topic} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="운동">운동</SelectItem>
            <SelectItem value="셀프케어">셀프케어</SelectItem>
            <SelectItem value="독서">독서</SelectItem>
            <SelectItem value="학습">학습</SelectItem>
            <SelectItem value="취미">취미</SelectItem>
            <SelectItem value="생활습관">생활습관</SelectItem>
            <SelectItem value="저축">저축</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="">기간</h2>
        <Select
          value={period.toString()}
          onValueChange={(value) => {
            periodChanged = Number(value);
            setChallengeDetail((challengeDetail) => {
              return {
                ...challengeDetail,
                authentication_end_date: addDays(challengeDetail.authentication_start_date, periodChanged),
              };
            });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">3일</SelectItem>
            <SelectItem value="6">1주</SelectItem>
            <SelectItem value="13">2주</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="">시작 날짜</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start rounded-md text-left font-normal',
                !challengeDetail.authentication_start_date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, 'PPP EEE', { locale: ko })
              ) : (
                <span>{format(challengeDetail.authentication_start_date, 'PPP EEE', { locale: ko })}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={handleStartDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="">끝 날짜</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start rounded-md text-left font-normal',
                !challengeDetail.authentication_end_date && 'text-muted-foreground',
              )}
              disabled
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(addDays(date, period), 'PPP EEE', { locale: ko })
              ) : (
                <span>{format(challengeDetail.authentication_end_date, 'PPP EEE', { locale: ko })}</span>
              )}
            </Button>
          </PopoverTrigger>
        </Popover>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="">인증 주기</h2>
        <Select
          onValueChange={(value) => {
            setChallengeDetail((challengeDetail) => {
              return { ...challengeDetail, term: Number(value) };
            });
          }}
        >
          <SelectTrigger className="w-full">
            {challengeDetail.term != 7 ? (
              <SelectValue placeholder={'주 ' + challengeDetail.term + '일'} />
            ) : (
              <SelectValue placeholder="매일" />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">주 3회</SelectItem>
            <SelectItem value="5">주 5회</SelectItem>
            <SelectItem value="7">매일</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="authTime flex gap-4">
        <div className="startTime flex w-full flex-col gap-4">
          <h2 className="">인증 시작 시간</h2>
          <Select
            value={challengeDetail.authentication_start_time.toString()}
            onValueChange={(value) => {
              if (Number(value) >= challengeDetail.authentication_end_time) {
                alert('인증 마감 시간보다 빠르게 설정할 수 없습니다.');
                setChallengeDetail((challengeDetail) => {
                  return {
                    ...challengeDetail,
                    authentication_start_time: challengeDetail.authentication_end_time - 1,
                  };
                });
              } else {
                setChallengeDetail((challengeDetail) => {
                  return { ...challengeDetail, authentication_start_time: Number(value) };
                });
              }
            }}
          >
            <SelectTrigger className="w-full  ">
              <SelectValue placeholder={challengeDetail.authentication_start_time + '시'} />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour, i) => {
                return (
                  <SelectItem key={i} value={hour.toString()}>
                    {hour}시
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="endTime flex w-full flex-col gap-4">
          <h2 className="">인증 마감 시간</h2>
          <Select
            value={challengeDetail.authentication_end_time.toString()}
            onValueChange={(value) => {
              if (Number(value) <= challengeDetail.authentication_start_time) {
                alert('인증 시작 시간보다 늦게 설정할 수 없습니다.');
                setChallengeDetail((challengeDetail) => {
                  return {
                    ...challengeDetail,
                    authentication_end_time: challengeDetail.authentication_start_time + 1,
                  };
                });
              } else {
                setChallengeDetail((challengeDetail) => {
                  return { ...challengeDetail, authentication_end_time: Number(value) };
                });
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={challengeDetail.authentication_end_time + '시'} />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour, i) => {
                return (
                  <SelectItem key={i} value={hour.toString()}>
                    {hour}시
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <Button className="bg-red-100 text-red-600 hover:bg-red-50" onClick={() => deleteChallenge(challenge_id)}>
          삭제
        </Button>
        {/* <Button onClick={() => patchChallenge(challenge_id, challengeDetail, date, period)}>수정</Button> */}
        <Cta text={'수정'} onclick={() => patchChallenge(challenge_id, challengeDetail, date, period)} />
      </div>
    </div>
  );
}

export default ChallengeEdit;
