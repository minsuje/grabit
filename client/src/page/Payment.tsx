import { Link } from 'react-router-dom';

interface Props {
  price: number;
  setPrice: (price: number) => void;
}

function Payment({ price, setPrice }: Props) {
  //   async function handlePayment() {
  //     const payment = await axios({
  //       method: 'get',
  //       url: '/checkout',
  //     });
  //   }
  return (
    <>
      <div id="price-box">
        <div  onClick={() => setPrice(1000)}><span>850 캐럿</span><span>1000 원</span></div>
        <div  onClick={() => setPrice(2000)}><span>1700 캐럿</span><span>2000 원</span></div>
        <div  onClick={() => setPrice(5000)}><span>4800 캐럿</span><span>5000 원</span></div>
        <div  onClick={() => setPrice(10000)}><span>10000 캐럿</span><span>10000 원</span></div>
      </div>
      <div>
        <span>결제 금액: {price}</span>
      </div>
      <Link to={'/checkout'}>다음</Link>
    </>
  );
}

export default Payment;
