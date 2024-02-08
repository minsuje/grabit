import { Badge } from '@/components/ui/badge';

export default function ListComponent3() {
  return (
    <div>
      <div>
        <h1>히스토리 상세</h1>
      </div>
      <div className="w-100 rounded-lg bg-gray-200  p-6 shadow-md">
        <div className="flex justify-between">
          <div className="font-bold text-black">물마시기</div>
          <div className="text-gray-400 ">2024.01.02~2024.01.03</div>
        </div>
        <div className="flex">
          <div className="mr-3 mt-2 text-black">15,000</div>
          <div className="mt-2 text-black">
            <Badge variant="default">+1000원</Badge>
          </div>
        </div>
        <div className="flex">
          <div className="mr-3 mt-2 text-black">1000P</div>
          <div className="mt-2 text-black">
            <Badge variant="default">+100P</Badge>
          </div>
          <div className="flex w-[100%] justify-end">
            <div className="mt-2 text-black ">승</div>
          </div>
        </div>
      </div>
    </div>
  );
}
