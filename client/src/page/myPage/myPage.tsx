import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function MyPage() {
    return (
        <>
            <h1>마이페이지</h1>

            <div className="flex justify-between">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
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
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>홍길동</span>
                </div>
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/kwonkuwhi.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>홍길동</span>
                </div>
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/seejnn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>홍길동</span>
                </div>
                <Button>전체보기</Button>
            </div>

            <div className="flex flex-col gap-1 ">
                <div className="flex justify-between">
                    <span>금액</span>
                    <span>출금하기</span>
                </div>
                <div className="flex justify-between">
                    <button className="text-gray-400 text-xs">내역보기</button>
                    <span>충전하기</span>
                </div>

                <div className="flex justify-between ">
                    <p>전적</p>
                    <p>승 패 무</p>
                </div>
                <div>
                    <h1>히스토리</h1>
                    <Link to=" " className="text-black no-underline">
                        <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col mb-[5%]">
                            <div className="flex justify-between">
                                <p>챌린지 이름</p>

                                <p>일 후 종료</p>
                            </div>
                            <p>3000원</p>
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
