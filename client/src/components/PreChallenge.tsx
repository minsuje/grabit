import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { ChallengeProp } from '@/types/types';
import { differenceInCalendarDays } from 'date-fns';
import { PiTimerDuotone } from 'react-icons/pi';
import { RiVipDiamondFill } from 'react-icons/ri';

function ListComponentWithButton({ challenge }: ChallengeProp) {
  const navigate = useNavigate();
  const dDay = differenceInCalendarDays(challenge.authentication_start_date, new Date());

  return (
    <div>
      <div className="flex flex-col rounded-lg bg-gray-200 p-6 shadow-md">
        <div className="flex justify-between">
          <Link to={`/challengeDetail/${challenge.challenge_id}`} className=" text-black no-underline">
            <p>{challenge.challenge_name}</p>
          </Link>
          <p>{dDay}일 후 시작</p>
        </div>
        <p>{challenge.goal_money}원</p>

        <div>
          <Button
            onClick={() => {
              navigate(`/challengeEdit/${challenge.challenge_id}
                      `);
            }}
          >
            수정
          </Button>
        </div>
      </div>
    </div>
  );
}

function ListComponentWithoutButton({ challenge }: ChallengeProp) {
  const dDay = differenceInCalendarDays(challenge.authentication_start_date, new Date());

  return (
    <Link to={`/challengeDetail/${challenge.challenge_id}`} className=" text-black no-underline">
      <div
        key={challenge.challenge_id}
        className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-lg shadow-grabit-600/10"
      >
        <div className="flex items-center justify-center">
          <h2 className="flex-1">{challenge.challenge_name}</h2>
          <p className="flex flex-none items-center gap-1 text-right text-sm text-stone-400">
            <PiTimerDuotone />
            <p>{dDay}일 후 시작</p>
          </p>
        </div>
        <div className="flex w-full items-center justify-end gap-2 text-right text-2xl font-extrabold text-grabit-800">
          <RiVipDiamondFill />
          <div className="flex items-end gap-1">
            <p>{challenge.goal_money}</p>
            <span className="mb-[3px] align-top text-sm font-bold text-grabit-400">캐럿</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
export { ListComponentWithButton, ListComponentWithoutButton };
