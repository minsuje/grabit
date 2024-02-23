import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { privateApi } from '@/api/axios';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChallengeProp, Challenge } from '@/types/types';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { RiVipDiamondFill } from 'react-icons/ri';

function CreateChallenge() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 col-start-1 text-xl font-bold ">주제</div>
        <div className="col-span-1 col-start-1">
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
        <input className="col-span-2 col-start-2 p-2" placeholder="이름" />
      </div>
    </>
  );
}

function Tab({
  tab1,
  tab2,
  tab3,
  tab4,
  tab1content,
  tab2content,
  tab3content,
  tab4content,
}: {
  tab1: string;
  tab2: string;
  tab3?: string;
  tab4?: string;
  tab1content: JSX.Element;
  tab2content: JSX.Element;
  tab3content?: JSX.Element;
  tab4content?: JSX.Element;
}) {
  return (
    <div className="mt-10 w-full">
      <Tabs defaultValue={tab1} className="w-full">
        <TabsList>
          <TabsTrigger value={tab1}>{tab1}</TabsTrigger>
          <TabsTrigger value={tab2}>{tab2}</TabsTrigger>

          {tab3 && <TabsTrigger value={tab3}>{tab3}</TabsTrigger>}
          {tab4 && <TabsTrigger value={tab4}>{tab4}</TabsTrigger>}
        </TabsList>
        <TabsContent value={tab1}>{tab1content}</TabsContent>
        <TabsContent value={tab2}>{tab2content}</TabsContent>
        {tab3 && <TabsContent value={tab3}>{tab3content}</TabsContent>}
        {tab4 && <TabsContent value={tab4}>{tab4content}</TabsContent>}
      </Tabs>
    </div>
  );
}

const recordData = [29, 19, 3];
function Record() {
  return (
    <>
      <div className="flex justify-between text-xl">
        <div className="p-2 font-bold">전적</div>
        <div className="p-2">
          {recordData[0]}승 {recordData[1]}패 {recordData[2]}무
        </div>
      </div>
    </>
  );
}

function HotChallenge() {
  // 가장 인기있는 주제 3개
  const [hotTopic, setHotTopic] = useState<string[]>([]);
  // 각각의 주제에 맞는 챌린지 3개씩ㅇ
  const [top1, setTop1] = useState<Challenge[]>([]);
  const [top2, setTop2] = useState<Challenge[]>([]);
  const [top3, setTop3] = useState<Challenge[]>([]);
  // 화면에 보여줄 챌린지를 저장
  const [showList, setShowList] = useState<Challenge[]>([]);

  useEffect(() => {
    {
      privateApi
        .get('/popularChallenge')
        .then((response) => {
          setHotTopic(response.data.popularTopics);
          setTop1(response.data.top1);
          setTop2(response.data.top2);
          setTop3(response.data.top3);
        })
        .catch((error) => {
          console.error('HotChallenge Component에서 오류발생 :', error);
        });
    }
  }, []);

  function showHotChallengeList(key: number) {
    key += 1;
    switch (key) {
      case 1:
        setShowList(top1);
        break;
      case 2:
        setShowList(top2);
        break;
      case 3:
        setShowList(top3);
        break;
      default:
        setShowList([]);
        break;
    }
  }

  return (
    <>
      <ToggleGroup type="single" className="flex flex-wrap justify-start gap-2">
        {hotTopic.map((topic, idx) => {
          return (
            <ToggleGroupItem
              onClick={() => showHotChallengeList(idx)}
              key={idx}
              value={'운동'}
              className="flex w-fit gap-4 rounded-full border-solid bg-grabit-300 px-6 text-white"
            >
              {topic}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      {showList.length != 0
        ? showList.map((challenge: Challenge, idx: number) => {
            return <ListComponentWithPeriod key={idx} challenge={challenge}></ListComponentWithPeriod>;
          })
        : null}
    </>
  );
}

function ListComponentWithPeriod({ challenge }: ChallengeProp) {
  return (
    <div>
      <div className=" flex flex-col rounded-lg bg-white p-6 shadow-lg shadow-grabit-600/10">
        <Link to={`/challengeDetail/${challenge.challenge_id}`} className="flex flex-col gap-2  no-underline">
          <div className="flex flex-col justify-between gap-2">
            <p className="text-xl font-bold text-grabit-700">{challenge.challenge_name}</p>
            <p className="text-sm text-grabit-400">
              {format(challenge.authentication_start_date, 'PP (EEE)', { locale: ko })} ~{' '}
              {format(challenge.authentication_end_date, 'PP (EEE)', { locale: ko })}
            </p>
          </div>
          <div className="flex w-full items-center justify-end gap-2 text-right text-2xl font-extrabold text-grabit-800">
            <RiVipDiamondFill className="text-grabit-400" />
            <div className="flex items-end gap-1">
              <p>{challenge.goal_money}</p>
              <span className="mb-[3px] align-top text-sm font-bold text-grabit-400">캐럿</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
export { CreateChallenge, Tab, Record, HotChallenge, ListComponentWithPeriod };
