import { useEffect, useRef } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { nanoid } from 'nanoid';

interface Props {
  price: number;
}

function CheckoutPage({ price }: Props) {
  // const [price, setPrice] = useState<number>(0);
  // const price = 1000;

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(import.meta.env.VITE_TOSS_CLIENT_KEY, '1456ssd'); // 1 ->     userid_num

      paymentWidget.renderPaymentMethods('#payment-widget', price);

      paymentWidgetRef.current = paymentWidget;
    })();
  }, [price]);

  return (
    <div className="App">
      <h1>주문서</h1>
      <div id="payment-widget" />
      {/* <select name="price" id="price" onChange={handlePrice}>
        <option value="1000">1000원</option>
        <option value="5000">5000원</option>
        <option value="10000">10000원</option>
      </select> */}

      <button
        onClick={async () => {
          const paymentWidget = paymentWidgetRef.current;

          try {
            await paymentWidget?.requestPayment({
              orderId: nanoid(),
              orderName: '토스 티셔츠 외 2건',
              customerName: '김토스',
              customerEmail: 'customer123@gmail.com',
              // successUrl: `${window.location.origin}/success`,
              // successUrl: `${window.location.origin}/checkout/success`,
              successUrl: `http://localhost:3000/checkout/success`,
              failUrl: `http://localhost:3000/checkout/fail`,
              // failUrl: `${window.location.origin}/checkout/fail`,
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
