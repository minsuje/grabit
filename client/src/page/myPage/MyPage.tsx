import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { privateApi } from '@/api/axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ListComponent3 } from '@/components/ComponentSeong';

interface UserInfo {
  nickname: string;
  score_num: number;
  money: string;
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
  const { userid_num } = useParams();
  const [nickName, setNickName] = useState<string>('');
  const [scoreNum, setScoreNum] = useState<number>(0);
  const [money, setMoney] = useState<string>('');
  const [win, setWin] = useState<string>('');
  const [lose, setLose] = useState<string>('');
  const [history, setHistory] = useState<ChallengeHistory[]>([]); // history는 배열 타입
  const [proFileImg, setProfileImg] = useState<string>('');
  const [ranking, setRanking] = useState<string>('');
  const [friends, setFriends] = useState<Friend[]>([]); // 전체 친구 목록

  useEffect(() => {
    // 프로필 이미지 요청
    privateApi
      .get(`http://localhost:3000/myPage`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        setProfileImg(response.data.file);
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
      .get<UserInfo>(`http://localhost:3000/myPage`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        const userInfo: UserInfo = response.data.userInfo[0];

        setNickName(userInfo.nickname);
        setScoreNum(userInfo.score_num);
        setMoney(userInfo.money);
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

  // 친구 요청
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

  return (
    <div className="">
      <h1>마이페이지</h1>

      <Avatar>
        <AvatarImage src={proFileImg} />
        <AvatarFallback></AvatarFallback>
      </Avatar>

      <Link to={`/${userid_num}/mypageedit`}>
        <Button type="submit" variant="outline">
          프로필 수정
        </Button>
      </Link>

      <div>
        <p>{nickName}</p>
      </div>

      <div className="mt-10 flex content-center">
        <div className="flex  w-[100%] flex-col justify-center">
          <p>{scoreNum}</p>
        </div>
        <div className="mr-5 w-[10%] text-end">
          <p>{tierName}</p>
          <p className="text-xs text-neutral-300">{ranking}위</p>
        </div>
        <div className="flex flex-col content-center justify-center">
          <img src={tierImageSrc} alt="Tier Image" className="glowing-image w-12 " />
        </div>
      </div>
      <br />
      <br />
      <div className="user-list rga-4 flex flex-col">
        {friends.map((friend, index) => (
          <div className="flex items-center gap-2" key={index}>
            <Avatar>
              <AvatarImage
                src={friend.profile_img ? friend.profile_img : '/grabit_profile.png'}
                alt={friend.nickname}
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <span>{friend.nickname}</span>
          </div>
        ))}
        {/* 각각의 친구목록 전체보기 */}
        <Link to={`/mypage/friend/detail/${userid_num}/`}>
          <Button>전체보기</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <span>{money}</span>
          <Link to="/mypage/myPagewithdraw">
            <span>출금하기</span>
          </Link>
        </div>
        <div className="flex justify-between">
          <button className="text-xs text-gray-400">내역보기</button>
          <Link to="/mypage/mypagecharge">
            <span>충전하기</span>
          </Link>
        </div>

        <div className="flex justify-between">
          <p>전적</p>
          {/* http://localhost:3000/history history axios */}
          <p>
            {win}승 {lose}패
          </p>
        </div>
        <div>
          <div>
            {history?.map((challenge, key) => (
              <Link to={`/mypagehistorydetail/${challenge.challenge_id}`} key={key} className="text-black no-underline">
                <ListComponent3 history={challenge} scoreNum={scoreNum} challenge_name={challenge.challenge_name} />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <Link to={`/mypagehistorydetail/${userid_num}`}>
            <button>전체보기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
