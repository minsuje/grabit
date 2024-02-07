import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { privateApi } from '@/api/axios';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

export default function MypageCharge() {
  const dispatch = useDispatch();
  const [chargeAmount, setChargeAmount] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '캐럿 충전', backPath: `/mypage` }));
  }, [dispatch]);

  const handleChargeClick = (amount: number) => {
    setChargeAmount(amount);
    setShowWarning(false);
  };
  const handleChargeSubmit = async () => {
    if (chargeAmount !== null) {
      try {
        // 서버로 충전 요청을 보냅니다.
        await privateApi.post('', {
          amount: chargeAmount,
        });
        navigate('/mypage'); // 충전 후 Mypage로 이동
      } catch (error) {
        console.error('충전 요청 실패:', error);
        // 에러 처리 로직
      }
    } else {
      setShowWarning(true); // 금액이 선택되지 않았을 경우 경고 메시지를 표시
    }
  };

  return (
    <div>
      <div>
        <h1>출금</h1>
      </div>
      <div>
        <Button onClick={() => handleChargeClick(1000)}>1000</Button>
        <Button onClick={() => handleChargeClick(5000)}>5000</Button>
        <Button onClick={() => handleChargeClick(10000)}>10000</Button>
      </div>
      {showWarning && <p className="text-xs text-red-500">금액을 입력해주세요.</p>}
      <div>
        <button onClick={handleChargeSubmit}>충전하기</button>
      </div>
    </div>
  );
}
