import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="user-list flex flex-col gap-4">
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
                <Link to="">
                    <Button>전체보기</Button>
                </Link>
            </div>

            <div className="flex flex-col gap-1 ">
                <div className="flex justify-between">
                    <span>금액</span>
                    <Link to="/mypage/MyPageWithdraw">
                        <span>출금하기</span>
                    </Link>
                </div>
                <div className="flex justify-between">
                    <button className="text-gray-400 text-xs">내역보기</button>
                    <Link to="">
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
                        <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col mb-[5%]">
                            <div className="flex justify-between">
                                <p>{ChallengeData[0].challenge_name}</p>

                                <p>{ChallengeData[0].authentication_term}일 후 종료</p>
                            </div>
                            <p>{ChallengeData[0].goal_money}</p>
                        </div>
                    </Link>
                    <div className="flex justify-center">
                        <button>전체보기</button>
                    </div>
                </div>
            </div>
        </>
    );
}
