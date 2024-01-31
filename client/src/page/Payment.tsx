import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  price: number;
  setPrice: (price: number) => void;
}

function Payment({ price, setPrice }: Props) {
  const [onethousand, setOnethousand] = useState<number>(0);
  const [fivethousand, setFivethousand] = useState<number>(0);
  const [tenthousand, setTenthousand] = useState<number>(0);

  function handleOT() {
    setOnethousand(onethousand + 1);
  }
  function handleFT() {
    setFivethousand(fivethousand + 1);
  }
  function handleTT() {
    setTenthousand(tenthousand + 1);
  }
  setPrice(onethousand * 1000 + fivethousand * 5000 + tenthousand * 10000);

  //   async function handlePayment() {
  //     const payment = await axios({
  //       method: 'get',
  //       url: '/checkout',
  //     });
  //   }
  return (
    <>
      <div id="price-box">
        <button id="1000" onClick={handleOT}>
          1000
        </button>
        <br />
        <button id="5000" onClick={handleFT}>
          5000
        </button>
        <br />
        <button id="10000" onClick={handleTT}>
          10000
        </button>
        <br />
      </div>
      <div>
        <span>총 금액: {price}</span>
      </div>
      <Link to={'/checkout'}>다음</Link>
    </>
  );
}

export default Payment;
