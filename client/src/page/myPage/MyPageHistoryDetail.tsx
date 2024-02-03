import { privateApi } from '@/api/axios';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ListComponent3() {
  const [winnerUseridNum, setWinnerUseridNum] = useState<[]>([]);
  const { userid_num } = useParams<any>();
  const userIdNum = Number(localStorage.getItem('userid_num')); // 문자열을 숫자로 변환

  useEffect(() => {
    // 챌린지 테이블 요청
    privateApi
      .get(`http://localhost:3000/history`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(' 히스토리 오류 axios 오류', error);
      });
  }, []);

  console.log('userIdNum', userIdNum);
  console.log('userid_num', userid_num);

  return (
    <div>
      <div>
        <h1>히스토리 상세</h1>
      </div>
      <div className="w-100 rounded-lg bg-gray-200  p-6 shadow-md">
        <div className="flex justify-between">
          <div className="font-bold text-black">{userid_num}</div>
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
            <div className="mt-2 text-black ">{winnerUseridNum ? '승' : '패'}</div>
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
