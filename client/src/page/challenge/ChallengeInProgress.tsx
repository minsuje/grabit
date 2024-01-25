import { Tab } from '@/components/Component0117';
import { ListComponent1, ProgressComponent } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import axios from 'axios';
import { Challenge, users } from '@/types/types';

function ChallengeInProgress() {
  const navigate = useNavigate();
  const { challenge_id } = useParams();
  const [challengeDetail, setChallengeDetail] = useState<Challenge>({
    challenge_id: 1,
    userid_num: 1,
    challenge_name: '임시 데이터',
    topic: '',
    challenger_userid_num: [1, 2],
    goal_money: 1000,
    is_public: true,
    term: 3,
    winner_userid_num: null,
    authentication_start_date: new Date('2024-01-24'),
    authentication_end_date: new Date('2024-01-26'),
    authentication_start_time: 4,
    authentication_end_time: 5,
  });
  const [challengers, setChallengers] = useState<users[]>([
    {
      userid_num: 1,
      login_type: 'normal',
      userid: 'userid',
      social_userid: 'userid',
      password: 'password',
      name: 'name',
      nickname: 'nickname',
      profile_img: null,
      score_num: 30,
      money: 1000,
    },
  ]);
  useEffect(() => {
    axios
      .get(`http://localhost:3000/challengeDetail/${challenge_id}`)
      .then((response): void => {
        console.log('response', response.data.urls);
        console.log('this Challenge ', response.data.challengeDetail[0]);
        setChallengeDetail(response.data.challengeDetail[0]);
        setChallengers(response.data.challengers);
      })
      .catch((error): void => {
        console.error('ChallengeDetail에서 axios 오류:', error);
      });
  }, []);
  const myImage = (
    <div className="grid grid-cols-2">
      <Link to="/challengeImage/1">
        <div>
          <img
            className="m-auto mt-3 h-[180px] w-[65%] rounded-lg"
            src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"
          ></img>
        </div>
      </Link>

      <Link to="/challengeImage/1">
        <div>
          <img
            className="m-auto mt-3 h-[180px] w-[65%] rounded-lg"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUYPdBcfX3qZIo067ZVvB21yz8l4iWExVJGg&usqp=CAU"
          ></img>
        </div>
      </Link>
      <Link to="/challengeImage/1">
        <div>
          <img
            className="m-auto mt-3 h-[180px] w-[65%] rounded-lg"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUYPdBcfX3qZIo067ZVvB21yz8l4iWExVJGg&usqp=CAU"
          ></img>
        </div>
      </Link>
      <Link to="/challengeImage/1">
        <div>
          <img
            className="m-auto mt-3  h-[180px] w-[65%] rounded-lg"
            src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"
          ></img>
        </div>
      </Link>
    </div>
  );
  const otherImage = (
    <div className="grid grid-cols-2">
      <Link to="/challengeImage/2">
        <div>
          <img
            className="m-auto mt-3 h-[180px] w-[65%] rounded-lg"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUYPdBcfX3qZIo067ZVvB21yz8l4iWExVJGg&usqp=CAU"
          ></img>
        </div>
      </Link>

      <Link to="/challengeImage/2">
        <div>
          <img
            className="m-auto mt-3 h-[180px] w-[65%] rounded-lg"
            src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"
          ></img>
        </div>
      </Link>
      <Link to="/challengeImage/2">
        <div>
          <img
            className="m-auto mt-3 h-[180px] w-[65%] rounded-lg"
            src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"
          ></img>
        </div>
      </Link>
      <Link to="/challengeImage/2">
        <div>
          <img
            className="m-auto mt-3 h-[180px] w-[65%] rounded-lg"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUYPdBcfX3qZIo067ZVvB21yz8l4iWExVJGg&usqp=CAU"
          ></img>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="container">
      <div className="p-3 text-center text-4xl font-extrabold">
        총 {challengeDetail.goal_money * challengers.length}원
      </div>

      <div className="m-10 grid grid-cols-2 gap-4 p-1 text-center">
        <div className="text-xl font-black">나</div>
        <div className="text-xl font-black">{challengers.length > 1 ? challengers[1]?.nickname : ' ...'}</div>
        <div className=" text-l">3회 성공</div>
        <div className="text-l">5회 성공</div>
      </div>

      {/*로그인 한 유저(나)가 누구인지 확인하는 코드 추가 */}

      <ProgressComponent ProgressName={'진행률'} total={10} value={0} />

      <ProgressComponent ProgressName={'기간'} total={10} value={5} />
      <br />
      <ListComponent1 challenge={challengeDetail} />

      <Tab tab1="나" tab2="상대" tab1content={myImage} tab2content={otherImage} />

      <div className="mt-5 p-2 text-center">
        <Button
          onClick={() => {
            navigate(`/camera/${challenge_id}`);
          }}
        >
          인증하기
        </Button>
      </div>
    </div>
  );
}
export default ChallengeInProgress;
