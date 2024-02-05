import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { ChallengeProp } from '@/types/types';
import { differenceInCalendarDays } from 'date-fns';

function ListComponentWithButton({ challenge }: ChallengeProp) {
  const navigate = useNavigate();
  const dDay = differenceInCalendarDays(challenge.authentication_start_date, new Date());

  return (
    <div>
      <div className="mb-[5%] flex flex-col rounded-lg bg-gray-200 p-6 shadow-md">
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
    <div>
      <div className="mb-[5%] flex flex-col rounded-lg bg-gray-200 p-6 shadow-md">
        <div className="flex justify-between">
          <Link to={`/challengeDetail/${challenge.challenge_id}`} className=" text-black no-underline">
            <p>{challenge.challenge_name}</p>
          </Link>
          <p>{dDay}일 후 시작</p>
        </div>
        <p>{challenge.goal_money}원</p>
      </div>
    </div>
  );
}
export { ListComponentWithButton, ListComponentWithoutButton };
