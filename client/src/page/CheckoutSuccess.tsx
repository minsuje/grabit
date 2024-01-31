import { useSearchParams } from 'react-router-dom';

export default async function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  // console.log('searchParams >> ', searchParams.get('amount'));
  // const response = await fetch(`https://api.tosspayments.com/v1/payments/${searchParams.get('paymentKey')}`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     paymentKey: searchParams.get('paymentKey'),
  //     orderId: searchParams.get('orderId'),
  //     amount: searchParams.get('amount'),
  //   }),
  // });
  // console.log('response >>>> ', response);

  return (
    <div>
      <h1>결제 성공</h1>
      <div>{`주문 아이디: ${searchParams.get('orderId')}`}</div>
      <div>{`결제 금액: ${Number(searchParams.get('amount')).toLocaleString()}원`}</div>
    </div>
  );
}
