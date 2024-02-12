import { privateApi } from '@/api/axios';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export default function ListComponent3() {
  const userid_num = localStorage.getItem('userid_num');
  const userIdNum = Number(localStorage.getItem('userid_num'));

  // const [win, setWin] = useState<string>('');
  // const [lose, setLose] = useState<string>('');
  const [history, setHistory] = useState<ChallengeHistory[]>([]);
  const [challengeDetail, setChallengeDetail] = useState<ChallengeDetail>();

  interface ChallengeDetail {
    challenge_name: string;
    goal_money: string;
    winner_userid_num: number[];
    userIdNum: string;
    authentication_start_date: string;
    authentication_end_date: string;
    win: string;
    lose: string;
    nickname: string;
  }

  interface ChallengeHistory {
    challenge_id?: number;
    userid_num?: number;
    challenge_name: string;
    topic: string;
    challenger_userid_num: [];
    goal_money: number;
    is_public: boolean;
    term: number;
    auth_keyword: any;
    authentication_start_date: Date;
    authentication_end_date: Date;
    authentication_start_time: number;
    authentication_end_time: number;
    winner_userid_num: number[];
  }

  interface HistoryData {
    win: string;
    lose: string;
    history: ChallengeHistory[];
  }

  // const challengeDetail2 = {
  //   // 다른 필드들...
  //   winner_userid_num: [10, 20, 30], // 배열로 선언
  // };

  // const userIdNum2 = 10; // 현재 사용자 ID

  // 배열에서 현재 사용자 ID가 있는지 확인
  // const isWinner = challengeDetail.winner_userid_num.includes(userIdNum);
  // console.log(isWinner ? '승' : '패배'); // '승'
  // console.log(typeof userIdNum);

  useEffect(() => {
    // 챌린지 테이블정보 요청
    privateApi
      .get(`/history`, { headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') } })
      .then((response) => {
        const historyData: HistoryData = response.data;

        const detail = response.data.history.find((item: any) => item.winner_userid_num.toString() === userid_num);
        setChallengeDetail(detail);

        // setWin(historyData.win);
        // setLose(historyData.lose);
        console.log(response);

        // 데이터 로딩 후 정렬 로직 적용
        const sortedHistory = historyData.history.sort((a, b) => {
          const dateA = new Date(a.authentication_start_date).getTime();
          const dateB = new Date(b.authentication_start_date).getTime();
          return dateB - dateA; // 내림차순 정렬
        });

        setHistory(sortedHistory);
      })
      .catch((error) => {
        console.error(' 히스토리 오류 axios 오류', error);
      });
  }, [userid_num]);

  console.log('challengeDetail', challengeDetail);

  console.log(typeof userIdNum);
  return (
    <div>
      <h1>히스토리 상세</h1>
      {history.map((item, index) => (
        <div key={index} className="mb-4 w-full rounded-lg bg-gray-200 p-6 shadow-md">
          <div className="flex justify-between">
            <div className="font-bold text-black">{item.challenge_name}</div>
            <div className="text-gray-400">
              {new Date(item.authentication_start_date).toLocaleDateString()} ~{' '}
              {new Date(item.authentication_end_date).toLocaleDateString()}
            </div>
          </div>
          <div className="flex">
            <div className="mr-3 mt-2 text-black">{item.goal_money.toLocaleString()}캐럿</div>
          </div>
          <Badge variant="default">
            <div className="mt-2 text-white ">{item.winner_userid_num?.includes(userIdNum) ? '+100' : '-50'}</div>
          </Badge>
          <div className="flex justify-end">
            <Badge variant="default">
              <div className="mt-2 text-white ">{item.winner_userid_num?.includes(userIdNum) ? '승' : '패'}</div>
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
