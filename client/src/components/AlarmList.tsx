import { differenceInCalendarDays, differenceInHours, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { privateApi } from '@/api/axios';

interface AlarmProps {
  reference_id: number;
  type: string;
  content: JSX.Element;
  time: string;
  button: boolean;
  link: string;
  notification_id: number;
}

function AlarmList({ notification_id, link, reference_id, type, content, time, button }: AlarmProps) {
  let createTime: string;
  if (differenceInCalendarDays(time, new Date()) === 0) {
    createTime = new Date(time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' } as any);
  } else if (differenceInCalendarDays(time, new Date()) === -1) {
    createTime = '어제';
  } else {
    createTime = format(time, 'yyyy년 M월 d일 aa KK시 mm분', { locale: ko });
  }

  function deleteNoti(notification_id: number): void {
    privateApi
      .patch(`http://3.34.122.205:3000/notification/${notification_id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('알림 삭제 >>>>>>>>>', response.data);
      })
      .catch((error) => {
        console.error('알림 삭제 중에 오류발생 :', error);
      });
  }
  return (
    <div key={notification_id}>
      <div className="mb-[5%]  flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-lg shadow-grabit-600/10">
        <div className="flex justify-between">
          <p className="w-[4.5rem] rounded-xl bg-grabit-600 px-2 py-[1.5px] text-center text-sm text-white">{type}</p>

          {button ? (
            <Cross1Icon
              className="text-grabit-6ㄴ00 h-4 w-4 hover:cursor-pointer"
              onClick={() => {
                deleteNoti(reference_id);
              }}
            />
          ) : null}
        </div>

        {link ? (
          <Link to={`${link}/${reference_id}`} className="text-black no-underline">
            {content}
          </Link>
        ) : (
          content
        )}

        {/*  */}
        <p className="text-grabit-400">{createTime}</p>
      </div>
    </div>
  );
}

export default AlarmList;
