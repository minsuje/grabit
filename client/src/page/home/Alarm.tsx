import AlarmList from '@/components/AlarmList';
import { useState } from 'react';

interface challengeAlarm {
  title: string;
  content: string;
}
interface friendAlarm {
  title: string;
  content: string;
}

function Alarm() {
  const [challengeAlarm, setChallengeAlarm] = useState<challengeAlarm[]>([
    {
      title: '알림1',
      content: '챌린지 신청입니다',
    },
    {
      title: '알림2',
      content: '챌린지 신청입니다',
    },
  ]);
  const [friendAlarm, setFriendAlarm] = useState<friendAlarm[]>([
    {
      title: '알림1',
      content: '친구 신청입니다',
    },
    {
      title: '알림2',
      content: '친구 신청입니다',
    },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">챌린지 알림</h1>
      <div className="list flex flex-col gap-4 p-4">
        {challengeAlarm.map((list, i) => {
          return <AlarmList key={i} title={list.title} content={list.content} />;
        })}
      </div>
      <h1 className="text-2xl font-extrabold">친구 알림</h1>
      <div className="list flex flex-col gap-4 p-4">
        {friendAlarm.map((list, i) => {
          return <AlarmList key={i} title={list.title} content={list.content} />;
        })}
      </div>
    </div>
  );
}

export default Alarm;
