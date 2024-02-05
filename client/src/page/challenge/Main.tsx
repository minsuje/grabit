import MainRanking from '@/components/MainRanking';
import { ListComponent1 } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { privateApi } from '@/api/axios';
import { Challenge } from '@/types/types';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import HotChallenge from '@/components/HotChallenge';

import OpenAI from 'openai';
import { Input } from '@/components/ui/input';
import HotTopicData from '@/components/HotTopicData';

export default function Main() {
  console.log('main mounted !!!');
  const dispatch = useDispatch();

  const [userid_num, setUserid_num] = useState<number>(0);
  const [ingMyChallenge, setIngMyChallenge] = useState<Challenge[]>([]);
  const [endedMyChallenge, setEndedMyChallenge] = useState<Challenge[]>([]);
  const [dailymission, setDailymission] = useState<string>('');
  const [completed, setCompleted] = useState<string>('none');
  const [gptInput, setGptInput] = useState<string>('');
  const [gptAnswer, setGptAnswer] = useState<string>();
  const [imageBase64, setImageBase64] = useState('');

  // Function to convert image to base64
  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageBase64(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error('Error converting image to Base64', error);
    };
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      convertToBase64(file);
    }
  };

  useEffect(() => {
    setUserid_num(Number(localStorage.getItem('userid_num')));

    privateApi
      .get('http://52.79.228.200:3000/dailyMission', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('dailyMission >>>>>>>', response.data);
        setDailymission(response.data.mission.title);
        setCompleted(response.data.completed);
      })
      .catch((error) => {
        console.error('main에서 일일미션 오류발생 :', error);
      });

    privateApi
      .get('http://52.79.228.200:3000/challengeList', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        // console.log('challengeList >>>>>>>>>', response.data);
        setIngMyChallenge(response.data.ingMyChallenge);
        setEndedMyChallenge(response.data.endedMyChallenge);
      })
      .catch((error) => {
        console.error('ChallengeInProgress에서 진행중인챌린지 오류발생 :', error);
      });

    // console.log('dailyMission', dailymission);
    // console.log('completed', completed);
    // console.log('ingMyChallenge', ingMyChallenge);
  }, [userid_num]);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '홈', backPath: '/' }));
  }, [dispatch]);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function openaiFunction() {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `${gptInput} 라는 주제에서 키워드를 추출해서, 이미지에 해당 키워드가 존재하는지 true, false 로만 대답해. 다른 말은 하지마.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
    });
    // console.log('openai >>>>>>>>>>', response.choices[0]);
  }

  return (
    <div className="my-8 flex flex-col gap-16">
      <div className="ranking flex flex-col">
        <h1 className="text-grabit-800">랭킹</h1>
        <MainRanking />
      </div>

      <div className="today-mission flex flex-col gap-6">
        <h1 className="text-grabit-800">오늘의 미션</h1>
        {completed === 'none' ? (
          <Link to={`/challengeDaily`} className="text-black no-underline">
            <div>
              <div className="mb-[5%]  flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-lg shadow-grabit-600/10">
                <div className="counter w-4"></div>
                <div className="flex justify-between gap-2">
                  <h2 className="font-['SUITE Variable'] text-grabit-600">{dailymission}</h2>
                  <p className=" text-grabit-400"></p>
                </div>
                <p className="font-['SUITE Variable'] text-2xl font-bold text-grabit-600">10P</p>
              </div>
            </div>
          </Link>
        ) : (
          <div>
            <div className="mb-[5%]  flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-lg shadow-grabit-600/10">
              <div className="flex justify-between">
                <h2>{dailymission}</h2>
                <p>오늘 미션 완료!!</p>
              </div>
              <p>10P</p>
            </div>
          </div>
        )}
      </div>

      {endedMyChallenge.length !== 0 && (
        <>
          <h1>완료된 챌린지</h1>
          {endedMyChallenge.map((challenge: Challenge, index) => {
            return (
              <Link
                key={index}
                to={`/challengeInProgress/${challenge.challenge_id}`}
                className="text-black no-underline"
              >
                <div>
                  <div className="mb-[5%] flex flex-col rounded-lg bg-gray-200 p-6 shadow-md">
                    <div className="flex justify-between">
                      <p>{challenge.challenge_name}</p>
                      <p>챌린지 완료</p>
                    </div>
                    <p>결과 확인하기 {'>>'} </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </>
      )}

      <div className="challenge-in-progress flex flex-col gap-8">
        <h1 className="text-grabit-800">진행중인 챌린지</h1>
        {ingMyChallenge.length == 0 ? (
          <div className="flex flex-col gap-4 rounded-xl bg-white p-8 text-center text-grabit-400 shadow-lg shadow-grabit-600/10">
            진행중인 챌린지가 없습니다. <br />
            챌린지를 직접 생성하거나 <br />
            다른 사람이 만든 챌린지에 참여해보세요
            <Link to="/challengeList" className=" text-gray-400 no-underline">
              <Button className="">챌린지 보러가기</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {ingMyChallenge.map((challenge: Challenge, idx: number) => {
              return (
                <Link key={idx} to={`/challengeInProgress/${challenge.challenge_id}`} className="flex flex-col gap-2">
                  <ListComponent1 challenge={challenge} />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="trending-challenge flex flex-col gap-8">
        <h1 className="text-grabit-800">지금 인기있는 주제</h1>
        <HotChallenge />

        <Link to="/challengeList" className="text-center text-gray-400 no-underline">
          <div>전체 챌린지 보러가기</div>
        </Link>
      </div>

      <div className="flex flex-col gap-3 p-3 text-center">
        <Link to="/challengeCreate">
          <Button>챌린지 생성</Button>
        </Link>
        <Link
          to="/challengeInProgress/1
        "
        >
          <Button>진행중인 챌린지</Button>
        </Link>
        <Link to="/fileUpload">
          <Button>파일 업로드 테스트</Button>
        </Link>
        <Link to="/challengeEdit/1">
          <Button>1번 챌린지 수정</Button>
        </Link>

        <Link to={`/mypage`}>
          <Button>마이페이지 </Button>
        </Link>

        <Input onChange={(e) => setGptInput(e.target.value)} />

        <input type="file" capture="environment" onChange={handleFileChange} />

        <Button onClick={openaiFunction} className="bg-grabit-400 p-4">
          OPENAI
        </Button>
        <p>{gptAnswer}</p>
      </div>
    </div>
  );
}
