import AlarmList from '@/components/AlarmList';
import { useState, useEffect } from 'react';
import { privateApi } from '@/api/axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

interface message {
  friendName?: string;
  RequestorName?: string;
  inviterName?: string;
  challengeName?: string;
  rejectorName?: string;
}

interface challengeAlarmList {
  created_at: string;
  is_confirm: boolean;
  notification_id: number;
  reference_id: number;
  type: string;
  message: message;
}

function Alarm() {
  const dispatch = useDispatch();

  const [challengeAlarm, setChallengeAlarm] = useState<challengeAlarmList[]>([]);

  useEffect(() => {
    {
      privateApi
        .get(`http://3.34.122.205:3000/notification`)
        .then((response) => {
          console.log(response.data);
          setChallengeAlarm(response.data);
        })
        .catch((error) => {
          console.error('Alarm에서 오류발생 :', error);
        });
    }
  }, []);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '알림', backPath: '/main' }));
  }, [dispatch]);

  const setContent = (type: string): JSX.Element => {
    switch (type) {
      case 'friend':
        return <div>친구</div>;
        break;

      case 'challenge/create':
        return <div>생성</div>;
        break;
      case 'challenge/delete/noChallenger':
        return <div>삭제 신청 X</div>;
        break;
      case 'challenge/modify':
        return <div>수정</div>;
        break;
      case 'challenge/delete/byOwner':
        return <div>삭제</div>;
        break;
      default:
        // reject
        return <div>거절</div>;
    }
  };
  let content: JSX.Element;
  let type: string;
  let link: string;

  return (
    <div>
      <h1 className="text-2xl font-extrabold"> 알림</h1>
      <div className="list flex flex-col gap-4 p-4">
        {challengeAlarm.map((list) => {
          switch (list.type) {
            case 'friend':
              content = (
                <div className="text-xl">
                  <span className="font-bold  text-grabit-600">{list.message.friendName}</span>님이 친구 신청을
                  보냈습니다.
                </div>
              );
              type = '친구 신청';
              break;

            case 'challenge/create':
              content = (
                <div className="text-xl">
                  <span className="font-bold  text-grabit-600">{list.message.inviterName}</span>님이{' '}
                  <span className="font-bold  text-grabit-600">{list.message.challengeName} </span>챌린지에
                  초대했습니다.
                </div>
              );
              type = '챌린지';
              break;
            case 'challenge/delete/noChallenger':
              content = (
                <div className="text-xl">
                  <span className="font-bold text-grabit-600">{list.message.challengeName}</span> 챌린지를 수락한 멤버가
                  없어 삭제되었습니다.
                </div>
              );
              type = '챌린지';
              break;
            case 'challenge/modify':
              content = (
                <div className="text-xl">
                  <span className="font-bold  text-grabit-600">{list.message.challengeName}</span> 챌린지 정보가
                  수정되었습니다.
                </div>
              );
              type = '챌린지';
              break;
            case 'challenge/delete/byOwner':
              content = (
                <div className="text-xl">
                  <span className="font-bold  text-grabit-600">{list.message.challengeName}</span>챌린지가 방장에 의해
                  삭제되었습니다.
                </div>
              );
              type = '챌린지';
              break;
            default:
              // reject
              content = (
                <div className="text-xl">
                  <span className="font-bold  text-grabit-600">{list.message.rejectorName}</span>님이{' '}
                  <span className="font-bold text-grabit-600">{list.message.challengeName} </span>챌린지 참여를
                  거절했습니다.
                </div>
              );
          }
          return (
            <Link className="text-black no-underline" to={`/challengeAccept/1`}>
              {/* reference_id */}
              <AlarmList type={type} content={content} time={list.created_at} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Alarm;
