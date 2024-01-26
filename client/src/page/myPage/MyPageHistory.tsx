import { Badge } from '@/components/ui/badge';

export default function ListComponent3() {
  return (
    <div>
      <div>
        <h1>히스토리</h1>
      </div>
      <div className="bg-gray-200 p-6 rounded-lg  shadow-md w-100">
        <div className="flex justify-between">
          <div className="text-black font-bold">물마시기</div>
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
    </div>
  );
}
