import { useSearchParams } from 'react-router-dom';
import Cta from '../components/Cta';
import { useNavigate } from 'react-router-dom';

export default function CheckoutFail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  function handleNavigate() {
    navigate('/mypage');
  }

  return (
    <div className="wrapper container h-screen w-full">
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center">
        <img src="https://static.toss.im/lotties/error-spot-apng.png" width="120" height="120" />
        <h2 className="title">결제를 실패했어요</h2>
        <div className="response-section absolute bottom-28 left-8 right-8 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="response-label text-stone-500">code</span>
            <span id="error-code" className="response-text">
              {errorCode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="response-label text-stone-500">message</span>
            <span id="error-message" className="response-text">
              {errorMessage}
            </span>
          </div>
        </div>
      </div>
      <Cta text={'마이페이지로'} onclick={handleNavigate} />
    </div>
  );
}
