import { privateApi } from '@/api/axios';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChallengeProp } from '@/types/types';
import { differenceInCalendarDays } from 'date-fns';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Challenge } from '@/types/types';

// ~~~일 후 종료

export function ListComponent1({ challenge }: ChallengeProp) {
  // const challenge = challengeProp.challenge;

  const dDay = differenceInCalendarDays(challenge.authentication_end_date, new Date());
  return (
    <div>
      <div key={challenge.challenge_id} className="mb-[5%] flex flex-col rounded-lg bg-gray-200 p-6 shadow-md">
        <div className="flex justify-between">
          <p>{challenge.challenge_name}</p>

          <p>{dDay > 0 ? dDay + '일 후 종료' : '오늘 종료'}</p>
        </div>
        <p>{challenge.goal_money}원</p>
      </div>
    </div>
  );
}

export function ListComponent2({ challenge }: ChallengeProp) {
  return (
    <>
      <div className="justify-content flex justify-between rounded-lg bg-gray-200 p-6 shadow-md">
        <div className="">
          <div className="font-bold text-black">{challenge.challenge_name}</div>
          <div className="mt-2 text-black">{challenge.goal_money} 원</div>
        </div>
        <div className="">
          <div className="text-gray-400 ">{challenge.authentication_end_date.toString()}</div>
          <div className="mt-2 text-end">승 </div>
        </div>
      </div>
    </>
  );
}

// ////////////////////////////////////////////

// const formattedEndDate = format(new Date(history.authentication_end_date), 'yyyy-MM-dd');
// const formattedStartDate = format(new Date(history.authentication_start_date), 'yyyy-MM-dd');
export const ListComponent3 = ({ history }: { history: Challenge; scoreNum: number; challenge_name: string }) => {
  const { userid_num } = useParams<any>();
  const userIdNum = Number(userid_num); // 문자열을 숫자로 변환
  const [, setWinnerUseridNum] = useState<number[]>([]);
  useEffect(() => {
    // 챌린지 테이블 요청
    privateApi
      .get(`http://localhost:3000/history`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        setWinnerUseridNum(response.data.history[0].winner_userid_num);
      })
      .catch((error) => {
        console.error(' 히스토리 오류 axios 오류', error);
      });
  }, []);

  // history를 배열로 변환
  const historyArray = [history];

  // history 배열을 날짜 기준으로 오름차순으로 정렬
  const sortedHistory = historyArray.slice().sort((a, b) => {
    const startDateA = new Date(a.authentication_start_date).getTime();
    const startDateB = new Date(b.authentication_start_date).getTime();
    return startDateB - startDateA; // 날짜를 오름차순으로 정렬
  });
  // 정렬 후 결과 확인

  return (
    <>
      {sortedHistory.map((item, key) => (
        <div key={key} className="w-100 mb-10 rounded-lg bg-gray-200 p-6 shadow-md">
          <div className="flex justify-between">
            <div className="font-bold text-black">{item.challenge_name}</div>
            <div className="text-gray-400">
              {format(new Date(item.authentication_start_date), 'yyyy-MM-dd')}~
              {format(new Date(item.authentication_end_date), 'yyyy-MM-dd')}
            </div>
          </div>
          <div className="flex ">
            {/* <Badge variant="default">{item.goal_money}</Badge> */}
            {/* <div className="mr-3 mt-2 text-black">{item.goal_money}원</div> */}
            <div className="mt-2 text-black"></div>
          </div>
          <div className="flex">
            <div className="mt-2 text-black">
              {/* {item?.winner_userid_num?.includes(userIdNum) ? scoreNum + 100 : scoreNum - 50}P */}
            </div>
            <div className="mt-2 text-black">
              <Badge variant="default" className="ml-2">
                {item?.winner_userid_num?.includes(userIdNum) ? '+100P' : '-50P'}
              </Badge>
            </div>
            <div className="flex w-[100%] justify-end">
              <div className="mt-2 text-black ">{item?.winner_userid_num?.includes(userIdNum) ? '승' : '패배'}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

// ////////////////////////////////////////////

interface ProgressProp {
  ProgressName: string;
  total: number;
  value: number;
}

export function ProgressComponent({ ProgressName, total, value }: ProgressProp) {
  return (
    <>
      <div className="mr-3 flex justify-between">
        <p className="mt-3 font-bold">{ProgressName}</p>
        <p className="mt-3">
          {value}/{total}
        </p>
      </div>
      <Progress value={(value / total) * 100} />
    </>
  );
}

export function SelectComponent() {
  return (
    <>
      <Select>
        <div className="text-xl font-bold">주제</div>
        <div className="mt-3 flex">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="건강" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">건강</SelectItem>
            <SelectItem value="dark">취미</SelectItem>
            <SelectItem value="system">학습</SelectItem>
          </SelectContent>
          <input type="text" className="border-2 border-solid" />
        </div>
      </Select>
    </>
  );
}

export function SelectComponent2() {
  return (
    <>
      <Select>
        <div className="">
          <div className="flex items-center justify-between">
            <div className="align-center flex justify-center text-xl font-bold">기간</div>
            <div>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="3일" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">3일</SelectItem>
                <SelectItem value="dark">5일</SelectItem>
                <SelectItem value="system">7일</SelectItem>
              </SelectContent>
            </div>
          </div>
          <div className="mt-3 flex">
            <div className="mr-10">시작</div>
            <div className="text-gray-400">2024년 1월 22일</div>
          </div>
          <div className="mt-3 flex ">
            <div className="mr-10">종료</div>
            <div className=" text-gray-400">2024년 1월 25일</div>
          </div>
        </div>
      </Select>
    </>
  );
}

export function CashComponent() {
  return (
    <>
      <div className="flex justify-between">
        <div>금액</div>
        <div className="text-gray-400">5000원</div>
      </div>
    </>
  );
}
export function TimeComponent() {
  return (
    <>
      <div>인증시간</div>
      <div className="mt-3 flex justify-between">
        <span>오전7시</span>
        <span>~</span>
        <span>오전8시</span>
      </div>
    </>
  );
}

// <div className="text-black flex mt-2">15000</div>
// <div className="">승 </div>
