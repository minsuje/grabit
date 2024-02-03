import { Tab } from '@/components/Component0117';
import { useDispatch, useSelector } from 'react-redux';
import { ListComponent1, ProgressComponent } from '@/components/ComponentSeong';
import { RootState } from '@/store/store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Challenge, users } from '@/types/types';
import { setTotalAuth, setResult, setWinner, setTotalMoney } from '@/store/resultSlice';
import { setHeaderInfo } from '@/store/headerSlice';
import { differenceInDays, differenceInCalendarDays } from 'date-fns';
import { privateApi } from '@/api/axios';
import Cta from '@/components/Cta';
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Rive from '@rive-app/react-canvas';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

// Animation
// import { easeQuadInOut } from 'd3-ease';
// import AnimatedProgressProvider from './AnimatedProgressProvider';
// import ChangingProgressProvider from './ChangingProgressProvider';

// Radial separators
import RadialSeparators from '@/components/progress/Seperator.tsx';

type profiles = string;
interface url {
  userid_num?: string;
  url: string;
  authentication_id?: number;
}

// function Example(props) {
//   return (
//     <div style={{ marginBottom: 80 }}>
//       <hr style={{ border: '2px solid #ddd' }} />
//       <div style={{ marginTop: 30, display: 'flex' }}>
//         <div style={{ width: '30%', paddingRight: 30 }}>{props.children}</div>
//         <div style={{ width: '70%' }}>
//           <h3 className="h5">{props.label}</h3>
//           <p>{props.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

function ChallengeInProgress() {
  const info = useSelector((state: RootState) => state.result);
  console.log(info);

  const userid_num = Number(localStorage.getItem('userid_num'));
  console.log('user', userid_num);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { challenge_id } = useParams();
  const tab: string[] = ['나'];
  const tabId: number[] = [userid_num];
  const UrlGroup: url[][] = [[], [], [], []];
  const Images: JSX.Element[] = [];
  const profiles: profiles[] = [];
  const [isAcceptable, setIsAcceptable] = useState<boolean>(true);
  const [urls, setUrls] = useState<url[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '진행중인 챌린지', backPath: -1 }));
  }, [dispatch]);

  const [challengeDetail, setChallengeDetail] = useState<Challenge>({
    challenge_id: 1,
    userid_num: 1,
    challenge_name: '임시 데이터',
    topic: '',
    challenger_userid_num: [{ resultConfirm: false, userid_num: 30, isAccept: true }],
    goal_money: 0,
    is_public: true,
    term: 3,
    auth_keyword: '',
    winner_userid_num: null,
    authentication_start_date: new Date(2024, 1, 1),
    authentication_end_date: new Date(2024, 1, 3),
    authentication_start_time: 9,
    authentication_end_time: 23,
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
    {
      userid_num: 30,
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
    // console.log('challenge_id', challenge_id);

    privateApi
      .get(`http://3.34.122.205:3000/challengeDetail/${challenge_id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response): void => {
        console.log('response', response.data);
        if (response.data.challengeDetail) {
          const { challengeDetail, challengers, urls, isAcceptable } = response.data;
          setChallengeDetail(challengeDetail[0]);
          setChallengers(challengers);
          setUrls(urls);
          setIsAcceptable(isAcceptable);
          setLoading(true);
        } else if (response.data.msg) {
          alert(response.data.msg);
          navigate('/main');
        }
      })
      .catch((error): void => {
        console.error('Challengeinprogress에서 axios 오류:', error);
      });
  }, []);

  // 챌린지 기간
  const period = differenceInDays(challengeDetail.authentication_end_date, challengeDetail.authentication_start_date);

  // 인증해야하는 총 횟수
  let totalAuthCount = 3;
  if (period !== 2) {
    totalAuthCount = ((period + 1) / 7) * challengeDetail.term;
    console.log(totalAuthCount);
  }

  const myprofile = challengers.filter((challenger) => {
    return challenger.userid_num === userid_num;
  });
  console.log('myprofile', myprofile[0]);

  if (myprofile && myprofile[0].profile_img) {
    console.log(1);
  } else {
    console.log(2);
    profiles.push('/grabit_profile.png');
    console.log(profiles);
  }

  useEffect(() => {
    const resultArr = [];
    const winnerArr: number[] = [];
    for (let i = 0; i < 4; i++) {
      if (tab[i]) {
        resultArr.push({ userid_num: tabId[i], nickname: tab[i], Authcount: UrlGroup[i].length });
        if (UrlGroup[i].length === totalAuthCount) {
          winnerArr.push(tabId[i]);
        }
      }
    }

    dispatch(setTotalAuth(totalAuthCount));
    dispatch(setResult(resultArr));
    dispatch(setWinner(winnerArr));
    dispatch(setTotalMoney(challengeDetail.goal_money * challengers.length));

    const Dday = differenceInCalendarDays(challengeDetail.authentication_end_date, new Date());

    console.log('>Dday>>>>>', Dday);
    if (Dday < 0) {
      navigate(`/challengeResult/${challenge_id}`);
    }
  }, [challengeDetail]);

  // 기본값  '나'는 이미 저장된 값
  // 로그인한 유저가 아닌 challengers의 nickname만 push
  for (let i = 0; i < 4; i++) {
    if (
      challengeDetail.challenger_userid_num[i] &&
      challengeDetail.challenger_userid_num[i].userid_num !== userid_num &&
      challengeDetail.challenger_userid_num[i].isAccept
    ) {
      tab.push(challengers[i].nickname);
      tabId.push(challengers[i].userid_num);

      if (challengers[i] && challengers[i].profile_img) {
        profiles.push(challengers[i].profile_img!);
      } else if (challengers[i]) {
        profiles.push('/grabit_profile.png');
      }
    }
  }

  // 각각의 참여자들의 사진을 모으기
  for (let j = 0; j < tabId.length; j++) {
    for (let i = 0; i < urls.length; i++) {
      Number(urls[i].userid_num) === tabId[j] ? UrlGroup[j].push(urls[i]) : '';
    }
  }
  // 해당 이미지의 HTML 요소를 배열에 push
  for (let i = 0; i < UrlGroup.length; i++) {
    Images.push(
      <div key={i} className="grid grid-cols-2 gap-2">
        {UrlGroup[i].map((url, index) => {
          return (
            <Link key={index} to={`/challengeImage/${challenge_id}/${url.authentication_id}`}>
              <div>
                <img className="aspect-square w-full rounded-lg object-cover" src={url.url}></img>
              </div>
            </Link>
          );
        })}
      </div>,
    );
  }

  console.log('URLGROUP>>>:>>', UrlGroup);
  console.log('tab >>>>>>>>', tab);
  console.log('challengers >>>>>>', challengers);
  console.log('challengeDetail .>>>>>>>', challengeDetail);
  console.log('profiles', profiles);

  const { RiveComponent } = useRive({
    src: '/diamond.riv',
    stateMachines: ['Rotate', 'Flash', 'Timeline1', 'Hover'],
    autoplay: true,
  });

  return (
    <div className="mt-12 flex flex-col gap-4">
      <h1 className="text-center text-3xl text-grabit-700">{challengeDetail?.challenge_name}</h1>
      <h3 className="text-center font-medium text-grabit-400">
        {differenceInDays(new Date(), challengeDetail.authentication_start_date)}일차
      </h3>

      {loading && (
        <>
          <div className="relative flex flex-col items-center justify-center gap-4 p-3 text-center text-4xl font-extrabold">
            <div className="absolute h-40 w-40 opacity-50">
              <RiveComponent />
            </div>
            <h2 className="z-10 flex animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-center font-['JalnanGothic'] text-4xl text-grabit-600 text-transparent">
              {challengeDetail?.goal_money * challengers.length} 캐럿
            </h2>
          </div>

          <div className="bar flex w-full flex-col items-center justify-center gap-4 px-20">
            <h3 className="flex w-fit text-xl font-bold text-grabit-700">{tab[0]}</h3>
            <CircularProgressbarWithChildren
              value={UrlGroup[0].length > 0 ? (UrlGroup[0].length / totalAuthCount) * 100 : 0}
              strokeWidth={10}
              styles={buildStyles({
                trailColor: '#e9ecf6',
                pathColor: '#726cb0',
              })}
            >
              <div className="profile-img relative aspect-square w-full">
                <img
                  style={{ borderRadius: '100%', width: '70%' }}
                  src={profiles[0] !== null ? profiles[0] : '/grabit_profile.png'}
                  className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 animate-pulse"
                />
              </div>
              <RadialSeparators
                count={totalAuthCount}
                style={{
                  background: '#fff',
                  width: '10px',
                  borderRadius: '0px',
                  height: `${0}%`,
                }}
              />
            </CircularProgressbarWithChildren>
            <span className="text-center text-lg font-semibold text-stone-600">{UrlGroup[0].length}회 성공</span>
          </div>

          <div className="progress grid grid-cols-3 gap-6 p-2">
            {tab.map((nickname, index) => {
              if (index === 0) return null;

              return (
                <div key={index} className="bar flex w-full flex-col items-center justify-center gap-4">
                  <h3 className="flex w-fit break-all text-center text-xl font-bold text-grabit-700">{nickname}</h3>
                  <CircularProgressbarWithChildren
                    value={UrlGroup[index].length > 0 ? (UrlGroup[index].length / totalAuthCount) * 100 : 0}
                    strokeWidth={20}
                    styles={buildStyles({
                      trailColor: '#e9ecf6',
                      pathColor: '#726cb0',
                    })}
                  >
                    <div className="profile-img relative aspect-square w-full">
                      <img
                        style={{ borderRadius: '100%', width: '50%' }}
                        src={profiles[index]}
                        className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 animate-pulse"
                      />
                    </div>
                    <RadialSeparators
                      count={totalAuthCount}
                      style={{
                        background: '#fff',
                        width: '20px',
                        borderRadius: '0px',
                        height: `${0}%`,
                      }}
                    />
                  </CircularProgressbarWithChildren>
                  <span className="text-center text-lg font-semibold text-stone-600">
                    {UrlGroup[index].length}회 성공
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      <ProgressComponent ProgressName={'진행률'} total={totalAuthCount} value={UrlGroup[0].length} />
      <ProgressComponent
        ProgressName={'기간'}
        total={period + 1}
        value={differenceInDays(new Date(), challengeDetail.authentication_start_date)}
      />
      <br />
      {/* <ListComponent1 challenge={challengeDetail} /> */}
      <Tab
        tab1={tab[0]}
        tab2={tab[1]}
        tab3={tab[2]}
        tab4={tab[3]}
        tab1content={Images[0]}
        tab2content={Images[1]}
        tab3content={Images[2]}
        tab4content={Images[3]}
      />

      <Cta
        text="인증하기"
        onclick={() => {
          navigate(`/camera/${challenge_id}`, {
            state: {
              keyword: challengeDetail.auth_keyword,
              name: challengeDetail.challenge_name,
            },
          });
        }}
        disabled={!isAcceptable}
      ></Cta>
    </div>
  );
}
export default ChallengeInProgress;
