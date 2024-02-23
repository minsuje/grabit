import { privateApi } from '@/api/axios';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

export default function ListComponent3() {
  const dispatch = useDispatch();
  // const [winnerUseridNum, setWinnerUseridNum] = useState<[]>([]);
  const { userid_num } = useParams<any>();
  const userIdNum = Number(localStorage.getItem('userid_num')); // 문자열을 숫자로 변환
  const [challengeDetail, setChallengeDetail] = useState<ChallengeDetail>();
  const [record, setRecord] = useState<ChallengeDetail>();
  const [opponent, setOpponent] = useState<Array<{ nickname: string }>>([]);

  interface ChallengeDetail {
    challenge_name: string;
    goal_money: string;
    winner_userid_num: string;
    userIdNum: string;
    authentication_start_date: string;
    authentication_end_date: string;
    win: string;
    lose: string;
    nickname: string;
  }

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '히스토리', backPath: `/mypage` }));
  }, [dispatch]);

  useEffect(() => {
    // 챌린지 테이블 요청
    privateApi
      .get(`/history`)
      .then((response) => {
        const detail = response.data.history.find((item: any) => item.challenge_id.toString() === userid_num);
        setChallengeDetail(detail);
        setRecord(response.data);

        // 모든 상대방 정보 추출
        const allOpponents = detail.challenger_userid_num
          .filter((challenger: any) => challenger.userid_num !== userIdNum)
          .map((challenger: any) => ({ nickname: challenger.nickname }));
        setOpponent(allOpponents);
      })
      .catch((error) => {
        console.error(' 히스토리 오류 axios 오류', error);
      });
  }, [userid_num]);

  const formattedStartDate = challengeDetail?.authentication_start_date
    ? format(new Date(challengeDetail.authentication_start_date), 'yyyy-MM-dd')
    : '';
  const formattedEndDate = challengeDetail?.authentication_end_date
    ? format(new Date(challengeDetail.authentication_end_date), 'yyyy-MM-dd')
    : '';

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1>히스토리 상세</h1>
      </div>
      <div className="w-100 bg-gray-white rounded-lg p-6 shadow-xl shadow-grabit-600/10">
        <div className="flex flex-col justify-between">
          <div className="font-bold text-black">{challengeDetail?.challenge_name}</div>
          <div className="text-gray-400 ">
            {formattedStartDate}~{formattedEndDate}
            {/* {format(new Date(authentication_start_date), 'yyyy-MM-dd')}~ */}
            {/* {format(new Date(item.authentication_end_date), 'yyyy-MM-dd')} */}
          </div>
        </div>
        <div className="flex">
          <div className="mt-2 text-black">{}</div>
          <div className="mt-2 text-black">
            <Badge variant="default">{challengeDetail?.winner_userid_num ? '+100P' : '-50P'}</Badge>
          </div>
          <div className="flex w-[100%] justify-end">
            <div className="mt-2 text-black ">{challengeDetail?.winner_userid_num ? '승' : '패배'}</div>
          </div>
        </div>
      </div>
      <div>
        <h2>상대닉네임</h2>
        {/* 모든 상대방의 닉네임을 출력 */}
        {opponent.map((opponent, index) => (
          <p key={index}>{opponent.nickname}</p>
        ))}
      </div>
      {/* <div>
        <h1>날짜</h1>
        <p>2024</p>
      </div> */}
      {/* <div>
        <h1>챌린지명</h1>
        <p>챌린지</p>
      </div> */}
      <div>
        <h2>금액</h2>
        <p>{challengeDetail?.goal_money} 캐럿</p>
      </div>
      {/* <div>
        <h2>포인트 결과</h2>
        <p> {challengeDetail?.winner_userid_num?.includes(userIdNum.toString()) ? '+100P' : '-50P'}</p>
      </div> */}
      <div>
        <h2>전적</h2>
        <span>
          {record?.win}승 {record?.lose}패
        </span>
      </div>
    </div>
  );
}
