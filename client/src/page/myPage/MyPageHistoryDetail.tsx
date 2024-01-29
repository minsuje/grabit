import { Badge } from '@/components/ui/badge';

export default function ListComponent3(props) {
  return (
    <div>
      <div>
        <h1>히스토리 상세</h1>
      </div>
      <div className="bg-gray-200 p-6 rounded-lg  shadow-md w-100">
        <div className="flex justify-between">
          <div className="text-black font-bold">{props.challenge_name}</div>
          <div className="text-gray-400 ">2024.01.02~2024.01.03</div>
        </div>
        <div className="flex">
          <div className="text-black mt-2 mr-3">15,000</div>
          <div className="text-black mt-2">
            <Badge variant="default">+1000원</Badge>
          </div>
        </div>
        <div className="flex">
          <div className="text-black mt-2 mr-3">1000P</div>
          <div className="text-black mt-2">
            <Badge variant="default">+100P</Badge>
          </div>
          <div className="flex justify-end w-[100%]">
            <div className="text-black mt-2 ">승</div>
          </div>
        </div>
      </div>
      <div>
        <h1>상대</h1>
        <p>admin</p>
      </div>
      <div>
        <h1>날짜</h1>
        <p>2024</p>
      </div>
      <div>
        <h1>챌린지명</h1>
        <p>챌린지</p>
      </div>
      <div>
        <h1>금액</h1>
        <p>금액</p>
      </div>
      <div>
        <h1>포인트 결과</h1>
        <p>포인트</p>
      </div>
    </div>
  );
}
