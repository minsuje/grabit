import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import Cta from '@/components/Cta';

function ChallengeNotice() {
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState<boolean>(false);

  function handleCheckboxChange(checked: boolean) {
    setConfirm(checked);
  }

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 안내', backPath: -1 }));
  }, [dispatch]);

  function handleSubmit() {
    if (confirm) {
      console.log('챌린지 참여');
    } else {
      console.log('챌린지 참여 안함');
    }
  }

  return (
    <div className="flex flex-col">
      <div className="text flex flex-col">
        <h1 className="font-bold text-grabit-600">챌린지 참여 주의사항</h1>
        <p className="text-grabit-500">챌린지 참여 시 수수료 3%가 적용됩니다</p>
        <p className="text-grabit-500">수수료 3%는 서비스 운영에 이용됩니다</p>
      </div>

      <div className="bottom fixed bottom-24 left-0 right-0 p-4">
        <div className="check flex gap-2">
          <Checkbox id="terms" checked={confirm} onCheckedChange={handleCheckboxChange} />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            확인했습니다
          </label>
        </div>
      </div>
      <br />
      <Cta text={'챌린지 참여'} onclick={handleSubmit} disabled={!confirm} />
    </div>
  );
}

export default ChallengeNotice;
