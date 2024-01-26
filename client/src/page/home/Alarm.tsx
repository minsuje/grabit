import AlarmList from '@/components/AlarmList';

const dummyAlarm = [
  {
    title: '알림1',
    content: '친구 신청입니다',
  },
  {
    title: '알림2',
    content: '친구 신청입니다',
  },
  {
    title: '알림3',
    content: '친구 신청입니다',
  },
];

function Alarm() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">알림</h1>
      <div className="list flex flex-col gap-4 p-4">
        {dummyAlarm.map((list, i) => {
          return <AlarmList key={i} title={list.title} content={list.content} />;
        })}
      </div>
    </div>
  );
}

export default Alarm;
