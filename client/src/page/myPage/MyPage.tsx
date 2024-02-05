import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { privateApi } from '@/api/axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ListComponent3 } from '@/components/ComponentSeong';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { useRive } from '@rive-app/react-canvas';
import { motion, useMotionValue, useTransform, animate, inView } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface UserInfo {
  nickname: string;
  score_num: number;
  carrot: number;
  userInfo: any;
  id: number;
}

interface ChallengeHistory {
  challenge_id?: number;
  userid_num?: number;
  challenge_name: string;
  topic: string;
  challenger_userid_num: [];
  goal_money: number;
  is_public: boolean;
  term: number;
  auth_keyword: any;
  authentication_start_date: Date;
  authentication_end_date: Date;
  authentication_start_time: number;
  authentication_end_time: number;
}

interface HistoryData {
  win: string;
  lose: string;
  history: ChallengeHistory[];
}
interface Friend {
  id: number;
  nickname: string;
  profile_img: string;
}

export default function MyPage() {
  const dispatch = useDispatch();
  // const { userid_num } = useParams();
  const userid_num = localStorage.getItem('userid_num');
  const [nickName, setNickName] = useState<string>('');
  const [scoreNum, setScoreNum] = useState<number>(0);
  const [money, setMoney] = useState<number>(0);
  const [win, setWin] = useState<string>('');
  const [lose, setLose] = useState<string>('');
  const [history, setHistory] = useState<ChallengeHistory[]>([]); // history는 배열 타입
  const [proFileImg, setProfileImg] = useState<string>('');
  const [ranking, setRanking] = useState<string>();
  const [friends, setFriends] = useState<Friend[]>([]); // 전체 친구 목록

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '마이페이지', backPath: `/main` }));
  }, [dispatch]);

  useEffect(() => {
    // 프로필 이미지 요청
    privateApi
      .get(`http://localhost:3000/myPage`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('mypage >>>>>', response.data);
        setProfileImg(response.data.file);
        console.log('profileImg >>>>>', proFileImg);
      })
      .catch((error) => {
        console.error('이미지 불러오기 axios 오류', error);
      });
  }, [proFileImg]);

  useEffect(() => {
    // 챌린지 테이블정보 요청
    privateApi
      .get(`http://localhost:3000/history`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log(response);
        const historyData: HistoryData = response.data;
        console.log('>>>>>', historyData);
        setWin(historyData.win);
        setLose(historyData.lose);

        // 데이터 로딩 후 정렬 로직 적용
        const sortedHistory = historyData.history.sort((a, b) => {
          const dateA = new Date(a.authentication_start_date).getTime();
          const dateB = new Date(b.authentication_start_date).getTime();
          return dateB - dateA; // 내림차순 정렬
        });

        setHistory(sortedHistory);
      })
      .catch((error) => {
        console.error(' 히스토리 오류 axios 오류', error);
      });
  }, [userid_num]);

  // 닉네임 스코어 점수 돈
  useEffect(() => {
    privateApi
      .get(`http://localhost:3000/myPage`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('mypage', response.data);
        const userInfo: UserInfo = response.data.userInfo[0];
        console.log('🚀 ~ .then ~ userInfo:', userInfo);

        setNickName(userInfo?.nickname);
        setScoreNum(userInfo?.score_num);
        setMoney(userInfo?.carrot);
      })
      .catch((error) => {
        console.error('사용자 정보 불러오기 오류', error);
      });
  }, [userid_num]);

  useEffect(() => {
    // 랭킹 요청
    privateApi
      .get(`http://localhost:3000/myRanking`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        setRanking(response.data);
      })
      .catch((error) => {
        console.error(' 랭킹 axios 오류', error);
      });
  }, []);

  // 내 친구목록 불러오기
  useEffect(() => {
    privateApi
      .get(`http://localhost:3000/friend/${userid_num}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        const friendsData = response.data.friends_info.slice(0, 3); // 처음 3개의 데이터만 선택
        setFriends(friendsData);
      })
      .catch((error) => {
        console.error('친구 목록 불러오기 axios 오류', error);
      });
  }, []);

  const getTierImage = (score: number) => {
    if (score >= 2000) return '/challengerTear.png';
    if (score >= 1500) return '/diamondTear.png';
    if (score >= 1000) return '/platinumTear.png';
    return '/silverTear.png';
  };

  const getTierName = (score: number) => {
    if (score >= 2000) return '챌린저';
    if (score >= 1500) return '다이아';
    if (score >= 1000) return '플래티넘';
    return '실버';
  };

  const tierImageSrc = getTierImage(scoreNum);
  const tierName = getTierName(scoreNum);

  const { RiveComponent } = useRive({
    src: '/diamond.riv',
    stateMachines: ['Rotate', 'Flash', 'Timeline1', 'Hover'],
    autoplay: true,
  });

  const count = useMotionValue(money - 1000);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, money, { duration: 2 });

    return controls.stop;
  }, [money]);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1, // Adjust this value based on when you want the animation to start (0.1 means 10% of the element should be visible)
  });

  console.log('>>>>>>>proFileImg', proFileImg);
  return (
    <div className="">
      <h1>마이페이지</h1>
      <div></div>

      <div className="section flex">
        <div className="profile mt-8 flex w-full flex-col items-center justify-center gap-4">
          <Avatar className="aspect-square h-20 w-20">
            <AvatarImage src={proFileImg === '' ? proFileImg : `/grabit_profile.png`} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          {nickName === '' ? (
            <Skeleton className="h-[32px] w-[60px]" />
          ) : (

            <p className="text-2xl font-extrabold text-grabit-700">{nickName}</p>

          )}
          <Link to={`/mypage/edit`}>
            <Button type="submit">프로필 수정</Button>
          </Link>
        </div>
      </div>

      <div className="my-16 flex w-full items-center justify-center text-center">
        <div className="tier flex w-full basis-1/4 flex-col items-center justify-center">
          <img src={tierImageSrc} alt="Tier Image" className="glowing-image w-12 " />
          <p className="text-2xl font-bold text-stone-700">{tierName}</p>
          {/* <p className="text-xl text-stone-500">{ranking}위</p> */}
        </div>
        <div className="mt-1 flex h-full w-full basis-2/4 flex-col justify-center">
          <p className="text-2xl font-extrabold text-grabit-600">{scoreNum}</p>
          <p className="text-xl font-bold text-stone-500">포인트</p>
        </div>
        <div className="flex w-full basis-1/4  flex-col items-center justify-center">
          {/* <h3 className="text-xl font-medium text-stone-500">전적</h3> */}
          <span className="flex text-2xl font-bold text-stone-700">
            {win}
            <p className="ml-1 flex">승</p>
          </span>
          <span className="flex text-2xl font-bold text-stone-700">
            {lose}
            <p className="ml-1 flex">패</p>
          </span>
        </div>
      </div>

      <div className="friend flex flex-col items-center justify-center gap-4 ">
        <div className="flex w-full items-center">
          <h2 className="font-['SUITE Variable'] w-full text-2xl">친구</h2>
          <Link to={`/mypage/friend`}>
            <Button variant={'secondary'} className="font-bold">
              전체보기
            </Button>
          </Link>
        </div>
        <div className="user-list  font-['SUITE Variable'] flex w-full flex-col gap-2 text-stone-600">
          {friends.map((friend, index) => (
            <div className="flex w-full items-center gap-3" key={index}>
              <Avatar>
                <AvatarImage
                  src={friend.profile_img ? friend.profile_img : 'grabit_profile.png'}
                  alt={friend.nickname}
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <span>{friend.nickname}</span>
            </div>
          ))}
        </div>
      </div>


      <div className="carrot relative my-12 flex flex-col gap-4 rounded-2xl bg-grabit-100 px-8 pb-4 pt-12">
        <div className="absolute bottom-[150px] left-1/2 right-1/2 h-40 w-40 -translate-x-1/2 opacity-100">

          <RiveComponent />
        </div>
        <motion.div
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.4 }}

          className="font-['SUITE Variable'] flex w-full flex-col text-center text-3xl font-black text-grabit-800"

        >
          <motion.span
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ delay: 0.4 }}

            className="font-['SUITE Variable'] w-full text-center text-3xl font-black text-grabit-800"

          >
            {rounded}
          </motion.span>
          <span className="ml-1 text-xl font-bold text-grabit-400">캐럿</span>
        </motion.div>
        <div className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
            <Link to="/mypage/charge" className="w-full">
              <Button variant={'secondary'} className="bg-grabit-200 w-full">
                충전하기
              </Button>
            </Link>
            <Link to="/mypage/withdraw" className="w-full ">
              <Button variant={'secondary'} className="bg-grabit-200 w-full">
                출금하기
              </Button>
            </Link>
          </div>
          <Button variant={'ghost'} className="w-full">
            내역보기
          </Button>
        </div>
      </div>

      <div className="friend flex flex-col items-center justify-center gap-4 ">
        <div className="flex w-full items-center">
          <h2 className="font-['SUITE Variable'] w-full text-2xl">히스토리</h2>
          <Link to={`/mypage/friend`}>
            <Button variant={'secondary'} className="font-bold">
              전체보기
            </Button>
          </Link>
        </div>
        <div className="user-list  font-['SUITE Variable'] flex w-full flex-col gap-2 text-stone-600">
          {history?.map((challenge, key) => (
            <Link to={`/mypage/historydetail/${challenge.challenge_id}`} key={key} className="text-black no-underline">
              <ListComponent3 history={challenge} scoreNum={scoreNum} challenge_name={challenge.challenge_name} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
