import { Tab } from '@/components/Component0117';
import { useDispatch, useSelector } from 'react-redux';
import { ListComponent1, ProgressComponent } from '@/components/ComponentSeong';
import { RootState } from '@/store/store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, RefObject } from 'react';
import axios from 'axios';
import { Challenge, users } from '@/types/types';
import { setTotalAuth, setResult } from '@/store/resultSlice';
import { setHeaderInfo } from '@/store/headerSlice';
import { differenceInDays, differenceInCalendarDays } from 'date-fns';
import { privateApi } from '@/api/axios';
// import Cta from '@/components/Cta';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface url {
  userid_num: string;
  url: string;
}

function ChallengeInProgress() {
  const info = useSelector((state: RootState) => state.result);
  console.log(info);

  const { userid_num } = useSelector((state: RootState) => state.login);
  console.log('user', userid_num);

  const [file, setFile] = useState<File>();

  const [imgUrl, setImgUrl] = useState<string>();

  const inputRef: RefObject<HTMLInputElement> | null = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { challenge_id } = useParams();
  const tab: string[] = ['나'];
  const tabId: number[] = [userid_num];
  const UrlGroup: string[][] = [[], [], [], []];
  const Images: JSX.Element[] = [];

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
  const [urls, setUrls] = useState<url[]>([]);

  const period = differenceInDays(challengeDetail.authentication_end_date, challengeDetail.authentication_start_date);

  let totalAuthCount = 3;
  if (period !== 2) {
    totalAuthCount = ((period + 1) / 7) * challengeDetail.term;
  }

  async function query(file: File) {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/detr-resnet-50', {
      headers: { Authorization: import.meta.env.VITE_HUGGING_FACE_TOKEN },
      method: 'POST',
      body: file,
    });
    const result = await response.json();
    return result;
  }

  async function upload() {
    if (file) {
      const aiFile = await query(file);
      console.log('aifile >>>>>>', aiFile);
    }


    await privateApi({
      method: 'post',
      url: `http://3.34.122.205:3000/challengeAuth/${challenge_id}`,
      data: {
        filename: file?.name,
        type: file?.type,
      },
    }).then((res) => {
      console.log('res.data', res.data);
      if (res.data.msg) {
        alert(res.data.msg);
      } else {
        privateApi({
          method: 'put',
          url: res.data,
          data: file,
          headers: {
            'Content-Type': file?.type,
          },
        }).then((res) => {
          console.log(res);
          alert('업로드 완료!');
          navigate(`/challengeInProgress/${challenge_id}`);
        });
      }
    });
    if (imgUrl) {
      URL.revokeObjectURL(imgUrl);
    }

    setFile(undefined);
  }

  useEffect(() => {
    console.log('challenge_id', challenge_id);

    privateApi
      .get(`http://3.34.122.205:3000/challengeDetail/${challenge_id}`)
      .then((response): void => {
        console.log('response', response.data);
        setChallengeDetail(response.data.challengeDetail[0]);
        setChallengers(response.data.challengers);
        setUrls(response.data.urls);
      })
      .catch((error): void => {
        console.error('Challengeinprogress에서 axios 오류:', error);
      });
  }, []);

  useEffect(() => {
    const resultArr = [];
    for (let i = 0; i < 4; i++) {
      if (tab[i]) {
        resultArr.push({ userid_num: tabId[i], nickname: tab[i], Authcount: UrlGroup[i].length });
      }
    }

    dispatch(setTotalAuth(totalAuthCount));
    dispatch(setResult(resultArr));


    const Dday = differenceInCalendarDays(challengeDetail.authentication_end_date, new Date());

    if (Dday < 0) {
      navigate(`/challengeResult/${challenge_id}`);
    }

    // const Dday =differenceInCalendarDays(challengeDetail.authentication_end_date, new Date())

    // if(Dday<0){
    //   navigate(`/challengeResult/${challenge_id}`)
    // }

  }, [challengeDetail.authentication_end_date]);

  // 기본값  '나'는 이미 저장된 값
  // 로그인한 유저가 아닌 challengers의 nickname만 push
  for (let i = 0; i < 4; i++) {
    if (challengers[i] && challengers[i].userid_num !== userid_num) {
      //jwt로 수정
      tab.push(challengers[i].nickname);
      tabId.push(challengers[i].userid_num);
    }
  }

  for (let j = 0; j < tabId.length; j++) {
    for (let i = 0; i < urls.length; i++) {
      Number(urls[i].userid_num) === tabId[j] ? UrlGroup[j].push(urls[i].url) : '';
    }
  }

  for (let i = 0; i < UrlGroup.length; i++) {
    Images.push(
      <div key={i} className="grid grid-cols-2 gap-2">
        {UrlGroup[i].map((url, index) => {
          return (
            <Link key={index} to="/challengeImage/1">
              <div>
                <img className="aspect-square w-full rounded-lg object-cover" src={url}></img>
              </div>
            </Link>
          );
        })}
      </div>,
    );
  }

  return (
    <div className="mt-12 flex flex-col gap-4">
      <div className="p-3 text-center text-4xl font-extrabold">
        총 {challengeDetail.goal_money * challengers.length}원
      </div>

      <div className="m-10 flex  justify-between p-1 text-center">
        <div className="flex-col">

          <div className="p-2 text-xl font-black">나</div>
          <div className="text-l ">{UrlGroup[0].length}회 성공</div>
        </div>

        <div className="flex-col">
          <div className="p-2 text-xl font-black">{tab[1]}</div>
          <div className="text-l ">{UrlGroup[1].length}회 성공</div>
        </div>

        {tab[2] && (
          <div className="flex-col">

            <div className="p-2 text-xl font-black">{tab[2]}</div>
            <div className="text-l ">{UrlGroup[2].length}회 성공</div>
          </div>
        )}

        {tab[3] && (
          <div className="flex-col">

            <div className="p-2 text-xl font-black">{tab[3]}</div>
            <div className="text-l font-black">{UrlGroup[3].length}회 성공</div>
          </div>
        )}
      </div>

      <ProgressComponent ProgressName={'진행률'} total={totalAuthCount} value={UrlGroup[0].length} />
      <ProgressComponent
        ProgressName={'기간'}
        total={period + 1}
        value={differenceInDays(new Date(), challengeDetail.authentication_start_date)}
      />
      <br />
      <ListComponent1 challenge={challengeDetail} />
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

      {/* <Button onClick={() => {
            navigate(`/camera/${challenge_id}`);
            
          }}>인증하기</Button> */}
      {/* <Cta text='인증하기' onclick={() => {
            navigate(`/camera/${challenge_id}`);
            
          }} >
      </Cta> */}
      {imgUrl && (

        <div className="mx-auto text-center">
          <img src={imgUrl}></img>
          <Button onClick={upload}>업로드</Button>
        </div>
      )}

      <div className="cta fixed bottom-0 left-0 right-0 flex flex-col">
        <div className="flex h-8 bg-gradient-to-b from-transparent to-white"></div>
        <div className="flex-col bg-white px-8  pb-8 ">
          <input
            className="opacity-0"
            type="file"
            id="imageFile"
            capture="environment"
            accept="image/*"
            ref={inputRef}
            onChange={(e) => {
              if (e.target.files?.length == 1) {
                console.log(e.target.files[0]);
                setFile(e.target.files[0]);
                setImgUrl(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
          <Button
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click();
              }
            }}
            className="w-full rounded-md p-6"
          >
            인증하기
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ChallengeInProgress;
