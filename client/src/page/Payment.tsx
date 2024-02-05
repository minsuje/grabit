import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { motion } from 'framer-motion';
import Cta from '@/components/Cta';
import { useNavigate } from 'react-router-dom';

interface Props {
  price: number;
  setPrice: (price: number) => void;
}

function Payment({ price, setPrice }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<boolean>(true);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '캐럿 충전', backPath: `/mypage` }));
  }, [dispatch]);
  //   async function handlePayment() {
  //     const payment = await axios({
  //       method: 'get',
  //       url: '/checkout',
  //     });
  //   }

  useEffect(() => {
    if (price !== 0) {
      setError(false);
    }
  }, [price]);

  function handleNext() {
    navigate('/checkout');
  }

  return (
    <div>
      <div>
        <h1>캐럿 충전</h1>
      </div>
      <div id="price-box" className="my-8 grid select-none grid-cols-2 gap-4">
        <motion.div
          whileTap={{ scale: 0.93 }}
          initial={{ scale: 1 }}
          onClick={() => setPrice(1000)}
          className={
            price === 1000
              ? `flex flex-col items-center justify-center gap-1 rounded-xl bg-grabit-100 p-4 ring-2 ring-grabit-500`
              : `flex flex-col items-center justify-center gap-1 rounded-xl p-4 ring-2 ring-grabit-100`
          }
        >
          <span className="flex text-center text-xl font-extrabold text-grabit-700">850 캐럿</span>
          <span className="flex font-bold text-stone-400">1000 원</span>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.93 }}
          initial={{ scale: 1 }}
          onClick={() => setPrice(2000)}
          className={
            price === 2000
              ? `flex flex-col items-center justify-center gap-1 rounded-xl bg-grabit-100 p-4 ring-2 ring-grabit-500`
              : `flex flex-col items-center justify-center gap-1 rounded-xl p-4 ring-2 ring-grabit-100`
          }
        >
          <span className="flex text-center text-xl font-extrabold text-grabit-700">1700 캐럿</span>
          <span className="flex font-bold text-stone-400">2000 원</span>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.93 }}
          initial={{ scale: 1 }}
          onClick={() => setPrice(5000)}
          className={
            price === 5000
              ? `flex flex-col items-center justify-center gap-1 rounded-xl bg-grabit-100 p-4 ring-2 ring-grabit-500`
              : `flex flex-col items-center justify-center gap-1 rounded-xl p-4 ring-2 ring-grabit-100`
          }
        >
          <span className="flex text-center text-xl font-extrabold text-grabit-700">4800 캐럿</span>
          <span className="flex font-bold text-stone-400">5000 원</span>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.93 }}
          initial={{ scale: 1 }}
          onClick={() => setPrice(10000)}
          className={
            price === 10000
              ? `flex flex-col items-center justify-center gap-1 rounded-xl bg-grabit-100 p-4 ring-2 ring-grabit-500`
              : `flex flex-col items-center justify-center gap-1 rounded-xl p-4 ring-2 ring-grabit-100`
          }
        >
          <span className="flex text-center text-xl font-extrabold text-grabit-700">10000 캐럿</span>
          <span className="flex font-bold text-stone-400">10000 원</span>
        </motion.div>
      </div>
      {/* <div>
        <span>결제 금액: {price}</span>
      </div> */}

      <Cta text={'다음'} onclick={handleNext} disabled={error} />
    </div>
  );
}

export default Payment;
