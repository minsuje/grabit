import { useEffect, useState } from 'react';
import axios from '@/api/axios';
import { users } from '@/types/types';
import { motion, useMotionValue, animate } from 'framer-motion';

export default function Ranking() {
  const [ranking, setRanking] = useState<users[]>([]);
  const [topScore, setTopScore] = useState<number>(0);
  // const [load, setLoad] = useState<boolean>(false);

  const count = useMotionValue(0);
  // const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, 100);

    return controls.stop;
  }, []);

  useEffect(() => {
    {
      axios
        .get('/Ranking')
        .then((response) => {
          response.data?.sort((a: { score_num: number }, b: { score_num: number }) => b.score_num - a.score_num);
          const reorderedData = [response.data[1], response.data[0], response.data[2]];

          setRanking(reorderedData);

          setTopScore(response.data[0].score_num);
          // setLoad(true);
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
          <div
            key={idx}
            className="font-['SUITE Variable'] relative mt-10 flex w-full flex-col items-center justify-center gap-4"
          >
            <motion.div
              className="h-40 w-20 rounded-t-md bg-gradient-to-t from-transparent to-grabit-700"
              style={{ originY: 1 }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: rank.score_num / topScore }}
              transition={{ duration: 0.7, delay: 0.3 }}
            ></motion.div>
            <motion.div
              className="z-20 flex w-full flex-col items-center justify-center gap-2"
              style={{ originY: 1 }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: (rank.score_num / topScore) * -160 - 60 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {/* <span className="w-full text-xl font-bold">{idx + 1}</span> */}
              <span className="w-full text-sm font-bold text-grabit-700">{rank.nickname}</span>
              <span className="z-10 flex w-fit rounded-full bg-grabit-200 px-2 py-1 text-center text-sm font-extrabold">
                {rank.score_num}
              </span>
            </motion.div>
            {/* <motion.div>{rounded}</motion.div> */}
          </div>
        );
      })}
    </div>
  );
}
