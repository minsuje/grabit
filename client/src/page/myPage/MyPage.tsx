import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link, Outlet } from 'react-router-dom';
import MyPageData from '@/data/myPageData';
import ChallengeData from '@/data/ChallengeData';
import axios from 'axios';

export default function MyPage() {
  console.log(ChallengeData);

  return (
    <>
      <h1>마이페이지</h1>

      <div className="flex justify-between">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <Link to="mypageedit">
          <Button type="submit" variant="outline">
            프로필 수정
          </Button>
        </Link>
      </div>

      <Outlet></Outlet>
      <br />
      <br />
      <br />
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
        <Link to="followlist">
          <Button>전체보기</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-1 ">
        <div className="flex justify-between">
          <span>금액</span>
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
    </>
  );
}
