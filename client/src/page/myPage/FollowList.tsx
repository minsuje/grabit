import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
export default function FollowList() {
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
        <div className="bg-gray-200 p-6 rounded-lg shadow-md w-[100%] flex  mb-[5%]">
          <div className="w-[100%]">
            <p>아이디</p>
            <p>티어점수</p>
          </div>
          <div className="w-[10%]">
            <p>티어</p>
            <p>점수</p>
          </div>
          <div className="w-[20%]flex justify-end">
            <span>이미지</span>
          </div>
        </div>
      </Link>
    </>
  );
}
