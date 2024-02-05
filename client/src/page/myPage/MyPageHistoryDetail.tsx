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
        console.log(response);
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

  console.log(opponent);
  return (
    <div>
      <div>
        <h1>히스토리 상세</h1>
      </div>
      <div className="w-100 rounded-lg bg-gray-200  p-6 shadow-md">
        <div className="flex justify-between">
          <div className="font-bold text-black">{challengeDetail?.challenge_name}</div>
          <div className="text-gray-400 ">
            {formattedStartDate}~{formattedEndDate}
            {/* {format(new Date(authentication_start_date), 'yyyy-MM-dd')}~ */}
            {/* {format(new Date(item.authentication_end_date), 'yyyy-MM-dd')} */}
          </div>
        </div>
        <div className="flex">
          <div className="mr-3 mt-2 text-black">{}원</div>
          <div className="mt-2 text-black">
            <Badge variant="default">
              {challengeDetail?.winner_userid_num?.includes(userIdNum.toString()) ? '+100P' : '-50P'}
            </Badge>
          </div>
          <div className="flex w-[100%] justify-end">
            <div className="mt-2 text-black ">{challengeDetail?.winner_userid_num ? '승' : '패배'}</div>
          </div>
        </div>
      </div>
      <div>
        <h1>상대닉네임</h1>
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
        <h1>금액</h1>
        <p>{challengeDetail?.goal_money} 캐럿</p>
      </div>
      <div>
        <h1>포인트 결과</h1>
        <p> {challengeDetail?.winner_userid_num?.includes(userIdNum.toString()) ? '+100P' : '-50P'}</p>
      </div>
      <div>
        <h1>전적</h1>
        <span>
          {record?.win}승 {record?.lose}패
        </span>
      </div>
    </div>
  );
}
