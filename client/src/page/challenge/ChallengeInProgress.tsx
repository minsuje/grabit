import { Tab } from '@/components/Component0117';
import { ProgressComponent } from '@/components/ComponentSeong';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Challenge, users } from '@/types/types';
import { setTotalAuth, setResult, setWinner, setTotalMoney } from '@/store/resultSlice';
import { setHeaderInfo } from '@/store/headerSlice';
import { differenceInDays, differenceInCalendarDays } from 'date-fns';
import { privateApi } from '@/api/axios';
import Cta from '@/components/Cta';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useRive } from '@rive-app/react-canvas';

import RadialSeparators from '@/components/progress/Seperator.tsx';
import Error403 from '../Error403';

type profiles = string;
interface url {
  userid_num?: string;
  url: string;
  authentication_id?: number;
}

function ChallengeInProgress() {
  const userid_num = Number(localStorage.getItem('userid_num'));

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
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '진행중인 챌린지', backPath: -1 }));
  }, [dispatch]);

  const [challengeDetail, setChallengeDetail] = useState<Challenge>({
    challenge_id: 0,
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
    authentication_end_date: new Date(2100, 10, 3),
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
      userid_num: userid_num,
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
    privateApi
      .get(`/challengeDetail/${challenge_id}`)
      .then((response): void => {
        if (response.data.challengeDetail) {
          const { challengeDetail, challengers, urls, isAcceptable } = response.data;
          setChallengeDetail(challengeDetail[0]);
          setChallengers(challengers);
          setUrls(urls);
          setIsAcceptable(isAcceptable);
          setLoading(true);

          const exist =
            challengers.some((challenger: users) => challenger.userid_num === userid_num) ||
            challengeDetail[0].userid_num === userid_num;

          setIsValid(exist);
        } else if (response.data.msg) {
          alert(response.data.msg);
          navigate('/main');
        }
      })
      .catch((error): void => {
        console.error('Challengeinprogress에서 axios 오류:', error);
      });
  }, []);

  const myprofile = challengers.filter((challenger) => {
    return challenger.userid_num === userid_num;
  });

  if (myprofile && myprofile[0]?.profile_img) {
    profiles.push(myprofile[0]?.profile_img);
  } else {
    profiles.push('/grabit_profile.png');
  }

  // 챌린지 기간
  const period = differenceInCalendarDays(
    challengeDetail.authentication_end_date,
    challengeDetail.authentication_start_date,
  );

  // 인증해야하는 총 횟수
  let totalAuthCount = 3;
  if (period !== 2) {
    totalAuthCount = ((period + 1) / 7) * challengeDetail.term;
  }

  useEffect(() => {
    const resultArr = [];
    const winnerArr: number[] = [];
    for (let i = 0; i < 4; i++) {
      if (tab[i]) {
        resultArr.push({ userid_num: tabId[i], nickname: tab[i], Authcount: totalAuthCount });
        if (resultArr[i].Authcount === totalAuthCount) {
          winnerArr.push(tabId[i]);
        }
      }
    }

    dispatch(setTotalAuth(totalAuthCount));
    dispatch(setResult(resultArr));
    dispatch(setWinner(winnerArr));
    dispatch(setTotalMoney(challengeDetail.goal_money * tabId.length));

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
      tab.push(challengers[i].nickname);
      tabId.push(challengers[i].userid_num);

      let thisProfile = challengers.filter((challenger) => {
        return challenger.userid_num === challengers[i].userid_num;
      });

      if (thisProfile && thisProfile[0].profile_img) {
        profiles.push(thisProfile[0].profile_img);
      } else {
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

  const { RiveComponent } = useRive({
    src: '/diamond.riv',
    stateMachines: ['Rotate', 'Flash', 'Timeline1', 'Hover'],
    autoplay: true,
  });

  if (loading)
    if (isValid) {
      return (
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <div className="title flex flex-col gap-1">
              <h1 className="text-center text-3xl text-grabit-700">{challengeDetail?.challenge_name}</h1>
              <h3 className="text-center font-medium text-grabit-400">
                {differenceInDays(new Date(), challengeDetail.authentication_start_date)}일차
              </h3>
            </div>

            <div className="relative my-8 flex flex-col items-center justify-center gap-4 p-3 text-center text-4xl font-extrabold">
              <div className="absolute h-60 w-60 opacity-70">
                <RiveComponent />
              </div>
              <h2 className="font-['SUITE Variable'] z-10 flex animate-text flex-col bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-center text-4xl font-black text-grabit-600 text-transparent">
                {challengeDetail?.goal_money * challengers.length} <span className="text-xl">캐럿</span>
              </h2>
            </div>

            <div className="bar mb-10 mt-16 flex w-full flex-col items-center justify-center gap-4 px-20">
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
                    className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 "
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
              <div className="flex flex-col items-center justify-center gap-1">
                <h3 className="flex w-fit text-xl font-extrabold text-grabit-700">{tab[0]}</h3>
                <span className="text-md text-center font-extrabold text-stone-400">{UrlGroup[0].length}회 성공</span>
              </div>
            </div>
            <div className="progress grid grid-cols-3 gap-6 p-2">
              {tab.map((nickname, index) => {
                if (index === 0) return null;
                return (
                  <div key={index} className="bar flex w-full flex-col items-center justify-start gap-4">
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
                          className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2"
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
                    <div className="flex flex-col items-center justify-center gap-1">
                      <h3 className="text-md flex w-fit truncate break-all text-center font-extrabold text-grabit-700">
                        {nickname}
                      </h3>
                      <span className="text-center text-sm font-semibold text-stone-400">
                        {UrlGroup[index].length}회 성공
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 flex flex-col gap-4">
              <ProgressComponent ProgressName={'진행률'} total={totalAuthCount} value={UrlGroup[0].length} />
              <ProgressComponent
                ProgressName={'기간'}
                total={period + 1}
                value={differenceInDays(new Date(), challengeDetail.authentication_start_date)}
              />
            </div>
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
        </div>
      );
    } else {
      return <Error403 />;
    }
  else return;
}
export default ChallengeInProgress;
