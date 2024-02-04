import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';
import { fr, ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { privateApi } from '@/api/axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { RootState } from '@/store/store';
import { FriendSelect } from '@/types/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
  .object({
    name: yup
      .string()
      .required('* 이름은 필수입니다.')
      .min(2, '이름은 2글자 이상 8글자 이하로 작성해주세요.')
      .max(8, '이름은 2글자 이상 8글자 이하로 작성해주세요.')
      .matches(/^[가-힣]+$/, '* 이름은 한글로만 작성해주세요.'),
    topic: yup.string().required('* 주제는 필수입니다.'),
  })

  .required();

function ChallengeCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const dispatch = useDispatch();
  const challengeState = useSelector((state: RootState) => state.challenge);

  useEffect(() => {
    setChallengeName(challengeState.challengeName);
  }, [challengeState]);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 생성', backPath: '/main' }));
  }, [dispatch]);

  const [friendList, setFriendList] = useState<FriendSelect[]>([]);

  const [challengeName, setChallengeName] = useState<string>('');
  const [goalMoney, setGoalMoney] = useState<number>(0);
  const [date, setDate] = useState<Date>();
  const [term, setTerm] = useState<number>(0);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('');
  const [authTerm, setAuthTerm] = useState<string>('');
  const [authStart, setAuthStart] = useState<string>('');
  const [authEnd, setAuthEnd] = useState<string>('');
  const [authKeyword, setAuthKeyword] = useState<string>('');

  const selectedFriends = useSelector((state: RootState) => state.friend.selectedFriends);

  useEffect(() => {
    setFriendList(selectedFriends);
  }, [selectedFriends]);

  useEffect(() => {}, [challengeState]);

  const hours: number[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i);
  }

  const amHours: number[] = [];
  const pmHours: number[] = [];
  hours.forEach((hour) => {
    if (hour < 12) {
      amHours.push(hour);
    } else {
      pmHours.push(hour);
    }
  });

  async function onSubmit() {
    const friendId: number[] = selectedFriends.map((friend) => friend.userid_num);

    const result = await privateApi({
      method: 'POST',
      url: 'http://52.79.228.200:3000/challengeCreate',
      data: {
        challenge_name: challengeName,
        is_public: isPublic,
        topic,
        challenger_userid_num: friendId,
        auth_keyword: authKeyword,
        goal_money: goalMoney,
        term: authTerm,
        authentication_start_date: date ? date : null,
        authentication_end_date: date ? addDays(date, term) : null,
        authentication_start_time: authStart,
        authentication_end_time: authEnd,
      },
    });
    console.log(result);
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="py-4 text-3xl font-bold">챌린지 생성</h1>
        <div>
          <div className="user-list flex">
            <h2 className="flex w-full py-4 text-xl font-bold">참여자</h2>
            <div className="flex w-fit items-center space-x-2">
              <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
              <Label htmlFor="public" className="w-8">
                공개
              </Label>
            </div>
          </div>
          {/* '/grabit_profile.png' */}
          <div className="flex flex-col gap-3 pb-4">
            {friendList.map((friend) => (
              <div key={friend.userid_num} className="user-list flex items-center gap-2">
                {friend.profile_img ? (
                  <>
                    <Avatar>
                      <AvatarImage src={friend.profile_img} />
                      <AvatarFallback>{friend.nickname}</AvatarFallback>
                    </Avatar>
                    <span>{friend.nickname}</span>
                  </>
                ) : (
                  <>
                    <Avatar>
                      <AvatarImage src="/grabit_profile.png" />
                      <AvatarFallback>{friend.nickname}</AvatarFallback>
                    </Avatar>
                    <span>{friend.nickname}</span>
                  </>
                )}
              </div>
            ))}
          </div>
          <Link to={'/friendSelect'}>
            <Button className="w-full">추가하기</Button>
          </Link>
        </div>
        <div className="challengeName flex flex-col">
          <h2 className="py-4 text-xl font-bold">챌린지 이름</h2>
          <Input
            {...register('name')}
            onChange={(e) => {
              setChallengeName(e.target.value);
            }}
          />
          {errors.name && <p className=" p-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="challengeTopic flex flex-col">
          <h2 className="py-4 text-xl font-bold">주제</h2>
          <Select
            {...register('topic')}
            onValueChange={(value) => {
              setTopic(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="주제" />
            </SelectTrigger>
            <SelectContent {...register('topic')}>
              <SelectItem value="운동">운동</SelectItem>
              <SelectItem value="셀프케어">셀프케어</SelectItem>
              <SelectItem value="독서">독서</SelectItem>
              <SelectItem value="학습">학습</SelectItem>
              <SelectItem value="취미">취미</SelectItem>
              <SelectItem value="생활습관">생활습관</SelectItem>
              <SelectItem value="저축">저축</SelectItem>
            </SelectContent>
          </Select>
          {errors.topic && <p className=" p-1 text-xs text-red-500">{errors.topic.message}</p>}
        </div>
        <div className="challengeMoney flex flex-col">
          <h2 className="py-4 text-xl font-bold">인증 키워드</h2>
          <span className="text-gray-500">영어로 입력해주세요</span>
          <Input type="text" onChange={(e) => setAuthKeyword(e.target.value)} />
        </div>
        <div className="challengeMoney flex flex-col">
          <h2 className="py-4 text-xl font-bold">목표 금액</h2>
          <Input type="number" onChange={(e) => setGoalMoney(Number(e.target.value))} />
        </div>
        <div className="challengeStartDate flex flex-col">
          <h2 className="py-4 text-xl font-bold">시작 날짜</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start rounded-md text-left font-normal',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP EEE요일', { locale: ko }) : <span>날짜를 선택하세요</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="challengeTerm flex flex-col">
          <h2 className="py-4 text-xl font-bold">기간</h2>
          <Select onValueChange={(value) => setTerm(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="인증 주기" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">3일</SelectItem>
              <SelectItem value="6">일주일</SelectItem>
              <SelectItem value="13">2주일</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="challengeAuthTerm flex flex-col">
          <h2 className="py-4 text-xl font-bold">인증 주기</h2>
          <Select onValueChange={(value) => setAuthTerm(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="인증 주기" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">주 3회</SelectItem>
              <SelectItem value="5">주 5회</SelectItem>
              <SelectItem value="7">매일</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="challengeAuthStart flex flex-col">
          <div className="authTime flex w-full gap-4">
            <div className="startTime flex w-full flex-col">
              <h2 className="py-4 text-xl font-bold">인증 시작 시간</h2>
              <Select onValueChange={(value) => setAuthStart(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="인증 시간" />
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
            <div className="endTime flex w-full flex-col">
              <h2 className="py-4 text-xl font-bold">인증 마감 시간</h2>
              <Select onValueChange={(value) => setAuthEnd(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="인증 시간" />
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
        </div>
        <div className="cta fixed bottom-0 left-0 right-0 flex flex-col">
          <div className="flex h-8 bg-gradient-to-b from-transparent to-white"></div>
          <div className="flex bg-white px-8  pb-8 ">
            <Button type="submit" className="w-full rounded-md p-6">
              생성하기
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChallengeCreate;
