import AlarmList from '@/components/AlarmList';
import { useState, useEffect } from 'react';
import { privateApi } from '@/api/axios';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

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
  const [isAlarm, setIsAlarm] = useState<boolean>(true);
  const [deleteButton, setDeleteButton] = useState<boolean>(false);

  function showX() {
    setDeleteButton(!deleteButton);
  }

  useEffect(() => {
    {
      privateApi
        .get(`http://3.34.122.205:3000/notification`)
        .then((response) => {
          console.log(response.data);
          setChallengeAlarm(response.data);
          if (response.data.msg) {
            setIsAlarm(false);
          }
        })
        .catch((error) => {
          console.error('Alarm에서 오류발생 :', error);
        });
    }
  }, []);


  let content: JSX.Element;
  let type: string;
  let link: string;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-extrabold"> 알림</h1>
        <Button className="bg-transparent text-lg font-extrabold text-black hover:bg-transparent" onClick={showX}>
          {deleteButton ? '완료' : '편집'}
        </Button>
      </div>

      <div className="list flex flex-col gap-4 p-4">

        {isAlarm ? (
          challengeAlarm.map((list) => {
            switch (list.type) {
              case 'friend':
                content = (
                  <div className="text-xl">
                    <span className="font-bold  text-grabit-600">{list.message.friendName}</span>님이 친구 신청을
                    보냈습니다.
                  </div>
                );
                type = '친구 신청';
                link = '/friend';
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
                link = '/challengeAccept';
                break;
              case 'challenge/delete/noChallenger':
                content = (
                  <div className="text-xl">
                    <span className="font-bold text-grabit-600">{list.message.challengeName}</span> 챌린지를 수락한
                    멤버가 없어 삭제되었습니다.
                  </div>
                );
                type = '챌린지';
                link = '';
                break;
              case 'challenge/modify':
                content = (
                  <div className="text-xl">
                    <span className="font-bold  text-grabit-600">{list.message.challengeName}</span> 챌린지 정보가
                    수정되었습니다.
                  </div>
                );
                type = '챌린지';
                link = '/challengeDetail';
                break;
              case 'challenge/delete/byOwner':
                content = (
                  <div className="text-xl">
                    <span className="font-bold  text-grabit-600">{list.message.challengeName}</span>챌린지가 방장에 의해
                    삭제되었습니다.
                  </div>
                );
                type = '챌린지';
                link = '';
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
                type = '챌린지';
                link = '/challengeDetail';
            }
            return (
              <>
                {/* reference_id */}
                <AlarmList
                  notification_id={list.notification_id}
                  reference_id={list.reference_id}
                  type={type}
                  content={content}
                  time={list.created_at}
                  button={deleteButton}
                  link={link}
                />
              </>
            );
          })
        ) : (
          <div className=" flex  items-center justify-center text-xl text-gray-500">알림이 없습니다.</div>
        )}

       
      </div>
    </div>
  );
}

export default Alarm;
