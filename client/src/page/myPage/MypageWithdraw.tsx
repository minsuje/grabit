import { Button } from '@/components/ui/button';
import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

export default function MypageWithdraw() {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  console.log(amount);
  console.log(accountNumber);
  console.log(password);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '출금 신청', backPath: `/mypage` }));
  }, [dispatch]);

  const handleSubmit = async () => {
    try {
      const response = await privateApi.post('', {
        amount,
        accountNumber,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error during API call', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <h1>출금</h1>
        </div>
        <div>
          <input
            type="text"
            name="amount"
            placeholder="금액입력"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <p>출금 신청은 10,000원부터 가능합니다.</p>
        </div>

        <div>
          <h1>계좌번호</h1>
          <input
            type="text"
            name="accountNumber"
            placeholder="게좌번호를 입력하세요"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        <div>
          <h1>비밀번호</h1>
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </form>
      <Button type="submit">출금 신청</Button>
    </div>
  );
}
