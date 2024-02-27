import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import Cta from '@/components/Cta';
import { useNavigate } from 'react-router-dom';

function ChallengeNotice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState<boolean>(false);

  function handleCheckboxChange(checked: boolean) {
    setConfirm(checked);
  }

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 안내', backPath: -1 }));
  }, [dispatch]);

  function handleSubmit() {
    if (confirm) {
      navigate('/challengeCreate');
    } else {
      alert('챌린지 참여 주의사항을 확인해주세요');
    }
  }

  return (
    <div className="flex flex-col">
      <div className="text flex flex-col gap-5">
        <h1 className="font-bold text-grabit-600">챌린지 규칙</h1>
        <div className="flex flex-col gap-1">
          <h2>인증 주기</h2>
          <h3 className="text-grabit-600">매일</h3>
          <p>인증 기간 동안 1일 1회 인증 </p>
          <h3 className="text-grabit-600">주 3일</h3>
          <p> 챌린지 시작 날짜부터 일주일 동안 요일 관계 없이 3일 인증</p>
          <h3 className="text-grabit-600">주 5일</h3>
          <p> 챌린지 시작 날짜부터 일주일 동안 요일 관계 없이 5일 인증</p>

          <div className="border-2 border-grabit-400 p-3">
            <p className="text-grabit-500">예시</p>
            <p>
              목요일 부터 시작하는 1주일 / 주3일 챌린지의 경우
              <br />
              목요일 ~ 차주 수요일 까지 요일 관계없이 3일 인증해야 성공
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2>챌린지 결과에 따른 보상 안내</h2>
          <div className="flex flex-col gap-2">
            <h3 className="text-grabit-600"> 포인트</h3>
            <p className="text-sm text-gray-500">
              다른 참가자의 성공 여부에 관계없이 본인의 성공 여부에 따라 결정됩니다.
            </p>
            <p>
              챌린지 성공시 <span className=" text-l text-grabit-600"> + 100p </span>
            </p>
            <p>
              챌린지 성공시 <span className=" text-l text-grabit-600"> - 50p </span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-grabit-600"> 캐럿 </h3>
            <p className="text-sm text-gray-500">다른 참가자의 성공 여부에 따라 결정됩니다.</p>

            <p>
              모두 성공시{' '}
              <span className=" text-l text-grabit-600"> 수수료 3.3%를 제외한 캐럿을 상금으로 받습니다. </span>
            </p>

            <p>
              일부 인원만 성공시{' '}
              <span className=" text-l text-grabit-600">
                {' '}
                3.3%를 제외한 캐럿 + 실패한 사람의 캐럿을 성공한 사람 끼리 나눠갖습니다.
              </span>
            </p>

            <p>
              모두 실패시 <span className=" text-l text-grabit-600"> 캐럿을 돌려받을 수 없습니다. </span>
            </p>

            <div className="border-2 border-grabit-400 p-3">
              <p className="text-grabit-500">예시</p>
              <p>
                참가 인원 4명 목표 캐럿이 2000 캐럿인 경우
                <br />
                1. 모두 성공시 4명 모두 1934 캐럿씩 환급
                <br />
                2. 1명 성공 / 3명 실패시
                <br />
                성공한 사람에게 1934원 + 1934 *3 = 7736 캐럿 환급
              </p>
            </div>
          </div>
        </div>

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

      <div className="bottom fixed bottom-24 left-0 right-0 p-4"></div>
      <br />
      <Cta text={'챌린지 참여'} onclick={handleSubmit} disabled={!confirm} />
    </div>
  );
}

export default ChallengeNotice;
