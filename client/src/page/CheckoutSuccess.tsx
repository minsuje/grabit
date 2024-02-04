// import axios from '@/api/axios';
import axios, { privateApi } from '@/api/axios';
import { useState } from 'react';
import { useSearchParams} from 'react-router-dom';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  async function confirmPayment() {
    // TODO: API를 호출해서 서버에게 paymentKey, orderId, amount를 넘겨주세요.
    // 서버에선 해당 데이터를 가지고 승인 API를 호출하면 결제가 완료됩니다.
    // https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
    const response = await axios({
      url:"/checkout/confirm",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    }).then((res) => { 
      console.log('post 요청에 대한 > ', res)
      if (res)
      {setIsConfirmed(true);}})
      const response2 = await privateApi({
        url:"http://localhost:3000/updpateMoney",
        method: "POST",
        
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        data:{
          amount:amount
        }
      }).then((res) => { 
        console.log('post 요청에 대한 > ', res.data)})
  }

  return (
    <div className="wrapper w-100">
      {isConfirmed ? (
        <div
          className="flex-column align-center confirm-success w-100 max-w-540"
          style={{
            display: "flex"
          }}
        >
          <img
            src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
            width="120"
            height="120"
          />
          <h2 className="title">결제 완료</h2>
          <div className="response-section w-100">
            <div className="flex justify-between">
              <span className="response-label">결제 금액</span>
              <span id="amount" className="response-text">
                {amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="response-label">주문번호</span>
              <span id="orderId" className="response-text">
                {orderId}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-column align-center confirm-loading w-100 max-w-540">
          <div className="flex-column align-center">
            <img
              src="https://static.toss.im/lotties/loading-spot-apng.png"
              width="120"
              height="120"
            />
            <h2 className="title text-center">결제 요청에 성공했습니다.</h2>
          </div>
          <div className="w-100">
            <button className="btn primary w-100" onClick={confirmPayment}>
            결제 완료
          </button>
          </div>
        </div>
      )}
    </div>
  );
}
