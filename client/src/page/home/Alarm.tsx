import AlarmList from '@/components/AlarmList';
import { useState, useEffect } from 'react';
import { privateApi } from '@/api/axios';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

interface message {
  friendName?: string;
  requestorName?: string;
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
  const [AlarmConfirm, setAlarmConfirm] = useState<challengeAlarmList[]>([]);
  const [AlarmNonConfirm, setAlarmNonConfirm] = useState<challengeAlarmList[]>([]);
  const [isAlarm, setIsAlarm] = useState<boolean>(true);
  // const [deleteButton, setDeleteButton] = useState<boolean>(false);

  // function showX() {
  //   setDeleteButton(!deleteButton);
  // }

  let content: JSX.Element;
  // let type: string;
  let link: string;
  interface check {
    content: JSX.Element;
    type: string;
    link: string;
  }

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '알림', backPath: `/main` }));
  }, [dispatch]);

  const checkType = (type: string, list: challengeAlarmList): check => {
    switch (type) {
      case 'friend':
        content = (
          <div className="text-lg text-stone-600">
            <span className="font-bold  text-grabit-600">{list.message.friendName}</span>님이 친구 신청을 보냈습니다.
          </div>
        );
        type = '친구 신청';
        link = `/friend/${list.message.requestorName}`;
        break;

      case 'challenge/create':
        content = (
          <div className="text-lg text-stone-600">
            <span className="font-bold  text-grabit-600">{list.message.inviterName}</span>님이{' '}
            <span className="font-bold  text-grabit-600">{list.message.challengeName} </span>챌린지에 초대했습니다.
          </div>
        );
        type = '챌린지';
        link = `/challengeAccept/${list.reference_id}`;
        break;
      case 'challenge/delete/noChallenger':
        content = (
          <div className="text-lg text-stone-600">
            <span className="font-bold text-grabit-600">{list.message.challengeName}</span> 챌린지를 수락한 멤버가 없어
            삭제되었습니다.
          </div>
        );
        type = '챌린지';
        link = '';
        break;
      case 'challenge/modify':
        content = (
          <div className="text-lg text-stone-600">
            <span className="font-bold  text-grabit-600">{list.message.challengeName}</span> 챌린지 정보가
            수정되었습니다.
          </div>
        );
        type = '챌린지';
        link = `/challengeDetail/${list.reference_id}`;
        break;
      case 'challenge/delete/byOwner':
        content = (
          <div className="text-lg text-stone-600 ">
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
          <div className="text-lg text-stone-600">
            <span className="font-bold  text-grabit-600">{list.message.rejectorName}</span>님이{' '}
            <span className="font-bold text-grabit-600">{list.message.challengeName} </span>챌린지 참여를 거절했습니다.
          </div>
        );
        type = '챌린지';
        link = `/challengeDetail/${list.reference_id}`;
    }
    return { content: content, type: type, link: link };
  };

  useEffect(() => {
    privateApi
      .get('/notification', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        if (response.data.length > 0) {
          const confirm = response.data.filter((alarm: challengeAlarmList) => {
            return alarm.is_confirm === true;
          });
          const nonConfirm = response.data.filter((alarm: challengeAlarmList) => {
            return alarm.is_confirm === false;
          });
          setAlarmConfirm(confirm);
          setAlarmNonConfirm(nonConfirm);
        } else {
          setIsAlarm(false);
        }
      })
      .catch((error) => {
        console.error('Alarm에서 오류발생 :', error);
      });
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold"> 알림</h1>
          <p className="text-gray-400">30일 지난 알림은 자동으로 삭제됩니다.</p>
        </div>
        {/* <Button className="bg-transparent text-lg font-extrabold text-black hover:bg-transparent" onClick={showX}>
          {deleteButton ? '완료' : '편집'}
        </Button> */}
      </div>

      <div className="list flex flex-col gap-4">
        {isAlarm ? (
          AlarmNonConfirm.map((list) => {
            const finishCheck = checkType(list.type, list);
            return (
              <div key={list.notification_id}>
                {/* reference_id */}

                <AlarmList
                  notification_id={list.notification_id}
                  type={finishCheck.type}
                  content={finishCheck.content}
                  time={list.created_at}
                  // button={deleteButton}
                  link={finishCheck.link}
                />
              </div>
            );
          })
        ) : (
          <div className=" flex min-h-80 items-center justify-center text-lg font-medium text-gray-400">
            <span>알림이 없습니다</span>
          </div>
        )}
        {isAlarm
          ? AlarmConfirm.map((list) => {
              const finishCheck = checkType(list.type, list);
              return (
                <div key={list.notification_id}>
                  {/* reference_id */}

                  <AlarmList
                    isConfirm={true}
                    notification_id={list.notification_id}
                    type={finishCheck.type}
                    content={finishCheck.content}
                    time={list.created_at}
                    // button={deleteButton}
                    link={finishCheck.link}
                  />
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default Alarm;
