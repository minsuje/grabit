import { Button } from '@/components/ui/button';
import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MypageWithdraw() {
  const dispatch = useDispatch();
  const [money, setMoney] = useState<string>('');
  const [bank_num, setBank_num] = useState<string>('');
  const [bank_name, setBank_name] = useState<string>('');
  const [name, setName] = useState<string>('');

  console.log(money);
  console.log(bank_num);
  console.log(bank_name);
  console.log(name);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '출금 신청', backPath: `/mypage` }));
  }, [dispatch]);

  const handleSubmit = async () => {
    try {
      const response = await privateApi
        .post('http://localhost:3000/requsetWithdraw', {
          money,
          bank_num,
          bank_name,
          name,
        })
        .then();
      console.log(response.data);
    } catch (error) {
      console.error('Error during API call', error);
    }
  };

  const handleSelectChange = (selectedValue: any) => {
    setBank_name(selectedValue);
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
            name="money"
            placeholder="금액입력"
            value={money}
            onChange={(e) => setMoney(e.target.value)}
          />
          <p>출금 신청은 10,000원부터 가능합니다.</p>
        </div>

        <div>
          <h1>계좌번호</h1>
          <input
            type="text"
            name="bank_num"
            placeholder="게좌번호를 입력하세요"
            value={bank_num}
            onChange={(e) => setBank_num(e.target.value)}
          />
        </div>

        <div>
          <h1>이름</h1>
          <input
            type="text"
            name="name"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="출금은행" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="카카오">카카오</SelectItem>
            <SelectItem value="토스">토스</SelectItem>
            <SelectItem value="국민">국민</SelectItem>
            <SelectItem value="케이뱅크">케이뱅크</SelectItem>
            <SelectItem value="농협">농협</SelectItem>
          </SelectContent>
        </Select>
      </form>
      <Button type="submit" onClick={handleSubmit}>
        출금 신청
      </Button>
    </div>
  );
}
