import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setHeaderInfo } from '@/store/headerSlice';

export default function Home() {
  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '', backPath: '/' }));
  }, [dispatch]);

  return (
    <div className="flex h-[calc(100dvh)] w-screen flex-col items-center justify-center">
      <div className="relative flex max-w-md flex-col items-center justify-center gap-4 text-center">
        <div className="flex w-screen -translate-y-20 flex-col items-center justify-center gap-4">
          <img src="/grabit_logo.svg" alt="" width={160} />
          <h3 className="text-sm font-medium text-gray-500">습관을 그래빗!</h3>
        </div>
        <div className="fixed bottom-0 left-0 right-0 flex flex-col gap-4 p-5">
          <Link to="/login" className="">
            <Button variant="default" className="w-full">
              로그인
            </Button>
          </Link>
          <Link
            to={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`}
          >
            <Button variant="default" className="flex w-full gap-2 bg-[#FEE500] text-[#191919] hover:bg-[#fff40d]">
              <img src="/kakao.svg" alt="" width={18} />
              <span>카카오 로그인</span>
            </Button>
          </Link>
          <div>
            <span className="text-sm text-gray-500">아직 회원이 아니신가요?</span>
            <Link to="/register/normal" className=" ">
              <Button variant="link" size={'sm'} className="text-sm">
                회원가입
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
