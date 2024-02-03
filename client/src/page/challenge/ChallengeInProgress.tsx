import { Tab } from '@/components/Component0117';
import { useDispatch, useSelector } from 'react-redux';
import { ListComponent1, ProgressComponent } from '@/components/ComponentSeong';
import { RootState } from '@/store/store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Challenge, users } from '@/types/types';
import { setTotalAuth, setResult, setWinner } from '@/store/resultSlice';
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
interface url {
  userid_num?: string;
  url: string;
  authentication_id?: number;
}

function Example(props) {
  return (
    <div style={{ marginBottom: 80 }}>
      <hr style={{ border: '2px solid #ddd' }} />
      <div style={{ marginTop: 30, display: 'flex' }}>
        <div style={{ width: '30%', paddingRight: 30 }}>{props.children}</div>
        <div style={{ width: '70%' }}>
          <h3 className="h5">{props.label}</h3>
          <p>{props.description}</p>
        </div>
      </div>
    </div>
  );
}

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
  const [urls, setUrls] = useState<url[]>([]);

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
      userid_num: 2,
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

  const period = differenceInDays(challengeDetail.authentication_end_date, challengeDetail.authentication_start_date);

  let totalAuthCount = 3;
  if (period !== 2) {
    totalAuthCount = ((period + 1) / 7) * challengeDetail.term;
  }

  useEffect(() => {
    console.log('challenge_id', challenge_id);

    privateApi
      .get(`http://3.34.122.205:3000/challengeDetail/${challenge_id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response): void => {
        console.log('response', response.data);
        if (response.data.challengeDetail) {
          setChallengeDetail(response.data.challengeDetail[0]);
          setChallengers(response.data.challengers);
          setUrls(response.data.urls);
        } else if (response.data.msg) {
          alert(response.data.msg);
          navigate('/main');
        }
      })
      .catch((error): void => {
        console.error('Challengeinprogress에서 axios 오류:', error);
      });
  }, []);

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

    const Dday = differenceInCalendarDays(challengeDetail.authentication_end_date, new Date());

    if (Dday < 0) {
      navigate(`/challengeResult/${challenge_id}`);
    }
  }, [challengeDetail.authentication_end_date]);

  // 기본값  '나'는 이미 저장된 값
  // 로그인한 유저가 아닌 challengers의 nickname만 push
  for (let i = 0; i < 4; i++) {
    if (
      challengeDetail.challenger_userid_num[i] &&
      challengeDetail.challenger_userid_num[i].userid_num !== userid_num &&
      challengeDetail.challenger_userid_num[i].isAccept
    ) {
      //jwt로 수정
      tab.push(challengers[i].nickname);
      tabId.push(challengers[i].userid_num);
    }
  }

  for (let j = 0; j < tabId.length; j++) {
    for (let i = 0; i < urls.length; i++) {
      Number(urls[i].userid_num) === tabId[j] ? UrlGroup[j].push(urls[i]) : '';
    }
  }

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

      <div className="relative flex flex-col items-center justify-center gap-4 p-3 text-center text-4xl font-extrabold">
        <div className="absolute h-40 w-40 opacity-50">
          <RiveComponent />
        </div>
        <h2 className="animate-text z-10 flex bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-center font-['JalnanGothic'] text-4xl text-grabit-600 text-transparent">
          {challengeDetail?.goal_money * challengers.length} 캐릿
        </h2>
      </div>

      <div className="bar flex w-full flex-col items-center justify-center gap-4 px-20">
        <h3 className="flex w-fit text-xl font-bold text-grabit-700">{tab[0]}</h3>
        <CircularProgressbarWithChildren
          value={UrlGroup[0].length > 0 ? totalAuthCount / UrlGroup[0].length : 0}
          strokeWidth={10}
          styles={buildStyles({
            trailColor: '#e9ecf6',
            pathColor: '#726cb0',
          })}
        >
          <div className="profile-img relative aspect-square w-full">
            <img
              style={{ borderRadius: '100%', width: '70%' }}
              src={challengers[0]?.profile_img ? challengers[0]?.profile_img : '/grabit_profile.png'}
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
        {UrlGroup.map((group, index) => {
          if (index === 0) return null;

          return (
            <div key={index} className="bar flex w-full flex-col items-center justify-center gap-4">
              <h3 className="flex w-fit break-all text-center text-xl font-bold text-grabit-700">{tab[index]}</h3>
              <CircularProgressbarWithChildren
                value={group.length > 0 ? totalAuthCount / group.length : 0}
                strokeWidth={20}
                styles={buildStyles({
                  trailColor: '#e9ecf6',
                  pathColor: '#726cb0',
                })}
              >
                <div className="profile-img relative aspect-square w-full">
                  <img
                    style={{ borderRadius: '100%', width: '50%' }}
                    src={challengers[index]?.profile_img ? challengers[index]?.profile_img : '/grabit_profile.png'}
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
              <span className="text-center text-lg font-semibold text-stone-600">{group.length}회 성공</span>
            </div>
          );
        })}
      </div>

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
      ></Cta>
    </div>
  );
}
export default ChallengeInProgress;
