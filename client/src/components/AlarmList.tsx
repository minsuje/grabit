import { differenceInCalendarDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
// import { Cross1Icon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { privateApi } from '@/api/axios';

interface AlarmProps {
  isConfirm?: boolean;
  type: string;
  content: JSX.Element;
  time: string;
  button?: boolean;
  link: string;
  notification_id: number;
}

function AlarmList({ isConfirm, notification_id, link, type, content, time }: AlarmProps) {
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
      .patch(`/notification/${notification_id}`)
      .then(() => {})
      .catch((error) => {
        console.error('알림 삭제 중에 오류발생 :', error);
      });
  }

  return (
    <Link
      to={link}
      className={
        isConfirm
          ? 'flex flex-col gap-3 rounded-2xl bg-white p-6 opacity-40 shadow-lg shadow-grabit-600/10'
          : 'flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-lg shadow-grabit-600/10 '
      }
    >
      <div className="flex justify-between">
        <p className="rounded-full bg-grabit-100 px-3 py-2 text-center text-sm font-extrabold text-grabit-700">
          {type}
        </p>

        {/* {button ? (
            <Cross1Icon
              className="text-grabit-6ㄴ00 h-4 w-4 hover:cursor-pointer"
              onClick={() => {
                deleteNoti(notification_id);
              }}
            />
          ) : null} */}
      </div>

      {link ? (
        <div
          onClick={() => {
            if (isConfirm) {
              return;
            } else {
              deleteNoti(notification_id);
            }
          }}
        >
          {content}
        </div>
      ) : (
        <div
          className="hover:cursor-pointer"
          onClick={() => {
            if (isConfirm) {
              return;
            } else {
              deleteNoti(notification_id);
            }
          }}
        >
          {content}
        </div>
      )}

      <p className="text-grabit-400">{createTime}</p>
    </Link>
  );
}

export default AlarmList;
