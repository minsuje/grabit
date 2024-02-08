import { useEffect, useRef } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { nanoid } from 'nanoid';
import { privateApi } from '@/api/axios';
import Cta from '@/components/Cta';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

interface Props {
  price: number;
}

function CheckoutPage({ price }: Props) {
  const dispatch = useDispatch();
  let username: string;
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '주문서', backPath: `/payment` }));
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(
        import.meta.env.VITE_TOSS_CLIENT_KEY,
        import.meta.env.VITE_TOSS_USER_KEY,
      ); // 1 ->     userid_num

      paymentWidget.renderPaymentMethods('#payment-widget', price);

      paymentWidgetRef.current = paymentWidget;
    })();
  }, [price]);

  useEffect(() => {
    privateApi.post('/userInfo').then((res) => {
      username = res.data.user[0].name;
    });
  }, []);

  async function handlePayment() {
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
      console.error(err);
    }
  }

  return (
    <div className="App">
      <h1>주문서</h1>
      <div id="payment-widget" />

      <Cta text={'결제하기'} onclick={handlePayment} />
    </div>
  );
}

export default CheckoutPage;
