import { useEffect, useState } from 'react';
import axios from '@/api/axios';
import { users } from '@/types/types';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function Ranking() {
  const [ranking, setRanking] = useState<users[]>([]);
  const [topScore, setTopScore] = useState<number>(0);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, 100);

    return controls.stop;
  }, []);

  useEffect(() => {
    {
      console.log('ranking component 실행');
      axios
        .get('http://3.34.122.205:3000/Ranking', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
        })
        .then((response) => {
          console.log('랭킹 axios');
          console.log('ranking axios response', response);
          setRanking(response.data);
          setTopScore(response.data[0].score_num);
        })
        .catch((error) => {
          console.error('ranking component에서 axios 에러', error);
        });
    }
  }, []);

  return (
    <div className="flex p-2 text-center text-grabit-700">
      {ranking?.map((rank: users, idx) => {
        return (
          <div key={idx} className="flex w-full flex-col items-center justify-center gap-2 font-['JalnanGothic']">
            <span className="w-full text-2xl font-bold">{idx + 1}위</span>
            <span className="w-full text-xl font-bold">{rank.nickname}</span>
            <span className="animate-text z-10 flex bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-center text-4xl font-bold text-transparent">
              {rank.score_num}
            </span>
            <motion.div
              className="h-24 w-12 rounded-t-md bg-gradient-to-t from-transparent to-grabit-700"
              style={{ originY: 1 }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: rank.score_num / topScore }}
              transition={{ duration: 0.7, delay: 0.3 }}
            ></motion.div>
            <motion.div>{rounded}</motion.div>
          </div>
        );
      })}
    </div>
  );
}
