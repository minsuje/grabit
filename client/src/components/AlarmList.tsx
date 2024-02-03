import { differenceInCalendarDays, differenceInHours, format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface AlarmProps {
  type: string;
  content: JSX.Element;
  time: string;
}

function AlarmList({ type, content, time }: AlarmProps) {
  let createTime: string;
  if (differenceInCalendarDays(time, new Date()) === 0) {
    console.log('오늘');
    createTime = new Date(time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' } as any);
  } else if (differenceInCalendarDays(time, new Date()) === -1) {
    console.log('어제');
    createTime = '어제';
  } else {
    console.log('날짜');
    createTime = format(time, 'yyyy년 M월 d일 aa KK시 mm분', { locale: ko });
  }
  return (
    <div>
      <div className="shadow-grabit-600/10  mb-[5%] flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-lg">
        <p className="bg-grabit-600 w-[4.5rem] rounded-xl px-2 py-[1.5px] text-center text-sm text-white">{type}</p>
        {content}
        <p className="text-grabit-400">{createTime}</p>
      </div>
    </div>
  );
}

export default AlarmList;
