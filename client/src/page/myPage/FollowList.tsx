import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
export function FollowList() {
    return (
        <>
            <div className="flex justify-between">
                <h1>친구목록</h1>
                <button>친구 추가</button>
            </div>
            <div>
                <Input placeholder="검색"></Input>
            </div>
            <Link to=" " className="text-black no-underline">
                <div className="bg-gray-200 p-6 rounded-lg shadow-md flex  mb-[5%] justify-between">
                    <div className="">
                        <p>아이디</p>
                        <p>티어점수</p>
                    </div>
                    <div className="flex flex-col justify-end">
                        <span>d</span>
                        <span>d</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p>이미지</p>
                    </div>
                </div>
            </Link>
        </>
    );
}
