import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link, Outlet, useParams } from 'react-router-dom';
import MyPageData from '@/data/myPageData';
import ChallengeData from '@/data/ChallengeData';
import axios from 'axios';
import { useEffect, useState } from 'react';
import tearImg from '../../../public/challengerTear.png';
import '../../../../client/src/App.css'; // 스타일 시트 임포트

export default function MyPage() {
  const [nickName, setNickName] = useState<string>('');
  const [scoreNum, setScorNum] = useState<string>('');
  const [money, setMoney] = useState<string>('');

  const { id } = useParams();
  console.log('userid>>>>>>>>>', id);

  useEffect(() => {
    axios
      .get(`http://3.34.122.205:3000/friend/${id}`)
      .then((response) => {
        console.log('>>>>>>', response.data);
      })
      .catch((error) => {
        console.error('친구 목록 불러오기 axios 오류', error);
      });
  }, []);

  useEffect(() => {
    const tierImages = {
      silver: '/silverTear.png',
      platinum: '/platinumTear.png',
      diamond: '/diamondTear.png',
      challenger: '/challengerTear.png',
    };

    axios
      .get(`http://3.34.122.205:3000/mypage/${id}`) // userid를 사용하여 서버 요청
      .then((response) => {
        console.log('res>>>>>>', response.data.userInfo[0]);
        setNickName(response.data.userInfo[0].nickname);
        setScorNum(response.data.userInfo[0].score_num);
        setMoney(response.data.userInfo[0].money);
      })
      .catch((error) => {
        console.error('사용자 정보 불러오기 오류', error);
      });
  }, [id]); // id가 변경될 때마다 요청

  console.log(nickName);

  const getTierImage = (score) => {
    if (score >= 2000) return '/challengerTear.png';
    if (score >= 1500) return '/diamondTear.png';
    if (score >= 1000) return '/platinumTear.png';
    return '/silverTear.png';
  };

  const getTierName = (score) => {
    if (score >= 2000) return '챌린저';
    if (score >= 1500) return '다이아몬드';
    if (score >= 1000) return '플래티넘';
    return '실버';
  };

  const tierImageSrc = getTierImage(parseInt(scoreNum));
  const tierName = getTierName(parseInt(scoreNum));
  return (
    <div className="p-10">
      <h1>마이페이지</h1>

      <div className="flex justify-between">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
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

      <div className=" flex content-center mt-10">
        <div className="w-[100%]  flex flex-col justify-center ">
          <p>{scoreNum}</p>
        </div>
        <div className="w-[10%] mr-5 text-end">
          <p>{tierName}</p>
          <p className="text-xs text-neutral-300">순위</p>
        </div>
        <div className=" flex flex-col content-center justify-center">
          {/* 티어에 따른 이미지 렌더링 */}
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
        <Link to="/friend/:id">
          <Button>전체보기</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-1 ">
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

        <div className="flex justify-between ">
          <p>전적</p>
          <p>
            {MyPageData[0].win}승 {MyPageData[0].lose}패 {MyPageData[0].draw}무
          </p>
        </div>
        <div>
          <h1>히스토리</h1>
          <Link to=" " className="text-black no-underline">
            <div className="mb-[5%] flex flex-col rounded-lg bg-gray-200 p-6 shadow-md">
              <div className="flex justify-between">
                <p>{ChallengeData[0].challenge_name}</p>

                <p>{ChallengeData[0].authentication_term}일 후 종료</p>
              </div>
              <p>{ChallengeData[0].goal_money}</p>
            </div>
          </Link>
          <div className="flex justify-center">
            <Link to="mypagehistorydetail">
              <button>전체보기</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
