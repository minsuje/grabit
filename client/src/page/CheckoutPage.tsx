import { useEffect, useRef,useState } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance, ANONYMOUS} from '@tosspayments/payment-widget-sdk';
import { nanoid } from 'nanoid';
import axios, { privateApi } from '@/api/axios';

interface Props {
  price: number;
}

function CheckoutPage({ price }: Props) {
  let username:string
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(import.meta.env.VITE_TOSS_CLIENT_KEY, import.meta.env.VITE_TOSS_USER_KEY); // 1 ->     userid_num

      paymentWidget.renderPaymentMethods('#payment-widget', price);

      paymentWidgetRef.current = paymentWidget;
    })();
  }, [price]);

  useEffect(() => {
    console.log('accessToken >>>>>>', localStorage.getItem('accessToken'))
    privateApi.post('http://localhost:3000/userInfo', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
    }).then((res) => {
      console.log('res', res.data.user[0])
      username = res.data.user[0].name
    })
  }, [])

  return (
    <div className="App">
      <h1>주문서</h1>
      <div id="payment-widget" />

      <button
        onClick={async () => {
          const paymentWidget = paymentWidgetRef.current;

          try {
            await paymentWidget?.requestPayment({
              orderId: nanoid(),
              orderName: '캐럿 충전',
              customerName: `${username}`,
              successUrl: `${window.location.origin}/checkout/success`,
              failUrl: `${window.location.origin}/checkout/fail`,
            });
          } catch (err) {
            console.log(err);
          }
        }}
      >
        결제하기
      </button>
    </div>
  );
}

export default CheckoutPage;
