// import { Input } from './ui/input';
// <Input placeholder="검색"></Input>

export default function MyPageFriendList({}: any) {
  return (
    <>
      <div className="flex justify-between">
        <h1>친구목록</h1>
        <button>친구 추가</button>
      </div>
      <div></div>

      <div className="mb-[5%] flex w-[100%] rounded-lg bg-gray-200 p-6  shadow-md">
        <div className="w-[100%]">
          <p>{}</p>
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
    </>
  );
}
