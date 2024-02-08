import axios, { privateApi } from '@/api/axios';
import Cta from '@/components/Cta';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  // const [error, setError] = useState<boolean>(false);

  async function confirmPayment() {
    // TODO: API를 호출해서 서버에게 paymentKey, orderId, amount를 넘겨주세요.
    // 서버에선 해당 데이터를 가지고 승인 API를 호출하면 결제가 완료됩니다.
    // https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
    await axios({
      url: '/checkout/confirm',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        paymentKey,
        orderId,

        amount,
      }),
    }).then((res) => {
      if (res) {
        setIsConfirmed(true);
      }
    });
    await privateApi({
      url: '/updateMoney',
      method: 'POST',
      data: {
        amount: amount,
      },
    }).catch((err) => {
      // setError(true);
      console.error(err);
      alert('캐럿 충전 실패 - 관리자에게 문의해주세요');
    });
  }

  function handleNavigate() {
    navigate('/mypage');
  }

  setTimeout(() => {
    confirmPayment();
    setIsConfirmed(true);
  }, 2000);

  return (
    <div className="wrapper container h-screen w-full">
      {isConfirmed ? (
        <div className="align-center confirm-success w-full flex-col items-center justify-center">
          <div className="flex min-h-[400px] w-full flex-col items-center justify-center">
            <img
              src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
              width="120"
              height="120"
              className="flex"
            />
            <h2 className="title flex">결제 완료</h2>
          </div>
          <div className="response-section absolute bottom-28 left-8 right-8 flex flex-col gap-2 ">
            <div className="flex justify-between">
              <span className="response-label text-stone-500">결제 금액</span>
              <span id="amount" className="response-text font-bold text-stone-700 ">
                {amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="response-label text-stone-500">주문번호</span>
              <span id="orderId" className="response-text font-bold text-stone-700 ">
                {orderId}
              </span>
            </div>
          </div>
          <Cta text={'마이페이지로'} onclick={handleNavigate} />
        </div>
      ) : (
        <div className="confirm-loading flex h-screen w-full flex-col items-center justify-center">
          <div className="flex-column align-center flex flex-col items-center justify-center">
            <img src="https://static.toss.im/lotties/loading-spot-apng.png" width="120" height="120" />
            <h2 className="title text-center">결제중입니다</h2>
          </div>
          {/* <Cta text={'결제 완료'} onclick={confirmPayment} /> */}
        </div>
      )}
    </div>
  );
}
