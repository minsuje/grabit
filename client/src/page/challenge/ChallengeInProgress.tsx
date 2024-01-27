import { Tab } from '@/components/Component0117';
import { ListComponent1, ProgressComponent } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import axios from 'axios';
import { Challenge, users } from '@/types/types';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { differenceInDays } from 'date-fns';



function ChallengeInProgress() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { challenge_id } = useParams();
  

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '진행중인 챌린지', backPath: -1 }));
  }, [dispatch]);

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
  const [urls,setUrls]=useState<string[]>([])


  const period = differenceInDays(challengeDetail.authentication_end_date, challengeDetail.authentication_start_date);

  let totalAuthCount = 3;
  if(period!==3){
    totalAuthCount =((period+1)/7)*challengeDetail.term
  }


  useEffect(() => {
    console.log('challenge_id', challenge_id)
    axios
      .get(`http://3.34.122.205:3000/challengeDetail/${challenge_id}`)
      .then((response): void => {
        console.log('response', response.data);
        console.log('this Challenge ', response.data.challengeDetail[0]);
        setChallengeDetail(response.data.challengeDetail[0]);
        setChallengers(response.data.challengers);
        setUrls(response.data.urls)
      })
      .catch((error): void => {
        console.error('Challengeinprogress에서 axios 오류:', error);
      });
  }, []);
  const myImage = (
    <div className="grid grid-cols-2 gap-2">
      {urls.map((url,index)=>{
        return(
          <Link to="/challengeImage/1">
        <div key={index}>
          <img
            className="aspect-square w-full rounded-lg object-cover"
            src={url}
          ></img>
        </div>
      </Link>
        )
      })}
    </div>
  );
  const otherImage = (
    <div className="grid grid-cols-2 gap-2">
      {urls.map((url,index)=>{
        return(
          <Link to="/challengeImage/1">
        <div key={index}>
          <img
            className="aspect-square w-full rounded-lg object-cover"
            src={url}
          ></img>
        </div>
      </Link>
        )
      })}
    </div>
  );
  return (
    <div className="mt-12 flex flex-col gap-4">
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

      <ProgressComponent ProgressName={'진행률'} total={ totalAuthCount} value={0} />

      <ProgressComponent ProgressName={'기간'} total={period+1} value={differenceInDays(new Date(), challengeDetail.authentication_start_date)} />
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
