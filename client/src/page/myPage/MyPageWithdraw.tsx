import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Cta from '@/components/Cta';
import { useNavigate } from 'react-router-dom';

export default function MyPageWithdraw() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [money, setMoney] = useState<string>('');
  const [bank_num, setBank_num] = useState<string>('');
  const [bank_name, setBank_name] = useState<string>('');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '출금 신청', backPath: `/mypage` }));
  }, [dispatch]);

  const handleSubmit = async () => {
    try {
      await privateApi
        .post('/requsetWithdraw', {
          money,
          bank_num,
          bank_name,
          name,
        })
        .then(() => {
          alert('출금 신청이 완료되었습니다. 최대 2주일 소요될 수 있습니다.');
          navigate('/mypage');
        });
    } catch (error) {
      console.error('Error during API call', error);
    }
  };

  const handleSelectChange = (selectedValue: any) => {
    setBank_name(selectedValue);
  };

  return (
    <div>
      <div className="flex flex-col gap-8">
        <h1>출금 신청</h1>
        <div className="flex flex-col gap-2 ">
          <h2>출금 금액</h2>
          <Input
            type="number"
            name="money"
            placeholder="금액입력"
            value={money}
            onChange={(e) => setMoney(e.target.value)}
          />
          <p className="text-sm text-stone-400">출금 신청은 10,000캐럿부터 가능합니다</p>
        </div>

        <div className="flex flex-col gap-2">
          <h2>이름</h2>
          <Input
            type="text"
            name="name"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2>계좌번호</h2>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="은행을 선택해주세요 " />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="카카오">카카오</SelectItem>
              <SelectItem value="토스">토스</SelectItem>
              <SelectItem value="국민">국민</SelectItem>
              <SelectItem value="케이뱅크">케이뱅크</SelectItem>
              <SelectItem value="농협">농협</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            name="bank_num"
            placeholder="계좌번호를 입력하세요"
            value={bank_num}
            onChange={(e) => setBank_num(e.target.value)}
          />
        </div>
        <Cta text={'출금 신청'} onclick={handleSubmit} />
      </div>
    </div>
  );
}
