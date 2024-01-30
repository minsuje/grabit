import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ListComponent3 } from '@/components/ComponentSeong';

interface UserInfo {
  nickname: string;
  score_num: number;
  money: string;
  userInfo: any;
}

interface ChallengeHistory {
  challenge_name: string;
  goal_money: number;
  challenge_id: string; // challenge_id 속성 추가
}

interface HistoryData {
  win: string;
  lose: string;
  history: ChallengeHistory[];
}

export default function MyPage() {
  const { id } = useParams<{ id: string }>();
  const [nickName, setNickName] = useState<string>('');
  const [scoreNum, setScoreNum] = useState<number>(0); // scoreNum은 숫자 타입
  const [money, setMoney] = useState<string>('');
  const [win, setWin] = useState<string>('');
  const [lose, setLose] = useState<string>('');
  const [history, setHistory] = useState<ChallengeHistory[]>([]); // history는 배열 타입
  const [profileimg, setProfileImg] = useState<string | undefined>();

  useEffect(() => {
    // 프로필 이미지 요청
    axios
      .get(`http://3.34.122.205:3000/myPage/${id}`)
      .then((response) => {
        console.log('이미지>>>>>>', response.data);
        setProfileImg(response.data.file);
      })
      .catch((error) => {
        console.error('이미지 불러오기 axios 오류', error);
      });
  }, [id]);

  useEffect(() => {
    // 챌린지 테이블 요청
    axios
      .get(`http://3.34.122.205:3000/history/${id}`)
      .then((response) => {
        const historyData: HistoryData = response.data;
        console.log('>>>>>', historyData);
        setWin(historyData.win);
        setLose(historyData.lose);
        setHistory(historyData.history);
      })
      .catch((error) => {
        console.error(' 히스토리 오류 axios 오류', error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get<UserInfo>(`http://3.34.122.205:3000/mypage/${id}`)
      .then((response) => {
        const userInfo: UserInfo = response.data.userInfo[0];
        console.log('res>>>>>>', userInfo);
        setNickName(userInfo.nickname);
        setScoreNum(userInfo.score_num);
        setMoney(userInfo.money);
      })
      .catch((error) => {
        console.error('사용자 정보 불러오기 오류', error);
      });
  }, [id]);

  const getTierImage = (score: number) => {
    if (score >= 2000) return '/challengerTear.png';
    if (score >= 1500) return '/diamondTear.png';
    if (score >= 1000) return '/platinumTear.png';
    return '/silverTear.png';
  };

  const getTierName = (score: number) => {
    if (score >= 2000) return '챌린저';
    if (score >= 1500) return '다이아몬드';
    if (score >= 1000) return '플래티넘';
    return '실버';
  };

  console;
  const tierImageSrc = getTierImage(scoreNum);
  const tierName = getTierName(scoreNum);

  return (
    <div className="">
      <h1>마이페이지</h1>

      <div className="flex justify-between">
        <Avatar>
          <AvatarImage src={profileimg} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <Link to={`/${id}/mypageedit`}>
          <Button type="submit" variant="outline">
            프로필 수정
          </Button>
        </Link>
      </div>

      <div>
        <p>{nickName}</p>
      </div>

      <div className="flex content-center mt-10">
        <div className="w-[100%]  flex flex-col justify-center">
          <p>{scoreNum}</p>
        </div>
        <div className="w-[10%] mr-5 text-end">
          <p>{tierName}</p>
          <p className="text-xs text-neutral-300">순위</p>
        </div>
        <div className="flex flex-col content-center justify-center">
          <img src={tierImageSrc} alt="Tier Image" className="w-12 glowing-image " />
        </div>
      </div>
      <br />
      <br />
      <div className="user-list flex flex-col rgap-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <span>홍길동</span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/kwonkuwhi.png" alt="@shadcn" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <span>홍길동</span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/seejnn.png" alt="@shadcn" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <span>홍길동</span>
        </div>
        <Link to={`/mypage/friend/detail/${id}/`}>
          <Button>전체보기</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <span>{money}</span>
          <Link to="mypagewithdraw">
            <span>출금하기</span>
          </Link>
        </div>
        <div className="flex justify-between">
          <button className="text-xs text-gray-400">내역보기</button>
          <Link to="MypageCharge">
            <span>충전하기</span>
          </Link>
        </div>

        <div className="flex justify-between">
          <p>전적</p>
          <p>
            {win}승 {lose}패
          </p>
        </div>
        <div>
          <div>
            {history.map((challenge, key) => (
              <Link to={`/mypagehistorydetail/${challenge.challenge_id}`} key={key} className="text-black no-underline">
                <ListComponent3 history={challenge} scoreNum={scoreNum} challenge_name={challenge.challenge_name} />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <Link to="">
            <button>전체보기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
