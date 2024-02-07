import { useEffect, useState } from 'react';
import { privateApi } from '@/api/axios';
import { Challenge } from '@/types/types';
import { ListComponentWithPeriod } from './Component0117';
import { AnimatePresence, Variants, motion } from 'framer-motion';

const tabContentVariants: Variants = {
  initial: {
    y: 10,
    opacity: 0,
  },
  enter: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -10,
    opacity: 0,
  },
};
interface TabContentProps {
  name: string;
  label: string;
  render: () => JSX.Element;
}

function HotChallenge() {
  // 가장 인기있는 주제 3개
  const [hotTopic, setHotTopic] = useState<string[]>([]);
  // 각각의 주제에 맞는 챌린지 3개씩
  const [top1, setTop1] = useState<Challenge[]>([]);
  const [top2, setTop2] = useState<Challenge[]>([]);
  const [top3, setTop3] = useState<Challenge[]>([]);
  // 화면에 보여줄 챌린지를 저장

  const handleClick = (e: any, tab: any) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  const tabs = [
    {
      name: 'tab1',
      label: hotTopic[0],
      render: () => {
        return (
          <div className="flex flex-col gap-4">
            {top1.length != 0
              ? top1.map((challenge: Challenge, idx: number) => {
                  return <ListComponentWithPeriod key={idx} challenge={challenge}></ListComponentWithPeriod>;
                })
              : null}
          </div>
        );
      },
    },
    {
      name: 'tab2',
      label: hotTopic[1],
      render: () => {
        return (
          <div className="flex flex-col gap-4">
            {top2.length != 0
              ? top2.map((challenge: Challenge, idx: number) => {
                  return <ListComponentWithPeriod key={idx} challenge={challenge}></ListComponentWithPeriod>;
                })
              : null}
          </div>
        );
      },
    },
    {
      name: 'tab3',
      label: hotTopic[2],
      render: () => {
        return (
          <div className="flex flex-col gap-4">
            {top3.length != 0
              ? top3.map((challenge: Challenge, idx: number) => {
                  return <ListComponentWithPeriod key={idx} challenge={challenge}></ListComponentWithPeriod>;
                })
              : null}
          </div>
        );
      },
    },
  ];

  const [activeTab, setActiveTab] = useState<TabContentProps>(tabs[0]);
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
  useEffect(() => {
    setActiveTab(tabs[0]);
  }, [hotTopic]);

  const isSelected = (tab: any) => activeTab.name === tab.name;

  return (
    <>
      <div className="flex justify-start gap-2">
        {tabs.map((tab) => (
          <a href="#" key={tab.name} onClick={(e: any) => handleClick(e, tab)}>
            <div
              key={tab.name}
              className={
                isSelected(tab)
                  ? 'w-fit gap-4 rounded-full border-solid bg-grabit-600 px-6 py-3 text-white'
                  : 'w-fit gap-4 rounded-full border-solid bg-grabit-400 px-6 py-3 text-white'
              }
            >
              {tab.label}
              {isSelected(tab) && <motion.div layoutId="indicator" />}
            </div>
          </a>
        ))}
      </div>

      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.name || 'empty'}
            variants={tabContentVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{
              duration: 0.3,
            }}
          >
            {activeTab && activeTab.render()}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
export default HotChallenge;
