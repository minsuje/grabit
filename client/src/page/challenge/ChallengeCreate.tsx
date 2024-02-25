import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { privateApi } from '@/api/axios';
// import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { RootState } from '@/store/store';
import { FriendSelect } from '@/types/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Cta from '@/components/Cta';
import {
  setSliceChallengeName,
  setSliceTopic,
  // setSliceIsPublic,
  setSliceTerm,
  // setSliceGoalMoney,
  // setSliceDate,
  // setSliceAuthTerm,
  // setSliceAuthStart,
  // setSliceAuthEnd,
  setSave,
} from '@/store/challengeSlice';
import { resetFriendList } from '@/store/friendSlice';

const schema = yup
  .object({
    name: yup
      .string()
      .required('* 이름은 필수입니다.')
      .matches(/^[가-힣\s]+$/, '* 이름은 한글로만 작성해주세요.'),
    topic: yup.string().notOneOf([''], '주제를 선택하세요.'),
    keyword: yup
      .string()
      .required('* 키워드작성은 필수입니다.')
      .matches(/^[A-Za-z]{2,15}$/, {
        message:
          '키워드는 영어로만 작성해야 하며, 특수문자를 사용할 수 없습니다. 최소 2글자 이상 15글자 이하로 작성해주세요.',
      }),
    goalMoney: yup.number().required('* 금액을 작성해주세요.').min(1000, '* 최소 금액은 1000원 이상이어야 합니다.'),
    startDate: yup.string().required('날짜를 입력해주세요'),
    term: yup.string().required('기간을 선택하세요.'),
    authTerm: yup.string().required('주기를 선택하세요'),
    authStart: yup.string().required('인증 시작 시간을 선택하세요'),
    authEnd: yup.string().required('인증 마감 시간을 선택하세요'),
  })
  .required();

function ChallengeCreate() {
  const dispatch = useDispatch();
  const challengeState = useSelector((state: RootState) => state.challenge);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // defaultValues: {
    //   topic: challengeState.topic,
    // },
  });

  function handleChallengeNameChange(value: string) {
    setValue('name', value, { shouldValidate: true });
    dispatch(setSliceChallengeName(value));
    setChallengeName(value);
  }

  const handleTopicChange = (value: string) => {
    console.log(value);
    setValue('topic', value, { shouldValidate: true });
    dispatch(setSliceTopic(value));
    setTopic(value);
  };

  const handleTermChange = (value: string) => {
    setValue('term', value, { shouldValidate: true });
    setTerm(Number(value));
    if (term == 2) {
      setAuthTerm('7');
    }
    setSliceTerm(value);
  };

  const handleAuthTermChange = (value: string) => {
    setValue('authTerm', value, { shouldValidate: true });
    setAuthTerm(value);
  };

  const handleAuthStartChange = (value: string) => {
    if (Number(value) >= Number(authEnd) && authEnd) {
      setCheckStartTime(false);
      setValue('authStart', (Number(authEnd) - 1).toString(), { shouldValidate: true });
      setAuthStart((Number(authEnd) - 1).toString());
    } else {
      setCheckStartTime(true);
      setValue('authStart', value, { shouldValidate: true });
      setAuthStart(value);
    }
  };

  const handleAuthEndChange = (value: string) => {
    if (Number(value) <= Number(authStart)) {
      setCheckEndTime(false);
      setValue('authEnd', (Number(authStart) + 1).toString(), { shouldValidate: true });
      setAuthEnd((Number(authStart) + 1).toString());
    } else {
      setCheckEndTime(true);
      setValue('authEnd', value, { shouldValidate: true });
      setAuthEnd(value);
    }
  };

  const handleDateChange = (selectedDate: any) => {
    if (selectedDate) {
      if (addDays(selectedDate, 1) < new Date()) {
        setcheckDate(false);
        setDate(new Date());
        setValue('startDate', format(new Date(), 'yyyy-MM-dd'), { shouldValidate: true });
      } else {
        // 선택된 날짜를 'yyyy-MM-dd' 형식의 문자열로 포맷합니다.
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        // `setValue` 함수를 사용하여 폼의 'startDate' 필드 값을 업데이트합니다.
        setDate(selectedDate);
        setValue('startDate', formattedDate, { shouldValidate: true });
        setcheckDate(true);
      }
    }
  };
  useEffect(() => {
    register('startDate');
  }, [register]);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 생성', backPath: '/main' }));
  }, [dispatch]);

  // 친구 목록에서 돌아오면 상태 불러오기
  useEffect(() => {
    if (challengeState.save) {
      console.log('정보 불러오기 시작');
      setValue('name', challengeState.challengeName, { shouldValidate: true });
      setValue('topic', challengeState.topic);
      dispatch(setSave(false));
    } else {
      console.log('메인에서 돌아옴');
      dispatch(resetFriendList());
      dispatch(setSliceChallengeName(''));
      dispatch(setSliceTopic(''));
    }
  }, []);

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

  const [checkDate, setcheckDate] = useState<boolean>(true);
  const [checkStartTime, setCheckStartTime] = useState<boolean>(true);
  const [checkEndTime, setCheckEndTime] = useState<boolean>(true);

  const selectedFriends = useSelector((state: RootState) => state.friend.selectedFriends);

  useEffect(() => {
    setFriendList(selectedFriends);
  }, [selectedFriends]);

  useEffect(() => {}, [challengeState]);

  const StartHours: number[] = [];
  const EndHours: number[] = [];
  for (let i = 0; i < 24; i++) {
    StartHours.push(i);
  }
  for (let i = 1; i <= 24; i++) {
    EndHours.push(i);
  }

  async function onSubmit() {
    console.log('submit 실행');
    try {
      const friendId: number[] = selectedFriends.map((friend) => friend.userid_num);

      const result = await privateApi({
        method: 'POST',
        url: '/challengeCreate',
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
      if (result.data.msg) {
        alert(result.data.msg);
      } else {
        alert('정상적으로 생성되었습니다.');
        navigate('/challengeList');
      }
    } catch (error) {
      // 오류 처리 로직
      console.error('Challenge creation failed:', error);
    }
  }

  function invalid(err: any) {
    console.log('에러', err);
  }

  function handleFriend() {
    dispatch(setSave(true));
    navigate('/friendSelect');
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
                {isPublic ? '공개' : '비공개'}
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
          {/* <Link to={'/friendSelect'}> */}
          <Button className="w-full" onClick={handleFriend}>
            추가하기
          </Button>
          {/* </Link> */}
        </div>
        <div className="challengeName flex flex-col">
          <h2 className="py-4 text-xl font-bold">챌린지 이름</h2>
          <Input
            {...register('name')}
            onChange={(e) => {
              handleChallengeNameChange(e.target.value);
            }}
          />
          {errors.name && <p className=" p-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="challengeTopic flex flex-col">
          <h2 className="py-4 text-xl font-bold">주제</h2>

          <Select onValueChange={handleTopicChange} value={challengeState.topic !== '' ? challengeState.topic : ''}>
            <SelectTrigger className="w-[180px]" {...register('topic')}>
              <SelectValue placeholder="주제" {...register('topic')} />
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

          <Input type="text" {...register('keyword')} onChange={(e) => setAuthKeyword(e.target.value)} />
          {errors.keyword && <p className=" p-1 text-xs text-red-500">{errors.keyword.message}</p>}
        </div>
        <div className="challengeMoney flex flex-col">
          <h2 className="py-4 text-xl font-bold">목표 금액</h2>
          <Input
            type="number"
            onWheel={(event) => (event.target as HTMLElement).blur()}
            {...register('goalMoney', {
              setValueAs: (value) => (value === '' ? 0 : parseInt(value, 10)),
            })}
            onChange={(e) => setGoalMoney(Number(e.target.value))}
          />
          {errors.goalMoney && <p className=" p-1 text-xs text-red-500">{errors.goalMoney.message}</p>}
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
              <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
          {errors.startDate && <p className=" p-1 text-xs text-red-500">{errors.startDate.message}</p>}
          {!checkDate && <span className="text-xs text-red-500">오늘 이전 날짜는 선택할 수 없습니다.</span>}
        </div>

        <div className="challengeTerm flex flex-col">
          <h2 className="py-4 text-xl font-bold">기간</h2>
          <Select onValueChange={handleTermChange}>
            <SelectTrigger className="w-full" {...register('term')}>
              <SelectValue placeholder="인증 주기" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">3일</SelectItem>
              <SelectItem value="6">일주일</SelectItem>
              <SelectItem value="13">2주일</SelectItem>
            </SelectContent>
          </Select>
          {errors.term && <p className="p-1 text-xs text-red-500">{errors.term.message}</p>}
        </div>

        <div className="challengeStartDate flex flex-col">
          <h2 className="py-4 text-xl font-bold">끝 날짜</h2>
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
                {date && term != 0 ? (
                  format(addDays(date, term), 'PPP EEE요일', { locale: ko })
                ) : (
                  <span> 시작 날짜와 기간을 선택하세요</span>
                )}
              </Button>
            </PopoverTrigger>
          </Popover>
        </div>
        <div className="challengeAuthTerm flex flex-col">
          <h2 className="py-4 text-xl font-bold">인증 주기</h2>
          <Select onValueChange={handleAuthTermChange} value={authTerm}>
            <SelectTrigger className="w-full" {...register('authTerm')}>
              <SelectValue placeholder="인증주기" />
            </SelectTrigger>
            <SelectContent>
              {term != 2 && (
                <>
                  <SelectItem value="3">주 3회</SelectItem>
                  <SelectItem value="5">주 5회</SelectItem>
                </>
              )}
              <SelectItem value="7">매일</SelectItem>
            </SelectContent>
          </Select>
          {errors.authTerm && <p className="text-xs text-red-500">{errors.authTerm.message}</p>}
        </div>
        <div className="challengeAuthStart flex flex-col">
          <div className="authTime flex w-full gap-4">
            <div className="startTime flex w-full flex-col">
              <h2 className="py-4 text-xl font-bold">인증 시작 시간</h2>
              <Select onValueChange={handleAuthStartChange} value={authStart}>
                <SelectTrigger className="w-full" {...register('authStart')}>
                  <SelectValue placeholder="인증 시간" />
                </SelectTrigger>
                <SelectContent>
                  {StartHours.map((hour, i) => {
                    return (
                      <SelectItem key={i} value={hour.toString()}>
                        {hour}시
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.authStart && <p className="text-xs text-red-500">{errors.authStart.message}</p>}
            </div>
            <div className="endTime flex w-full flex-col">
              <h2 className="py-4 text-xl font-bold">인증 마감 시간</h2>
              <Select onValueChange={handleAuthEndChange} value={authEnd}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="인증 시간" />
                </SelectTrigger>
                <SelectContent>
                  {EndHours.map((hour, i) => {
                    return (
                      <SelectItem key={i} value={hour.toString()}>
                        {hour}시
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.authEnd && <p className="text-xs text-red-500">{errors.authEnd.message}</p>}
            </div>
          </div>
        </div>
        {!checkStartTime || !checkEndTime ? (
          <p className="text-xs text-red-500">마감시간은 시작시간 이후로 설정해주세요</p>
        ) : (
          <></>
        )}

        <Cta text={'생성하기'} onclick={handleSubmit(onSubmit, invalid)} />
      </form>
    </div>
  );
}

export default ChallengeCreate;
