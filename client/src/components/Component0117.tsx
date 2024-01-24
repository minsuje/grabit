import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { users } from '@/types/types';

function CreateChallenge() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-start-1 col-span-2 font-bold text-xl ">주제</div>
        <div className="col-start-1 col-span-1">
          <Select>
            <SelectTrigger className="w-[100%]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <input className="col-start-2 col-span-2 p-2" placeholder="이름" />
      </div>
    </>
  );
}

function Tab({
  tab1,
  tab2,
  tab1content,
  tab2content,
}: {
  tab1: string;
  tab2: string;
  tab1content: JSX.Element;
  tab2content: JSX.Element;
}) {
  return (
    <div className="w-full mt-10">
      <Tabs defaultValue={tab1} className="w-full">
        <TabsList>
          <TabsTrigger value={tab1}>{tab1}</TabsTrigger>
          <TabsTrigger value={tab2}>{tab2}</TabsTrigger>
        </TabsList>
        <TabsContent value={tab1}>{tab1content}</TabsContent>
        <TabsContent value={tab2}>{tab2content}</TabsContent>
      </Tabs>
    </div>
  );
}

const recordData = [29, 19, 3];
function Record() {
  return (
    <>
      <div className="flex justify-between text-xl">
        <div className="font-bold p-2">전적</div>
        <div className="p-2">
          {recordData[0]}승 {recordData[1]}패 {recordData[2]}무
        </div>
      </div>
    </>
  );
}

function HotChallenge() {
  const [hotTopic, setHotTopic] = useState<string[]>([]);
  useEffect(() => {
    setHotTopic(['물마시기', '걷기', '공부']);

    // {
    //     axios
    //         .get('/hotTopic')
    //         .then((response) => {
    //             console.log('HotTopicData', response.data);
    //             setHotTopic(response.data);
    //         })
    //         .catch((error) => {
    //             console.error('HotChallenge Component에서 오류발생 :', error);
    //         });
    // }
  }, []);

  return (
    <>
      <div className="flex gap-2 text-center">
        {hotTopic.map((topic, idx) => {
          return (
            <div key={idx} className="rounded-lg border-solid border-2 border-pink-500 bg-white  w-full m-2 p-2">
              {topic}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Ranking() {
  const [ranking, setRanking] = useState<users[]>([]);
  useEffect(() => {
    {
      axios
        .get('http://3.34.122.205:3000/Ranking')
        .then((response) => {
          console.log('ranking axios response', response);
          setRanking(response.data);
        })
        .catch((error) => {
          console.error('ranking component에서 axios 에러', error);
        });
    }
  });
  return (
    <div className="flex flex-col gap-3 p-2 font-bold ">
      {ranking.map((rank: users, idx) => {
        return (
          <div key={idx}>
            <div>{idx + 1}위 </div>
            <div>{rank.nickname}</div>
            <div>{rank.score_num}</div>
          </div>
        );
      })}
    </div>
  );
}

function ListComponentWithButton({ challenge }: any) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col mb-[5%]">
        <Link to={`/challengeDetail/${challenge.challenge_id}`} className=" text-black no-underline">
          <div className="flex justify-between">
            <p>{challenge.challenge_name}</p>
            <p></p>
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

function ListComponentWithPeriod({ challenge }: any) {
  return (
    <div>
      <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col mb-[5%]">
        <Link to={`/challengeDetail/${challenge.challenge_id}`} className=" text-black no-underline">
          <div className="flex justify-between">
            <p>{challenge.challenge_name}</p>
            <p>
              {challenge.authentication_start_date}~{challenge.authentication_end_date}
            </p>
          </div>
          <p>{challenge.goal_money}원</p>
        </Link>
      </div>
    </div>
  );
}
export { CreateChallenge, Tab, Record, HotChallenge, Ranking, ListComponentWithButton, ListComponentWithPeriod };
