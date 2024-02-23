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
    <div
      onClick={() => navigate(`/challengeDetail/${challenge.challenge_id}`)}
      className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-lg shadow-grabit-600/10"
    >
      <div className="flex items-center justify-center">
        <h2 className="flex-1">{challenge.challenge_name}</h2>
        <div className="flex flex-none items-center gap-1 text-right text-sm text-stone-400">
          <PiTimerDuotone />
          <p>{dDay}일 후 시작</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="z-[900]">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/challengeEdit/${challenge.challenge_id}`);
            }}
            className="z-[900]"
          >
            수정
          </Button>
        </div>
        <div className="flex w-full items-center justify-end gap-2 text-right text-2xl font-extrabold text-grabit-800">
          <RiVipDiamondFill className="text-grabit-400" />
          <div className="flex items-end gap-1">
            <p>{challenge.goal_money}</p>
            <span className="mb-[3px] align-top text-sm font-bold text-grabit-400">캐럿</span>
          </div>
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
          <div className="flex flex-none items-center gap-1 text-right text-sm text-stone-400">
            <PiTimerDuotone />
            <p>{dDay}일 후 시작</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 text-right text-2xl font-extrabold text-grabit-800">
          <RiVipDiamondFill className="text-grabit-400" />
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
