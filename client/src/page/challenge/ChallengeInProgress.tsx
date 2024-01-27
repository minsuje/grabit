import { Tab } from '@/components/Component0117';
import { ListComponent1, ProgressComponent } from '@/components/ComponentSeong';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Challenge, users } from '@/types/types';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { differenceInDays } from 'date-fns';
import Cta from '@/components/Cta';


interface url {
  userid_num:string;
  url:string;
}

function ChallengeInProgress() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { challenge_id } = useParams();
  const tab:string[]=['나'];
  const tabId:number[]=[3];
  const UrlGroup:string[][] =[[],[],[],[]]
  const Images:JSX.Element[] = []


  useEffect(() => {
    dispatch(setHeaderInfo({ title: '진행중인 챌린지', backPath: -1 }));
  }, [dispatch]);

  const [challengeDetail, setChallengeDetail] = useState<Challenge>({
    challenge_id: 1,
    userid_num: 1,
    challenge_name: '임시 데이터',
    topic: '',
    challenger_userid_num: [1, 2],
    goal_money: 0,
    is_public: true,
    term: 3,
    winner_userid_num: null,
    authentication_start_date: new Date(),
    authentication_end_date: new Date(),
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
  const [urls,setUrls]=useState<url[]>([])

  const period = differenceInDays(challengeDetail.authentication_end_date, challengeDetail.authentication_start_date);

  let totalAuthCount = 3;
  if(period!==3){
    totalAuthCount =((period+1)/7)*challengeDetail.term
  }

  useEffect(() =>{
    console.log('challenge_id', challenge_id)
    axios
      .get(`http://3.34.122.205:3000/challengeDetail/${challenge_id}`)
      .then((response): void => {
        console.log('response', response.data);
        setChallengeDetail(response.data.challengeDetail[0]);
        setChallengers(response.data.challengers);
        setUrls(response.data.urls)
      })
      .catch((error): void => {
        console.error('Challengeinprogress에서 axios 오류:', error);
      });
  }, []);

// 기본값  '나'는 이미 저장된 값
  // 로그인한 유저가 아닌 challengers의 nickname만 push
  for (let i=0; i<4; i++) {
    if(challengers[i]&& challengers[i].userid_num!==3){ //jwt로 수정
      tab.push(challengers[i].nickname)
      tabId.push(challengers[i].userid_num)
    }else{
      tab.push("")
    }
  }
  
  for(let j=0; j<tabId.length; j++){
   for(let i=0; i<urls.length;i++){
    Number(urls[i].userid_num)===tabId[j] ? UrlGroup[j].push(urls[i].url) : ""
   }
  }
  
  
  for (let i=0; i<UrlGroup.length; i++){
    Images.push  (
      <div className="grid grid-cols-2 gap-2">
        {UrlGroup[i].map((url,index)=>{
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
  }








  


  return (
    <div className="mt-12 flex flex-col gap-4">
      <div className="p-3 text-center text-4xl font-extrabold">
        총 {challengeDetail.goal_money * challengers.length}원
      </div>

      <div className="m-10 flex  p-1 text-center justify-between">
        <div className="flex-col">
        <div className="text-xl font-black p-2">나</div>
        <div className="text-l ">{UrlGroup[0].length}회 성공</div>
        </div>

        <div className="flex-col">
        <div className="text-xl font-black p-2">{tab[1]}</div>
        <div className="text-l ">{UrlGroup[1].length}회 성공</div>
        </div>

        {tab[2]!==""&&<div className="flex-col">
        <div className="text-xl font-black p-2">{tab[2]}</div>
        <div className="text-l ">{UrlGroup[2].length}회 성공</div>
        </div>}
        
        {tab[3]!==""&&<div className="flex-col">
        <div className="text-xl font-black p-2">{tab[3]}</div>
        <div className="text-l font-black">{UrlGroup[3].length}회 성공</div>
        </div>}
       
        
      </div>


      <ProgressComponent ProgressName={'진행률'} total={ totalAuthCount} value={UrlGroup[0].length} />
      <ProgressComponent ProgressName={'기간'} total={period+1} value={differenceInDays(new Date(), challengeDetail.authentication_start_date)} />
      <br />
      <ListComponent1 challenge={challengeDetail} />
      <Tab 
      tab1={tab[0]} tab2={tab[1]} tab3={tab[2]} tab4={tab[3]} tab1content={Images[0]} tab2content={Images[1]}  tab3content={Images[2]} tab4content={Images[3]} />
      <Cta text='인증하기' onclick={() => {
            navigate(`/camera/${challenge_id}`);
          }} >
      </Cta>
    </div>
  );
}
export default ChallengeInProgress;
