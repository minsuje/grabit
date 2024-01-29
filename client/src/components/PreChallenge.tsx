
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChallengeProp } from '@/types/types';
import { differenceInCalendarDays } from 'date-fns';


function ListComponentWithButton({ challenge }: ChallengeProp) {
    const navigate = useNavigate();
    const dDay = differenceInCalendarDays(challenge.authentication_start_date, new Date());
  
    return (
      <div>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col mb-[5%]">
          <Link to={`/challengeDetail/${challenge.challenge_id}`} className=" text-black no-underline">
            <div className="flex justify-between">
              <p>{challenge.challenge_name}</p>
              <p>{dDay}일 후 시작</p>
            </div>
            <p>{challenge.goal_money}원</p>
          </Link>
          <div>
            <Button
              onClick={() => {
                navigate(`/challengeEdit/${challenge.challenge_id}
                      `);
              }}
            >
              수정
            </Button>
            <Button
              onClick={() => {
                axios.delete(`http://3.34.122.205:3000/challengeEdit/${challenge.challenge_id}`).then((response) => {
                  console.log('challengeEdit에서 chal', response.data);
                });
              }}
            >
              삭제
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
        <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col mb-[5%]">
          <Link to={`/challengeDetail/${challenge.challenge_id}`} className=" text-black no-underline">
            <div className="flex justify-between">
              <p>{challenge.challenge_name}</p>
              <p>{dDay}일 후 시작</p>
            </div>
            <p>{challenge.goal_money}원</p>
          </Link>
      
        </div>
      </div>
    );
  }
  export { ListComponentWithButton,ListComponentWithoutButton}